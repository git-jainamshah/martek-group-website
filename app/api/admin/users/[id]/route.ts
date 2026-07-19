import { NextRequest, NextResponse } from 'next/server'
import { audit, generateTempPassword } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { requireUser, hashPassword, destroyUserSessions } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * PATCH actions:
 *  { action: 'revoke' }          — deactivate + kill sessions
 *  { action: 'restore' }         — reactivate
 *  { action: 'reset-password' }  — new temp password (returned once), forces change on next login
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const id = Number(params.id)
  const target = await q1<any>('SELECT * FROM users WHERE id = $1', [id])
  if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

  const { action } = await req.json().catch(() => ({}))

  if (action === 'revoke') {
    if (target.id === auth.user.id) {
      return NextResponse.json({ error: "You can't revoke your own access." }, { status: 400 })
    }
    const admins = await q1<{ c: number }>('SELECT COUNT(*)::int AS c FROM users WHERE active = 1')
    if (Number(admins?.c) <= 1) {
      return NextResponse.json({ error: 'At least one active admin is required.' }, { status: 400 })
    }
    await run('UPDATE users SET active = 0 WHERE id = $1', [id])
    await destroyUserSessions(id)
    await audit(auth.user.email, 'user_revoke', target.email)
    return NextResponse.json({ ok: true })
  }

  if (action === 'restore') {
    await run('UPDATE users SET active = 1 WHERE id = $1', [id])
    await audit(auth.user.email, 'user_restore', target.email)
    return NextResponse.json({ ok: true })
  }

  if (action === 'reset-password') {
    const tempPassword = generateTempPassword()
    await run('UPDATE users SET password_hash = $1, must_change_password = 1 WHERE id = $2',
      [hashPassword(tempPassword), id])
    await destroyUserSessions(id)
    await audit(auth.user.email, 'user_reset_password', target.email)
    return NextResponse.json({ ok: true, firstName: target.first_name, username: target.email, tempPassword })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
