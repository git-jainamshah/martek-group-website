import { NextRequest, NextResponse } from 'next/server'
import { audit, generateTempPassword } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { requireAdmin, hashPassword, destroyUserSessions } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * PATCH actions:
 *  { action: 'revoke' }          - deactivate + kill sessions
 *  { action: 'restore' }         - reactivate
 *  { action: 'reset-password' }  - new temp password (returned once), forces change on next login
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error
  const id = Number(params.id)
  const target = await q1<any>('SELECT * FROM users WHERE id = $1', [id])
  if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

  // Production-owned accounts are read-only outside production. The connection
  // to production is a read-only role, so the change could not propagate; it
  // would only edit the local shadow row and silently drift from the real one.
  if (target.origin === 'production') {
    return NextResponse.json(
      { error: 'This account is managed on production. Change it in the production admin panel and it will apply here immediately.' },
      { status: 403 }
    )
  }

  const b = await req.json().catch(() => ({}))
  const { action, role } = b

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

  if (action === 'set-role') {
    if (!['admin', 'editor', 'viewer', 'leads_view', 'leads_edit', 'manager'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 })
    }
    if (target.role === 'admin' && role !== 'admin') {
      const admins = await q1<{ c: number }>(`SELECT COUNT(*)::int AS c FROM users WHERE active = 1 AND role = 'admin'`)
      if (Number(admins?.c) <= 1) {
        return NextResponse.json({ error: 'At least one active Admin is required.' }, { status: 400 })
      }
    }
    await run('UPDATE users SET role = $1 WHERE id = $2', [role, id])
    await audit(auth.user.email, 'user_set_role', `${target.email} → ${role}`)
    return NextResponse.json({ ok: true })
  }

  if (action === 'update-profile') {
    const firstName = String(b.firstName ?? '').trim().slice(0, 80)
    const lastName = String(b.lastName ?? '').trim().slice(0, 80)
    const email = String(b.email ?? '').trim().toLowerCase().slice(0, 200)
    if (!firstName || !lastName) return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    const dup = await q1<{ id: number }>('SELECT id FROM users WHERE email = $1 AND id <> $2', [email, id])
    if (dup) return NextResponse.json({ error: 'That email is already in use.' }, { status: 400 })
    await run('UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4', [firstName, lastName, email, id])
    await audit(auth.user.email, 'user_update_profile', `${target.email} → ${firstName} ${lastName} (${email})`)
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
