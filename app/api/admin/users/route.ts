import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit, generateTempPassword } from '@/lib/admin/db'
import { q, q1, run } from '@/lib/admin/pg'
import { requireAdmin, hashPassword } from '@/lib/admin/auth'
import { listProductionUsers, usesSyncedUsers } from '@/lib/admin/authdb'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error
  await ensureDb()
  const local = await q<any>(
    'SELECT id, first_name, last_name, email, role, active, must_change_password, created_at, last_login, origin FROM users ORDER BY id'
  )

  // On QA/DEV, also list production accounts that have never signed in here yet,
  // so the page shows who *can* get in rather than only who already has.
  const seen = new Set(local.map((u) => String(u.email).toLowerCase()))
  const pending = (await listProductionUsers())
    .filter((p) => !seen.has(p.email.toLowerCase()))
    .map((p, i) => ({
      id: -(i + 1), // negative: not a local row, nothing here can act on it
      first_name: p.first_name, last_name: p.last_name, email: p.email,
      role: p.role, active: p.active, must_change_password: p.must_change_password,
      created_at: null, last_login: null, origin: 'production',
    }))

  return NextResponse.json({ users: [...local, ...pending], syncedFromProduction: usesSyncedUsers() })
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
  const userRole = ['admin', 'editor', 'viewer', 'leads_view', 'leads_edit', 'manager'].includes(role) ? role : 'viewer'
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
