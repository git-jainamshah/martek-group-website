import { NextRequest, NextResponse } from 'next/server'
import { db, audit } from '@/lib/admin/db'
import { verifyPassword, createSession, SESSION_COOKIE, sessionCookieOptions } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// naive in-memory throttle: 10 attempts / 15 min per IP
const attempts = new Map<string, { n: number; ts: number }>()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local'
  const a = attempts.get(ip)
  if (a && a.n >= 10 && Date.now() - a.ts < 15 * 60_000) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const user = db()
    .prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE AND active = 1')
    .get(String(email).trim()) as any

  if (!user || !verifyPassword(password, user.password_hash)) {
    attempts.set(ip, { n: (a?.n ?? 0) + 1, ts: Date.now() })
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  attempts.delete(ip)
  db().prepare(`UPDATE users SET last_login = datetime('now') WHERE id = ?`).run(user.id)
  const token = createSession(user.id)
  audit(user.email, 'login')

  const res = NextResponse.json({
    ok: true,
    mustChangePassword: !!user.must_change_password,
    user: { firstName: user.first_name, lastName: user.last_name, email: user.email },
  })
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  return res
}
