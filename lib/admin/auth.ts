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

/** Server-side: get the logged-in user from the request cookie, or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const { ensureDb } = require('./db') as typeof import('./db')
  await ensureDb()
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null
  return q1<SessionUser>(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.must_change_password
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > now() AND u.active = 1`,
    [token]
  )
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
