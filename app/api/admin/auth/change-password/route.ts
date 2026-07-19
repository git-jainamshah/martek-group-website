import { NextRequest, NextResponse } from 'next/server'
import { db, audit } from '@/lib/admin/db'
import { requireUser, hashPassword, verifyPassword, destroyUserSessions, createSession, SESSION_COOKIE, sessionCookieOptions } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const { user } = auth

  const { currentPassword, newPassword } = await req.json().catch(() => ({}))
  if (!newPassword || String(newPassword).length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
  }

  const row = db().prepare('SELECT password_hash, must_change_password FROM users WHERE id = ?').get(user.id) as any

  // Users on a temp password don't need to re-enter it; everyone else must confirm current password
  if (!row.must_change_password) {
    if (!currentPassword || !verifyPassword(currentPassword, row.password_hash)) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 })
    }
  }

  db().prepare('UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?')
    .run(hashPassword(String(newPassword)), user.id)

  // Discard temp-password sessions; issue a fresh one
  destroyUserSessions(user.id)
  const token = createSession(user.id)
  audit(user.email, 'change_password')

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  return res
}
