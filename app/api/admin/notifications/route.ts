import { NextRequest, NextResponse } from 'next/server'
import { ensureDb } from '@/lib/admin/db'
import { q, run } from '@/lib/admin/pg'
import { requireUser } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The signed-in user's notification bell and their "waiting on you" queue.
 *
 * Both come from one request because the admin header shows the unread count
 * on every page - two round trips per page load for the same data would be
 * wasteful.
 */
export async function GET() {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()
  const me = auth.user.id

  const items = await q(
    `SELECT n.id, n.kind, n.lead_id, n.note_id, n.preview, n.created_at, n.read_at,
            l.name AS lead_name, l.public_id AS lead_public_id,
            a.first_name AS actor_first, a.last_name AS actor_last
       FROM notifications n
       LEFT JOIN leads l ON l.id = n.lead_id
       LEFT JOIN users a ON a.id = n.actor_user_id
      WHERE n.user_id = $1
      ORDER BY n.id DESC
      LIMIT 30`,
    [me]
  )

  const unread = items.filter((n: any) => !n.read_at).length

  /* Leads where someone tagged you and you have not posted since. Ordered
     oldest first, because the whole point is to surface what has been sitting
     longest - that is the number people act on. */
  const waiting = await q(
    `SELECT m.lead_id, MIN(m.created_at) AS since,
            MAX(l.name) AS lead_name, MAX(l.public_id) AS lead_public_id
       FROM lead_note_mentions m
       JOIN leads l ON l.id = m.lead_id
      WHERE m.user_id = $1 AND m.resolved_at IS NULL AND l.deleted_at IS NULL
      GROUP BY m.lead_id
      ORDER BY MIN(m.created_at) ASC`,
    [me]
  )

  return NextResponse.json({ items, unread, waiting })
}

/**
 * PATCH { id }      - mark one notification read
 * PATCH { all: true } - mark everything read
 */
export async function PATCH(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()
  const b = await req.json().catch(() => ({}))

  // Always scoped to the signed-in user, so nobody can clear someone else's bell.
  if (b.all) {
    await run(`UPDATE notifications SET read_at = now() WHERE user_id = $1 AND read_at IS NULL`, [auth.user.id])
  } else if (b.id) {
    await run(`UPDATE notifications SET read_at = now() WHERE id = $1 AND user_id = $2`, [Number(b.id), auth.user.id])
  } else {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
