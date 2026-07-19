/**
 * Auth: scrypt password hashing (node built-in, no deps) + DB-backed sessions.
 */
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const SESSION_COOKIE = 'martek_admin_session'
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
export function createSession(userId: number): string {
  const { db } = require('./db') as typeof import('./db')
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString()
  db().prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, userId, expires)
  return token
}

export function destroySession(token: string) {
  const { db } = require('./db') as typeof import('./db')
  db().prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

export function destroyUserSessions(userId: number) {
  const { db } = require('./db') as typeof import('./db')
  db().prepare('DELETE FROM sessions WHERE user_id = ?').run(userId)
}

/** Server-side: get the logged-in user from the request cookie, or null. */
export function getSessionUser(): SessionUser | null {
  const { db } = require('./db') as typeof import('./db')
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null
  const row = db()
    .prepare(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.must_change_password
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > datetime('now') AND u.active = 1`
    )
    .get(token) as SessionUser | undefined
  return row ?? null
}

/** For API routes: returns user or a 401 response. */
export function requireUser(): { user: SessionUser } | { error: NextResponse } {
  const user = getSessionUser()
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { user }
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
