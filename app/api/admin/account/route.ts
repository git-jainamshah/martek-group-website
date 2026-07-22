import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { run } from '@/lib/admin/pg'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** The signed-in user's own profile. Email is read-only here (admin-managed). */
export async function GET() {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const u = auth.user
  return NextResponse.json({ user: { firstName: u.first_name, lastName: u.last_name, email: u.email, role: u.role } })
}

/** Update own first / last name. Email changes are admin-only. */
export async function PATCH(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()
  const b = await req.json().catch(() => ({}))
  const firstName = String(b.firstName ?? '').trim().slice(0, 80)
  const lastName = String(b.lastName ?? '').trim().slice(0, 80)
  if (!firstName || !lastName) return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
  await run('UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3', [firstName, lastName, auth.user.id])
  await audit(auth.user.email, 'account_update_name', `${firstName} ${lastName}`)
  return NextResponse.json({ ok: true })
}
