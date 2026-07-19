import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
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

  try {
    await ensureDb()
    const user = await q1<any>(
      'SELECT * FROM users WHERE lower(email) = lower($1) AND active = 1',
      [String(email).trim()]
    )

    if (!user || !verifyPassword(password, user.password_hash)) {
      attempts.set(ip, { n: (a?.n ?? 0) + 1, ts: Date.now() })
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    attempts.delete(ip)
    await run('UPDATE users SET last_login = now() WHERE id = $1', [user.id])
    const token = await createSession(user.id)
    await audit(user.email, 'login')

    const res = NextResponse.json({
      ok: true,
      mustChangePassword: !!user.must_change_password,
      user: { firstName: user.first_name, lastName: user.last_name, email: user.email },
    })
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
    return res
  } catch (e: any) {
    console.error('login failed', e)
    return NextResponse.json(
      { error: e?.message?.includes('DATABASE_URL') ? e.message : 'Database unavailable - check DATABASE_URL.' },
      { status: 500 }
    )
  }
}
