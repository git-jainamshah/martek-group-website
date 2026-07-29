/**
 * Cross-environment user sync.
 *
 * Production is the single source of truth for who may sign in. QA and DEV read
 * the production `users` table live, so adding a user or revoking one on
 * production takes effect everywhere on the next request - no copy, no delay.
 *
 * SAFETY, in order of importance:
 *
 *   1. Production never uses any of this. `getAuthPool()` returns null when
 *      APP_ENV is production, so the live site's auth path is byte-identical to
 *      what it was before this file existed.
 *
 *   2. AUTH_DATABASE_URL is expected to be a READ-ONLY Neon role with SELECT on
 *      `users` only. QA/DEV therefore cannot write to production even if
 *      something in their (less-tested) code tries to.
 *
 *   3. Only the `users` table is ever read. Leads, invoices and settings still
 *      come from the environment's own database, so the data isolation between
 *      environments is unchanged.
 *
 *   4. Sessions are always local. A QA session token is meaningless on
 *      production and vice versa.
 *
 * If AUTH_DATABASE_URL is not set on QA/DEV, sync is simply off and those
 * environments fall back to their own local users. That is a deliberate soft
 * failure: a missing variable should not lock you out of QA.
 */
import type { Pool as PgPool } from 'pg'
import { isProduction } from '../env'

let authPool: PgPool | null = null
let resolved = false

/** Production-users pool, or null when sync is off / we are production. */
export function getAuthPool(): PgPool | null {
  if (resolved) return authPool
  resolved = true

  // Production reads its own users table through the normal pool.
  if (isProduction) return (authPool = null)

  const url = process.env.AUTH_DATABASE_URL?.trim()
  if (!url) return (authPool = null)

  const { Pool } = require('pg') as typeof import('pg')
  authPool = new Pool({
    connectionString: url,
    max: 2,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
    statement_timeout: 10_000,
  })
  return authPool
}

/** True when this environment authenticates against production's user list. */
export function usesSyncedUsers(): boolean {
  return getAuthPool() !== null
}

export type SyncedUser = {
  first_name: string
  last_name: string
  email: string
  password_hash: string
  role: string
  active: number
  must_change_password: number
}

/**
 * Look a user up in production by email.
 *
 * Returns null when sync is off, the user does not exist there, or the query
 * fails. Callers treat null as "not a production user" and fall back to the
 * local table, so a production outage degrades QA to local logins rather than
 * breaking it.
 */
export async function findProductionUser(email: string): Promise<SyncedUser | null> {
  const pool = getAuthPool()
  if (!pool) return null
  try {
    const res = await pool.query(
      `SELECT first_name, last_name, email, password_hash, role, active, must_change_password
         FROM users WHERE lower(email) = lower($1) LIMIT 1`,
      [email.trim()]
    )
    return (res.rows[0] as SyncedUser) ?? null
  } catch (e) {
    console.error('findProductionUser failed - falling back to local users', e)
    return null
  }
}

/** Everyone in production's user list, for display on the QA/DEV users page. */
export async function listProductionUsers(): Promise<SyncedUser[]> {
  const pool = getAuthPool()
  if (!pool) return []
  try {
    const res = await pool.query(
      `SELECT first_name, last_name, email, password_hash, role, active, must_change_password
         FROM users ORDER BY lower(email)`
    )
    return res.rows as SyncedUser[]
  } catch (e) {
    console.error('listProductionUsers failed', e)
    return []
  }
}
