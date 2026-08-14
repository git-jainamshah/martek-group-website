import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { requireLeadsEditor } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Edit or soft-delete a single note.
 *
 * Notes are never removed from the table. This thread is the record of who was
 * asked to do what and when, so a note that can be silently erased is worth
 * very little as evidence. A deleted note leaves a visible tombstone and its
 * replies survive underneath.
 *
 * You may only touch your own notes. Admins may delete anyone's (moderation),
 * but may not edit anyone's - putting words in someone else's mouth is a
 * different thing entirely from removing them.
 */
async function loadOwned(leadId: number, noteId: number) {
  return q1<{ id: number; author_user_id: number | null; author_email: string | null; deleted_at: string | null }>(
    `SELECT id, author_user_id, author_email, deleted_at
       FROM lead_notes WHERE id = $1 AND lead_id = $2`,
    [noteId, leadId]
  )
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; noteId: string } }
) {
  const auth = await requireLeadsEditor()
  if ('error' in auth) return auth.error
  await ensureDb()
  const leadId = Number(params.id)
  const noteId = Number(params.noteId)

  const note = await loadOwned(leadId, noteId)
  if (!note) return NextResponse.json({ error: 'Note not found.' }, { status: 404 })
  if (note.deleted_at) return NextResponse.json({ error: 'That note was deleted.' }, { status: 400 })

  // Match on id where we have it, falling back to email for notes written
  // before author_user_id existed.
  const isAuthor = note.author_user_id
    ? note.author_user_id === auth.user.id
    : (note.author_email ?? '').toLowerCase() === auth.user.email.toLowerCase()

  const b = await req.json().catch(() => ({}))

  if (b.action === 'delete') {
    if (!isAuthor && auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'You can only delete your own notes.' }, { status: 403 })
    }
    await run(`UPDATE lead_notes SET deleted_at = now() WHERE id = $1`, [noteId])
    // Its mentions stop demanding action - the ask is gone.
    await run(`UPDATE lead_note_mentions SET resolved_at = now() WHERE note_id = $1 AND resolved_at IS NULL`, [noteId])
    await audit(auth.user.email, 'lead_note_delete', `#${leadId} note ${noteId}`)
    return NextResponse.json({ ok: true })
  }

  if (b.action === 'edit') {
    if (!isAuthor) {
      return NextResponse.json({ error: 'You can only edit your own notes.' }, { status: 403 })
    }
    const body = String(b.body ?? '').trim().slice(0, 5000)
    if (!body) return NextResponse.json({ error: 'Note cannot be empty.' }, { status: 400 })
    await run(`UPDATE lead_notes SET body = $1, edited_at = now() WHERE id = $2`, [body, noteId])
    await audit(auth.user.email, 'lead_note_edit', `#${leadId} note ${noteId}`)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
