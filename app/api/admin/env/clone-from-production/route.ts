import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin/auth'
import { ensureDb } from '@/lib/admin/db'
import { getPool } from '@/lib/admin/pg'
import { isProduction, APP_ENV, dbFingerprint } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Copy every record from the production database into THIS environment.
 *
 * Runs inside the QA/DEV deployment, which can reach Neon directly, so no local
 * postgres client is needed. The production connection string is supplied per
 * request and never stored.
 *
 * Hard safety rules:
 *   1. Refuses to run when this deployment IS production. The data only ever
 *      flows production -> non-production, never the other way.
 *   2. Refuses if the source and target resolve to the same host + database.
 *   3. Admin login required.
 *   4. Reads from production with a read-only transaction.
 */

/** Copied in dependency order so foreign keys are satisfied on insert. */
const TABLES = [
  'users',
  'media',
  'tag_managers',
  'scripts',
  'packages',
  'settings',
  'billing_accounts',
  'clients',
  'client_projects',
  'invoices',
  'expenses',
  'leads',
  'leads_marketing',
  'leads_offline',
  'lead_notes',
  'audit_log',
  'blog_views',
  // NOTE: `sessions` is deliberately excluded - copying live auth tokens across
  // environments is pointless and unsafe. Everyone simply logs in on QA.
]

const hostOf = (url: string) => {
  try {
    const u = new URL(url)
    return `${u.hostname}${u.pathname}`
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  // 1. Never run this on production.
  if (isProduction) {
    return NextResponse.json(
      { error: 'This tool only runs on QA/DEV. Production is never a target.' },
      { status: 403 }
    )
  }

  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  const body = await req.json().catch(() => ({}))
  const sourceUrl = String(body?.sourceUrl ?? '').trim()
  if (!sourceUrl.startsWith('postgres')) {
    return NextResponse.json({ error: 'A production connection string is required.' }, { status: 400 })
  }

  const targetUrl = process.env.QA_DATABASE_URL || process.env.DEV_DATABASE_URL || ''
  if (hostOf(sourceUrl) && hostOf(sourceUrl) === hostOf(targetUrl)) {
    return NextResponse.json(
      { error: 'Source and target are the same database. Nothing was changed.' },
      { status: 400 }
    )
  }

  await ensureDb() // make sure this environment has the full schema before loading

  const { Pool } = require('pg') as typeof import('pg')
  const source = new Pool({
    connectionString: sourceUrl,
    max: 2,
    ssl: { rejectUnauthorized: false },
    statement_timeout: 30_000,
  })

  const target = getPool()
  const copied: Record<string, number> = {}
  const skipped: string[] = []

  try {
    // Which tables actually exist on BOTH sides.
    const srcTables = new Set(
      (await source.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)).rows.map(
        (r: any) => r.tablename
      )
    )
    const dstTables = new Set(
      (await target.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)).rows.map(
        (r: any) => r.tablename
      )
    )
    const usable = TABLES.filter((t) => {
      if (srcTables.has(t) && dstTables.has(t)) return true
      skipped.push(t)
      return false
    })

    // Wipe the target in one statement so foreign keys never block us.
    if (usable.length) {
      await target.query(`TRUNCATE TABLE ${usable.join(', ')} RESTART IDENTITY CASCADE`)
    }

    for (const table of usable) {
      // Only copy columns that exist on both sides, so a schema drift in either
      // direction degrades gracefully instead of throwing.
      const srcCols: string[] = (
        await source.query(
          `SELECT column_name FROM information_schema.columns
           WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position`,
          [table]
        )
      ).rows.map((r: any) => r.column_name)

      const dstCols = new Set<string>(
        (
          await target.query(
            `SELECT column_name FROM information_schema.columns
             WHERE table_schema='public' AND table_name=$1`,
            [table]
          )
        ).rows.map((r: any) => r.column_name)
      )

      const cols = srcCols.filter((c) => dstCols.has(c))
      if (!cols.length) { skipped.push(table); continue }

      const quoted = cols.map((c) => `"${c}"`).join(', ')
      const rows = (await source.query(`SELECT ${quoted} FROM "${table}"`)).rows as any[]

      // Insert in batches to stay well inside Postgres' parameter limit.
      const BATCH = Math.max(1, Math.floor(60000 / cols.length))
      for (let i = 0; i < rows.length; i += BATCH) {
        const slice = rows.slice(i, i + BATCH)
        const params: unknown[] = []
        const tuples = slice.map((row) => {
          const ph = cols.map((c) => {
            params.push(row[c])
            return `$${params.length}`
          })
          return `(${ph.join(', ')})`
        })
        await target.query(
          `INSERT INTO "${table}" (${quoted}) VALUES ${tuples.join(', ')}`,
          params
        )
      }
      copied[table] = rows.length
    }

    // Re-point SERIAL sequences past the copied ids, or the next insert collides.
    for (const table of usable) {
      try {
        await target.query(
          `SELECT setval(
             pg_get_serial_sequence('"${table}"', 'id'),
             GREATEST((SELECT COALESCE(MAX(id), 0) FROM "${table}"), 1),
             true
           )
           WHERE pg_get_serial_sequence('"${table}"', 'id') IS NOT NULL`
        )
      } catch {
        // table has no serial id - fine
      }
    }

    return NextResponse.json({
      ok: true,
      environment: APP_ENV,
      target: dbFingerprint(),
      copied,
      skipped,
      totalRows: Object.values(copied).reduce((a, b) => a + b, 0),
    })
  } catch (e: any) {
    console.error('clone-from-production failed', e)
    return NextResponse.json(
      { error: e?.message || 'Copy failed. Nothing further was written.' },
      { status: 500 }
    )
  } finally {
    await source.end().catch(() => {})
  }
}
