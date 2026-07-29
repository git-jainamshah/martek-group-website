/**
 * Mirror admin user changes from production into the QA/DEV database.
 *
 * Whenever production adds a user, changes a role, revokes access or resets a
 * password, the same change is applied to the QA/DEV `users` table. Anyone who
 * can sign in to production can therefore sign in to qa/dev with the identical
 * email and password, and a revoke on production revokes there too.
 *
 * Direction is one way: production -> qa/dev, and only the `users` table.
 * QA/DEV never write to production, and no other data crosses.
 *
 * Rules that keep this predictable:
 *
 *   1. Only production syncs. On qa/dev `syncUser()` returns immediately, so
 *      those environments can still have their own local test accounts.
 *
 *   2. Matched on EMAIL, never on id. The two databases have independent SERIAL
 *      sequences, so ids do not line up and never will.
 *
 *   3. Best effort. A sync failure is logged but never fails the production
 *      request - QA being down must not stop you managing production users.
 *
 *   4. Off unless SYNC_USERS_DATABASE_URL is set. No variable, no syncing.
 */
import type { Pool as PgPool } from 'pg'
import { isProduction } from '../env'

let syncPool: PgPool | null = null
let resolved = false

/** Pool for the QA/DEV database, or null when syncing is off. */
function getSyncPool(): PgPool | null {
  if (resolved) return syncPool
  resolved = true

  // Only production is the source of truth, so only production pushes.
  if (!isProduction) return (syncPool = null)

  const url = process.env.SYNC_USERS_DATABASE_URL?.trim()
  if (!url) return (syncPool = null)

  const { Pool } = require('pg') as typeof import('pg')
  syncPool = new Pool({
    connectionString: url,
    max: 2,
    ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
    statement_timeout: 10_000,
  })
  return syncPool
}

export function userSyncEnabled(): boolean {
  return getSyncPool() !== null
}

export type SyncedUserFields = {
  first_name: string
  last_name: string
  email: string
  password_hash: string
  role: string
  active: number
  must_change_password: number
}

/**
 * Upsert a user into the QA/DEV database, keyed on email.
 *
 * Covers every case with one statement: new user, changed name, changed role,
 * new password hash, revoked, restored. Pass the row exactly as it now exists
 * in production and QA/DEV ends up identical.
 */
export async function syncUser(u: SyncedUserFields): Promise<void> {
  const pool = getSyncPool()
  if (!pool) return
  try {
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, active, must_change_password)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO UPDATE SET
         first_name           = EXCLUDED.first_name,
         last_name            = EXCLUDED.last_name,
         password_hash        = EXCLUDED.password_hash,
         role                 = EXCLUDED.role,
         active               = EXCLUDED.active,
         must_change_password = EXCLUDED.must_change_password`,
      [u.first_name, u.last_name, u.email, u.password_hash, u.role, u.active, u.must_change_password]
    )
    // A revoked or password-reset user must not stay signed in on qa/dev either.
    if (!u.active) {
      await pool.query(
        `DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE lower(email) = lower($1))`,
        [u.email]
      )
    }
  } catch (e) {
    // Never break production user management because qa/dev is unreachable.
    console.error(`user sync to qa/dev failed for ${u.email}`, e)
  }
}

/**
 * Handle an email change: production renamed the account, so the old row in
 * QA/DEV has to be renamed too rather than leaving a duplicate behind.
 */
export async function syncUserEmailChange(oldEmail: string, next: SyncedUserFields): Promise<void> {
  const pool = getSyncPool()
  if (!pool) return
  try {
    await pool.query('DELETE FROM users WHERE lower(email) = lower($1)', [oldEmail])
  } catch (e) {
    console.error(`user sync could not clear old email ${oldEmail}`, e)
  }
  await syncUser(next)
}

/** Drop a user from QA/DEV entirely (production hard-deletes are rare). */
export async function syncUserDelete(email: string): Promise<void> {
  const pool = getSyncPool()
  if (!pool) return
  try {
    await pool.query(
      `DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE lower(email) = lower($1))`,
      [email]
    )
    await pool.query('DELETE FROM users WHERE lower(email) = lower($1)', [email])
  } catch (e) {
    console.error(`user sync delete failed for ${email}`, e)
  }
}

/**
 * Push every production user into QA/DEV in one go.
 *
 * Used to backfill the first time syncing is switched on, and to repair drift
 * if QA was down while a change was made. Safe to run repeatedly.
 */
export async function syncAllUsers(rows: SyncedUserFields[]): Promise<number> {
  if (!getSyncPool()) return 0
  let n = 0
  for (const r of rows) {
    await syncUser(r)
    n++
  }
  return n
}
