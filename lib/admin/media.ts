/**
 * Media helpers: scans the codebase for /assets/... references so the admin
 * always knows exactly where each media file is linked on the production site.
 */
import fs from 'fs'
import path from 'path'
import { db } from './db'

export type MediaLink = { file: string; label: string; line: number }

const SCAN_DIRS = ['app', 'components', 'lib']
const REF_RE = /\/(?:assets|uploads)\/[\w\-.() ]+\.[A-Za-z0-9]+/g
const EXCLUDE_DIRS = new Set(['node_modules', '.next', 'admin'])

let cache: { at: number; refs: Map<string, MediaLink[]> } | null = null

export function findAssetReferences(): Map<string, MediaLink[]> {
  if (cache && Date.now() - cache.at < 30_000) return cache.refs
  const root = process.cwd()
  const refs = new Map<string, MediaLink[]>()

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!EXCLUDE_DIRS.has(entry.name)) walk(path.join(dir, entry.name))
        continue
      }
      if (!/\.(tsx?|jsx?|css)$/.test(entry.name)) continue
      const full = path.join(dir, entry.name)
      const rel = path.relative(root, full)
      // Skip admin panel + this lib so admin UI previews don't count as "linked"
      if (rel.startsWith(path.join('app', 'admin')) || rel.startsWith(path.join('lib', 'admin'))) continue
      const src = fs.readFileSync(full, 'utf8')
      const lines = src.split('\n')
      lines.forEach((lineText, i) => {
        const matches = lineText.match(REF_RE)
        if (!matches) return
        for (const m of matches) {
          const arr = refs.get(m) ?? []
          arr.push({ file: rel, label: humanize(rel), line: i + 1 })
          refs.set(m, arr)
        }
      })
    }
  }
  for (const d of SCAN_DIRS) {
    const full = path.join(root, d)
    if (fs.existsSync(full)) walk(full)
  }
  cache = { at: Date.now(), refs }
  return refs
}

export function invalidateRefCache() {
  cache = null
}

function humanize(rel: string): string {
  const p = rel.replace(/\\/g, '/')
  if (p.startsWith('components/Navbar')) return 'Navigation bar (site-wide)'
  if (p.startsWith('components/Footer')) return 'Footer (site-wide)'
  if (p.startsWith('components/Hero')) return 'Home — hero'
  if (p.startsWith('app/layout')) return 'Site metadata / social sharing image'
  const m = p.match(/^app\/(.+)\/page\.tsx$/)
  if (m) {
    return m[1]
      .split('/')
      .map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
      .join(' / ')
  }
  if (p === 'app/page.tsx') return 'Home page'
  const c = p.match(/^components\/(.+)\.tsx$/)
  if (c) return `Component: ${c[1]}`
  return p
}

export function isLinked(relPath: string): MediaLink[] {
  return findAssetReferences().get(relPath) ?? []
}

/** Ensure every file referenced or present under public/ is indexed in the media table. */
export function syncMediaIndex() {
  const root = process.cwd()
  const insert = db().prepare(
    `INSERT OR IGNORE INTO media (filename, rel_path, kind, mime, size, added_at, modified_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
  for (const sub of ['assets', 'uploads']) {
    const dir = path.join(root, 'public', sub)
    if (!fs.existsSync(dir)) continue
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f)
      const st = fs.statSync(full)
      if (!st.isFile()) continue
      const ext = path.extname(f).toLowerCase()
      const kind = ['.mp4', '.webm', '.mov'].includes(ext) ? 'video' : 'photo'
      insert.run(f, `/${sub}/${f}`, kind, mimeFor(ext), st.size, st.birthtime.toISOString(), st.mtime.toISOString())
    }
  }
  // Drop rows whose files no longer exist
  const rows = db().prepare('SELECT id, rel_path FROM media').all() as { id: number; rel_path: string }[]
  const del = db().prepare('DELETE FROM media WHERE id = ?')
  for (const r of rows) {
    if (!fs.existsSync(path.join(root, 'public', r.rel_path.replace(/^\//, '')))) del.run(r.id)
  }
}

export function mimeFor(ext: string): string {
  const { MIME } = require('./db') as typeof import('./db')
  return MIME[ext] || 'application/octet-stream'
}
