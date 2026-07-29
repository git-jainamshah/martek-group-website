import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { verifyPassword, createSession, SESSION_COOKIE, sessionCookieOptions, upsertShadowUser } from '@/lib/admin/auth'
import { findProductionUser } from '@/lib/admin/authdb'

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
    const addr = String(email).trim()

    // Production is the source of truth for who may sign in. On QA/DEV we check
    // it first, so a production account works here with the same password and a
    // revoked one is refused even if a stale shadow row still exists locally.
    // On production findProductionUser() always returns null and this is a no-op.
    const synced = await findProductionUser(addr)

    let user: any = null
    if (synced) {
      if (!synced.active) {
        attempts.set(ip, { n: (a?.n ?? 0) + 1, ts: Date.now() })
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
      }
      if (verifyPassword(password, synced.password_hash)) {
        const id = await upsertShadowUser({
          first_name: synced.first_name, last_name: synced.last_name, email: synced.email,
          password_hash: synced.password_hash, role: synced.role,
          must_change_password: synced.must_change_password,
        })
        user = { ...synced, id }
      }
    }

    // Not a production account (or wrong password there): try this
    // environment's own users, which QA/DEV can still create locally.
    if (!user) {
      const localUser = await q1<any>(
        'SELECT * FROM users WHERE lower(email) = lower($1) AND active = 1',
        [addr]
      )
      if (localUser && localUser.origin !== 'production' && verifyPassword(password, localUser.password_hash)) {
        user = localUser
      }
    }

    if (!user) {
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
