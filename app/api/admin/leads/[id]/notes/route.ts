import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, q1, run, insertReturningId } from '@/lib/admin/pg'
import { requireUser, requireLeadsEditor } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Per-lead activity thread: ticket-style internal notes, each attributed to the
 * user who wrote it, with @mentions and one level of replies.
 *
 * Anyone signed in can read; only lead editors can post.
 *
 * Replies are deliberately one level deep. Deeper nesting is easy to build and
 * miserable to read in a narrow drawer, and a lead conversation is short enough
 * that a flat list of replies under each comment stays followable.
 */

type NoteRow = {
  id: number
  parent_id: number | null
  author_name: string | null
  author_email: string | null
  author_user_id: number | null
  body: string
  created_at: string
  deleted_at: string | null
  edited_at: string | null
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()
  const leadId = Number(params.id)

  const rows = await q<NoteRow>(
    `SELECT id, parent_id, author_name, author_email, author_user_id, body, created_at,
            deleted_at, edited_at
       FROM lead_notes WHERE lead_id = $1 ORDER BY id ASC`,
    [leadId]
  )

  // Mentions for every note on this lead, in one query rather than per note.
  const mentions = await q<{ note_id: number; user_id: number; first_name: string; last_name: string }>(
    `SELECT m.note_id, m.user_id, u.first_name, u.last_name
       FROM lead_note_mentions m JOIN users u ON u.id = m.user_id
      WHERE m.lead_id = $1`,
    [leadId]
  )
  const byNote = new Map<number, { id: number; name: string }[]>()
  for (const m of mentions) {
    const list = byNote.get(m.note_id) ?? []
    list.push({ id: m.user_id, name: `${m.first_name} ${m.last_name}`.trim() })
    byNote.set(m.note_id, list)
  }

  /* Deleted notes are returned as tombstones rather than dropped: their
     replies still need somewhere to hang, and a gap in a thread reads as data
     loss. The body is withheld so a delete is a real delete to readers. */
  const decorate = (n: NoteRow) => ({
    id: n.id,
    parent_id: n.parent_id,
    author_name: n.deleted_at ? null : n.author_name,
    author_email: n.deleted_at ? null : n.author_email,
    body: n.deleted_at ? '' : n.body,
    created_at: n.created_at,
    deleted: !!n.deleted_at,
    edited: !!n.edited_at,
    mine: n.author_user_id
      ? n.author_user_id === auth.user.id
      : (n.author_email ?? '').toLowerCase() === auth.user.email.toLowerCase(),
    mentions: n.deleted_at ? [] : (byNote.get(n.id) ?? []),
  })
  const parents = rows.filter((n) => !n.parent_id)
  const replies = rows.filter((n) => n.parent_id)

  // Newest thread first, but replies oldest-first so a conversation reads down.
  const thread = parents
    .map((p) => ({
      ...decorate(p),
      replies: replies.filter((r) => r.parent_id === p.id).map(decorate),
    }))
    .reverse()

  // How long this lead has gone without anyone writing anything.
  const live = rows.filter((r) => !r.deleted_at)
  const last = live.length ? live[live.length - 1].created_at : null
  // Oldest unresolved mention drives the "waiting on someone" badge.
  const oldestOpen = await q1<{ created_at: string; first_name: string; last_name: string }>(
    `SELECT m.created_at, u.first_name, u.last_name
       FROM lead_note_mentions m JOIN users u ON u.id = m.user_id
      WHERE m.lead_id = $1 AND m.resolved_at IS NULL
      ORDER BY m.created_at ASC LIMIT 1`,
    [leadId]
  )

  return NextResponse.json({
    thread,
    lastActivityAt: last,
    oldestOpenMention: oldestOpen
      ? { at: oldestOpen.created_at, who: `${oldestOpen.first_name} ${oldestOpen.last_name}`.trim() }
      : null,
  })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireLeadsEditor()
  if ('error' in auth) return auth.error
  await ensureDb()
  const leadId = Number(params.id)
  const payload = await req.json().catch(() => ({}))

  const body = String(payload.body ?? '').trim().slice(0, 5000)
  if (!body) return NextResponse.json({ error: 'Note cannot be empty.' }, { status: 400 })

  // Reply target must belong to this lead and be top-level, so a reply can
  // never be attached to another reply or smuggled onto a different lead.
  let parentId: number | null = null
  if (payload.parentId != null) {
    const parent = await q1<{ id: number }>(
      `SELECT id FROM lead_notes WHERE id = $1 AND lead_id = $2 AND parent_id IS NULL`,
      [Number(payload.parentId), leadId]
    )
    if (!parent) return NextResponse.json({ error: 'That comment no longer exists.' }, { status: 400 })
    parentId = parent.id
  }

  const authorName = `${auth.user.first_name} ${auth.user.last_name}`.trim()
  const noteId = await insertReturningId(
    `INSERT INTO lead_notes (lead_id, parent_id, author_name, author_email, author_user_id, body)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [leadId, parentId, authorName, auth.user.email, auth.user.id, body]
  )

  // Only active users can be mentioned, and never yourself - a notification
  // telling you about your own comment is noise.
  const requested = Array.isArray(payload.mentions) ? payload.mentions.map(Number).filter(Boolean) : []
  let mentioned: { id: number }[] = []
  if (requested.length) {
    mentioned = await q<{ id: number }>(
      `SELECT id FROM users WHERE active = 1 AND id <> $1 AND id = ANY($2::int[])`,
      [auth.user.id, requested]
    )
  }

  for (const m of mentioned) {
    await run(
      `INSERT INTO lead_note_mentions (note_id, lead_id, user_id) VALUES ($1,$2,$3)`,
      [noteId, leadId, m.id]
    )
    await run(
      `INSERT INTO notifications (user_id, kind, lead_id, note_id, actor_user_id, preview)
       VALUES ($1,'mention',$2,$3,$4,$5)`,
      [m.id, leadId, noteId, auth.user.id, body.slice(0, 160)]
    )
  }

  // Replying notifies the parent's author too, unless they already got a
  // mention above or they are replying to themselves.
  if (parentId) {
    const parentAuthor = await q1<{ author_user_id: number | null }>(
      `SELECT author_user_id FROM lead_notes WHERE id = $1`, [parentId]
    )
    const target = parentAuthor?.author_user_id
    if (target && target !== auth.user.id && !mentioned.some((m) => m.id === target)) {
      await run(
        `INSERT INTO notifications (user_id, kind, lead_id, note_id, actor_user_id, preview)
         VALUES ($1,'reply',$2,$3,$4,$5)`,
        [target, leadId, noteId, auth.user.id, body.slice(0, 160)]
      )
    }
  }

  // Posting on a lead clears mentions that were waiting on you: the ask has
  // been answered. Everyone else's mentions stay open.
  await run(
    `UPDATE lead_note_mentions SET resolved_at = now()
      WHERE lead_id = $1 AND user_id = $2 AND resolved_at IS NULL`,
    [leadId, auth.user.id]
  )

  await audit(auth.user.email, parentId ? 'lead_note_reply' : 'lead_note_add', `#${leadId}`)
  return NextResponse.json({ ok: true, id: noteId, mentioned: mentioned.length })
}
