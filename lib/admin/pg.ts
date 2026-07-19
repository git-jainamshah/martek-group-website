/**
 * Postgres data layer — works on Vercel (Neon), any hosted Postgres, or locally.
 * Set DATABASE_URL (Neon's Vercel integration injects it automatically).
 *
 * ADMIN_DB_MOCK=memory runs against an in-memory pg-mem instance (dev/tests only;
 * pg-mem must be installed manually — it is not a project dependency).
 */
import type { Pool as PgPool } from 'pg'

let pool: PgPool | null = null

export function getPool(): PgPool {
  if (pool) return pool

  if (process.env.ADMIN_DB_MOCK === 'memory') {
    // Dev/test only. eval('require') keeps webpack from trying to bundle
    // pg-mem, which is intentionally NOT a project dependency.
    const req = eval('require') as NodeRequire
    const { newDb } = req('pg-mem')
    const adapter = newDb().adapters.createPg()
    pool = new adapter.Pool()
    return pool!
  }

  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. The admin backend needs a Postgres database ' +
      '(Vercel: Storage → Create Database → Neon; locally: add DATABASE_URL to .env.local).'
    )
  }
  const { Pool } = require('pg') as typeof import('pg')
  const isLocal = /localhost|127\.0\.0\.1/.test(url)
  pool = new Pool({
    connectionString: url,
    max: 3,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  })
  return pool
}

/** All rows */
export async function q<T = any>(text: string, params: unknown[] = []): Promise<T[]> {
  const res = await getPool().query(text, params as any[])
  return res.rows as T[]
}

/** First row or null */
export async function q1<T = any>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await q<T>(text, params)
  return rows[0] ?? null
}

/** Execute; returns affected row count */
export async function run(text: string, params: unknown[] = []): Promise<number> {
  const res = await getPool().query(text, params as any[])
  return res.rowCount ?? 0
}

/** Insert returning id */
export async function insertReturningId(text: string, params: unknown[] = []): Promise<number> {
  const res = await getPool().query(text, params as any[])
  return Number(res.rows[0]?.id)
}
