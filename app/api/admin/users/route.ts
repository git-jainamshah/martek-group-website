import { NextRequest, NextResponse } from 'next/server'
import { db, audit, generateTempPassword } from '@/lib/admin/db'
import { requireUser, hashPassword } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const users = db().prepare(
    'SELECT id, first_name, last_name, email, role, active, must_change_password, created_at, last_login FROM users ORDER BY id'
  ).all()
  return NextResponse.json({ users })
}

/** Add a user: first + last name and email. Email becomes the username; a temp password is generated. */
export async function POST(req: NextRequest) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const { firstName, lastName, email } = await req.json().catch(() => ({}))
  if (!firstName?.trim() || !lastName?.trim()) {
    return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
  }
  const em = String(email ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }
  const exists = db().prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE').get(em)
  if (exists) return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 })

  const tempPassword = generateTempPassword()
  db().prepare(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, must_change_password)
     VALUES (?, ?, ?, ?, 'admin', 1)`
  ).run(firstName.trim(), lastName.trim(), em, hashPassword(tempPassword))
  audit(auth.user.email, 'user_add', em)

  // Temp password is returned ONCE for the admin to hand over — never stored in plain text.
  return NextResponse.json({ ok: true, firstName: firstName.trim(), username: em, tempPassword })
}
