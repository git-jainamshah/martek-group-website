/**
 * Thin adapter over Node's built-in SQLite (node:sqlite, Node >= 22.13).
 * Exposes a better-sqlite3-style surface so the rest of the admin code
 * stays portable — if we ever move to Postgres/Supabase, only the data
 * layer changes.
 *
 * Zero native dependencies: nothing to compile, nothing to install.
 */

export type RunResult = { changes: number; lastInsertRowid: number }

export interface Statement {
  get(...params: unknown[]): any
  all(...params: unknown[]): any[]
  run(...params: unknown[]): RunResult
}

export interface DB {
  prepare(sql: string): Statement
  exec(sql: string): void
  pragma(s: string): void
  transaction(fn: () => void): () => void
}

function builtinSqlite(): any {
  // process.getBuiltinModule is bundler-proof (webpack won't try to resolve it)
  const get = (process as any).getBuiltinModule
  if (typeof get !== 'function') {
    throw new Error('This admin backend needs Node.js >= 22.13 (built-in SQLite). Please upgrade Node.')
  }
  const mod = get.call(process, 'node:sqlite')
  if (!mod) throw new Error('node:sqlite unavailable — please use Node.js >= 22.13.')
  return mod
}

export function openDatabase(filePath: string): DB {
  const { DatabaseSync } = builtinSqlite()
  const raw = new DatabaseSync(filePath)

  const wrapStmt = (sql: string): Statement => {
    const s = raw.prepare(sql)
    return {
      get: (...p: unknown[]) => s.get(...(p as any[])),
      all: (...p: unknown[]) => s.all(...(p as any[])),
      run: (...p: unknown[]) => {
        const r = s.run(...(p as any[]))
        return { changes: Number(r.changes), lastInsertRowid: Number(r.lastInsertRowid) }
      },
    }
  }

  return {
    prepare: wrapStmt,
    exec: (sql: string) => raw.exec(sql),
    pragma: (s: string) => raw.exec(`PRAGMA ${s}`),
    transaction: (fn: () => void) => () => {
      raw.exec('BEGIN')
      try {
        fn()
        raw.exec('COMMIT')
      } catch (e) {
        raw.exec('ROLLBACK')
        throw e
      }
    },
  }
}
