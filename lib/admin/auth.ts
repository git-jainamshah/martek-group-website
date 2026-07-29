/**
 * Auth: scrypt password hashing (node built-in, no deps) + DB-backed sessions.
 */
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { q1, run } from './pg'

export const SESSION_COOKIE = 'marrelay_admin_session'
const SESSION_DAYS = 7

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const check = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'))
}

export type SessionUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  must_change_password: number
}

/** Create a session row + return the token. */
export async function createSession(userId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString()
  await run('INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, $3)', [token, userId, expires])
  return token
}

export async function destroySession(token: string): Promise<void> {
  await run('DELETE FROM sessions WHERE token = $1', [token])
}

export async function destroyUserSessions(userId: number): Promise<void> {
  await run('DELETE FROM sessions WHERE user_id = $1', [userId])
}

/**
 * Mirror a production user into the local users table and return its local id.
 *
 * Sessions reference users(id), so a production-authenticated login still needs
 * a local row to point at. This row is a shadow, never an authority: role and
 * active are refreshed from production on every request in getSessionUser().
 */
export async function upsertShadowUser(p: {
  first_name: string; last_name: string; email: string
  password_hash: string; role: string; must_change_password: number
}): Promise<number> {
  const existing = await q1<{ id: number }>(
    'SELECT id FROM users WHERE lower(email) = lower($1)', [p.email]
  )
  if (existing) {
    await run(
      `UPDATE users SET first_name = $1, last_name = $2, password_hash = $3, role = $4,
              must_change_password = $5, active = 1, origin = 'production'
       WHERE id = $6`,
      [p.first_name, p.last_name, p.password_hash, p.role, p.must_change_password, existing.id]
    )
    return existing.id
  }
  const row = await q1<{ id: number }>(
    `INSERT INTO users (first_name, last_name, email, password_hash, role,
                        must_change_password, active, origin)
     VALUES ($1, $2, $3, $4, $5, $6, 1, 'production') RETURNING id`,
    [p.first_name, p.last_name, p.email, p.password_hash, p.role, p.must_change_password]
  )
  return Number(row?.id)
}

/**
 * Server-side: get the logged-in user from the request cookie, or null.
 *
 * On QA/DEV with user sync enabled, any session belonging to a production-origin
 * user is re-validated against production on every request. That is what makes a
 * revoke on production take effect here immediately rather than whenever the
 * 7-day session happens to expire.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const { ensureDb } = require('./db') as typeof import('./db')
  await ensureDb()
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null

  const local = await q1<SessionUser & { origin?: string }>(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.must_change_password, u.origin
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > now() AND u.active = 1`,
    [token]
  )
  if (!local) return null
  if (local.origin !== 'production') return local

  // Production-owned account: production decides if it is still valid.
  const { findProductionUser, usesSyncedUsers } = require('./authdb') as typeof import('./authdb')
  if (!usesSyncedUsers()) return local

  const live = await findProductionUser(local.email)
  if (live === null) return local // production unreachable - do not lock people out

  if (!live.active) {
    // Revoked upstream. Kill the session here and mark the shadow inactive.
    await destroySession(token).catch(() => {})
    await run('UPDATE users SET active = 0 WHERE id = $1', [local.id]).catch(() => {})
    return null
  }

  // Role changes upstream apply immediately too.
  if (live.role !== local.role) {
    await run('UPDATE users SET role = $1 WHERE id = $2', [live.role, local.id]).catch(() => {})
    local.role = live.role
  }
  return local
}

/** For API routes: returns user or a 401 response. Any signed-in role. */
export async function requireUser(): Promise<{ user: SessionUser } | { error: NextResponse }> {
  try {
    const user = await getSessionUser()
    if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    return { user }
  } catch (e: any) {
    return { error: NextResponse.json({ error: e?.message || 'Database unavailable.' }, { status: 500 }) }
  }
}

/**
 * Roles: admin (everything incl. Access Management) > editor (manage all
 * content, no Access Management) > viewer (read-only + lead exports).
 */
export async function requireEditor(): Promise<{ user: SessionUser } | { error: NextResponse }> {
  const auth = await requireUser()
  if ('error' in auth) return auth
  if (auth.user.role !== 'admin' && auth.user.role !== 'editor') {
    return { error: NextResponse.json({ error: 'View-only access: your account cannot make changes.' }, { status: 403 }) }
  }
  return auth
}

/** Lead data mutations: admins, editors, Leads Edit, and Manager. */
export async function requireLeadsEditor(): Promise<{ user: SessionUser } | { error: NextResponse }> {
  const auth = await requireUser()
  if ('error' in auth) return auth
  if (!['admin', 'editor', 'leads_edit', 'manager'].includes(auth.user.role)) {
    return { error: NextResponse.json({ error: 'View-only access: your account cannot change lead data.' }, { status: 403 }) }
  }
  return auth
}

/** Finance / expenses: admins and the Manager role only. */
export async function requireFinance(): Promise<{ user: SessionUser } | { error: NextResponse }> {
  const auth = await requireUser()
  if ('error' in auth) return auth
  if (!['admin', 'manager'].includes(auth.user.role)) {
    return { error: NextResponse.json({ error: 'Only Admins and Managers can access finance data.' }, { status: 403 }) }
  }
  return auth
}

export async function requireAdmin(): Promise<{ user: SessionUser } | { error: NextResponse }> {
  const auth = await requireUser()
  if ('error' in auth) return auth
  if (auth.user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Only Admins can manage access.' }, { status: 403 }) }
  }
  return auth
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 86400,
  }
}
