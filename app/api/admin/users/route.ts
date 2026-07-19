import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit, generateTempPassword } from '@/lib/admin/db'
import { q, q1, run } from '@/lib/admin/pg'
import { requireAdmin, hashPassword } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error
  await ensureDb()
  const users = await q(
    'SELECT id, first_name, last_name, email, role, active, must_change_password, created_at, last_login FROM users ORDER BY id'
  )
  return NextResponse.json({ users })
}

/** Add a user: name, email, and access level. Email becomes the username; a temp password is generated. */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error
  const { firstName, lastName, email, role } = await req.json().catch(() => ({}))
  if (!firstName?.trim() || !lastName?.trim()) {
    return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
  }
  const em = String(email ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }
  const userRole = ['admin', 'editor', 'viewer', 'leads_view', 'leads_edit'].includes(role) ? role : 'viewer'
  const exists = await q1('SELECT id FROM users WHERE lower(email) = lower($1)', [em])
  if (exists) return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 })

  const tempPassword = generateTempPassword()
  await run(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, must_change_password)
     VALUES ($1, $2, $3, $4, $5, 1)`,
    [firstName.trim(), lastName.trim(), em, hashPassword(tempPassword), userRole]
  )
  await audit(auth.user.email, 'user_add', `${em} (${userRole})`)

  // Temp password is returned ONCE for the admin to hand over - never stored in plain text.
  return NextResponse.json({ ok: true, firstName: firstName.trim(), username: em, tempPassword })
}
