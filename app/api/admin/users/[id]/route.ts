import { NextRequest, NextResponse } from 'next/server'
import { audit, generateTempPassword } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { requireAdmin, hashPassword, destroyUserSessions } from '@/lib/admin/auth'
import { syncUser, syncUserEmailChange } from '@/lib/admin/user-sync'

/** Re-read the row after a change and mirror it to qa/dev. No-op outside production. */
async function mirror(id: number) {
  const u = await q1<any>('SELECT * FROM users WHERE id = $1', [id])
  if (u) await syncUser(u)
}

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
    await mirror(id)   // revokes on qa/dev and kills their sessions there too
    await audit(auth.user.email, 'user_revoke', target.email)
    return NextResponse.json({ ok: true })
  }

  if (action === 'restore') {
    await run('UPDATE users SET active = 1 WHERE id = $1', [id])
    await mirror(id)
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
    await mirror(id)
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
    const updated = await q1<any>('SELECT * FROM users WHERE id = $1', [id])
    if (updated) {
      // If the email changed, remove the old qa/dev row instead of leaving a duplicate.
      if (String(target.email).toLowerCase() !== email) await syncUserEmailChange(target.email, updated)
      else await syncUser(updated)
    }
    await audit(auth.user.email, 'user_update_profile', `${target.email} → ${firstName} ${lastName} (${email})`)
    return NextResponse.json({ ok: true })
  }

  if (action === 'reset-password') {
    const tempPassword = generateTempPassword()
    await run('UPDATE users SET password_hash = $1, must_change_password = 1 WHERE id = $2',
      [hashPassword(tempPassword), id])
    await destroyUserSessions(id)
    await mirror(id)   // same new temp password works on qa/dev
    await audit(auth.user.email, 'user_reset_password', target.email)
    return NextResponse.json({ ok: true, firstName: target.first_name, username: target.email, tempPassword })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
