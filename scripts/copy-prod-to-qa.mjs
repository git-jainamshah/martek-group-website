#!/usr/bin/env node
/**
 * Copy every record from the production database into the QA database.
 *
 *   node scripts/copy-prod-to-qa.mjs
 *
 * It asks for the two connection strings, reads production, and rewrites QA to
 * match. Production is only ever read from. Uses the `pg` driver already in
 * node_modules, so there is nothing to install.
 *
 * QA must already have the schema, which it does the moment qa.marrelay.com
 * has booted once (ensureDb creates the tables). This script copies rows only,
 * it does not create tables.
 */

import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import pg from 'pg'

const { Pool } = pg

/** Copied in this order so foreign keys are satisfied on insert. */
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
  // `sessions` is deliberately skipped - copying live login tokens between
  // environments is pointless and unsafe. Just log in on QA.
]

const host = (url) => {
  try {
    const u = new URL(url)
    return `${u.hostname}${u.pathname}`
  } catch {
    return ''
  }
}

const short = (url) => {
  try {
    const u = new URL(url)
    return `${u.hostname.split('.')[0]}${u.pathname}`
  } catch {
    return '(unparseable)'
  }
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout })

  console.log('\n  Copy production data into QA')
  console.log('  ----------------------------')
  console.log('  Get both strings from Neon -> project -> Connect, or from')
  console.log('  Vercel -> Storage -> the database -> .env.local -> Show secret.\n')

  const sourceUrl =
    process.env.SOURCE_URL || (await rl.question('  SOURCE (production) connection string: ')).trim()
  const targetUrl =
    process.env.TARGET_URL || (await rl.question('  TARGET (QA) connection string:        ')).trim()

  if (!sourceUrl.startsWith('postgres') || !targetUrl.startsWith('postgres')) {
    throw new Error('Both values must be postgresql:// connection strings.')
  }

  // Guard 1: never let source and target be the same database.
  if (host(sourceUrl) === host(targetUrl)) {
    throw new Error('Source and target are the same database. Nothing was changed.')
  }

  // Guard 2: the target must not be the known production host.
  if (/ep-hidden-dust/i.test(targetUrl)) {
    throw new Error(
      'The TARGET looks like the production database (ep-hidden-dust). ' +
      'Refusing to overwrite production. Nothing was changed.'
    )
  }

  console.log(`\n  Read from : ${short(sourceUrl)}`)
  console.log(`  Write to  : ${short(targetUrl)}`)
  console.log('\n  Every row in the target is deleted and replaced.')

  // Guard 3: make the target explicit by hand.
  const expected = short(targetUrl).split('/')[0]
  const typed = (await rl.question(`  Type "${expected}" to confirm: `)).trim()
  rl.close()
  if (typed !== expected) {
    console.log('\n  Cancelled. Nothing was changed.\n')
    process.exit(1)
  }

  const ssl = { rejectUnauthorized: false }
  const source = new Pool({ connectionString: sourceUrl, max: 2, ssl })
  const target = new Pool({ connectionString: targetUrl, max: 2, ssl })

  const tablesIn = async (pool) =>
    new Set(
      (await pool.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)).rows.map(
        (r) => r.tablename
      )
    )

  const columnsIn = async (pool, table) =>
    (
      await pool.query(
        `SELECT column_name FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position`,
        [table]
      )
    ).rows.map((r) => r.column_name)

  try {
    const [srcTables, dstTables] = await Promise.all([tablesIn(source), tablesIn(target)])

    const usable = []
    const missing = []
    for (const t of TABLES) {
      if (srcTables.has(t) && dstTables.has(t)) usable.push(t)
      else missing.push(t)
    }

    if (!usable.length) {
      throw new Error(
        'No matching tables. Open qa.marrelay.com/admin once so the schema is created, then re-run.'
      )
    }
    if (missing.length) {
      console.log(`\n  Skipping (not in both databases): ${missing.join(', ')}`)
    }

    // One TRUNCATE so foreign keys never block the wipe.
    console.log('\n  Clearing target...')
    await target.query(`TRUNCATE TABLE ${usable.map((t) => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE`)

    console.log('  Copying:\n')
    let total = 0

    for (const table of usable) {
      // Only copy columns that exist on both sides, so schema drift in either
      // direction degrades gracefully instead of throwing.
      const [srcCols, dstCols] = await Promise.all([
        columnsIn(source, table),
        columnsIn(target, table).then((c) => new Set(c)),
      ])
      const cols = srcCols.filter((c) => dstCols.has(c))
      if (!cols.length) {
        console.log(`    ${table.padEnd(18)} skipped (no shared columns)`)
        continue
      }

      const quoted = cols.map((c) => `"${c}"`).join(', ')
      const rows = (await source.query(`SELECT ${quoted} FROM "${table}"`)).rows

      // Batch inserts to stay inside Postgres' 65535 parameter limit.
      const BATCH = Math.max(1, Math.floor(60000 / cols.length))
      for (let i = 0; i < rows.length; i += BATCH) {
        const slice = rows.slice(i, i + BATCH)
        const params = []
        const tuples = slice.map((row) => {
          const ph = cols.map((c) => {
            params.push(row[c])
            return `$${params.length}`
          })
          return `(${ph.join(', ')})`
        })
        await target.query(`INSERT INTO "${table}" (${quoted}) VALUES ${tuples.join(', ')}`, params)
      }

      total += rows.length
      const dropped = srcCols.length - cols.length
      console.log(
        `    ${table.padEnd(18)} ${String(rows.length).padStart(6)} rows` +
          (dropped ? `   (${dropped} column${dropped > 1 ? 's' : ''} not present in QA)` : '')
      )
    }

    // Move SERIAL sequences past the copied ids, or the next insert collides.
    for (const table of usable) {
      await target
        .query(
          `SELECT setval(
             pg_get_serial_sequence('"${table}"', 'id'),
             GREATEST((SELECT COALESCE(MAX(id), 0) FROM "${table}"), 1),
             true
           )
           WHERE pg_get_serial_sequence('"${table}"', 'id') IS NOT NULL`
        )
        .catch(() => {}) // table has no serial id - fine
    }

    console.log(`\n  Done. ${total} rows copied into ${short(targetUrl)}.`)
    console.log('  Sign in to qa.marrelay.com/admin with your PRODUCTION email and password')
    console.log('  - the users table was replaced.\n')
  } finally {
    await source.end().catch(() => {})
    await target.end().catch(() => {})
  }
}

main().catch((err) => {
  console.error(`\n  Failed: ${err.message}`)
  console.error('  Nothing further was written.\n')
  process.exit(1)
})
