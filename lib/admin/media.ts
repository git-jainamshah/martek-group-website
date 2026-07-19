/**
 * Media helpers.
 *
 * Where each media file is linked comes from scanning the codebase. On a dev
 * machine we scan live source; on serverless (source not shipped) we fall back
 * to lib/admin/media-manifest.json, generated at build time by
 * scripts/generate-media-manifest.mjs (npm prebuild hook).
 *
 * File writes (upload/replace/delete) require a persistent filesystem; on
 * serverless they return a clear error instead of pretending to work.
 */
import fs from 'fs'
import path from 'path'
import { q, run } from './pg'
import { ensureDb } from './db'

export type MediaLink = { file: string; label: string; line: number }
export type ManifestFile = {
  filename: string; relPath: string; kind: 'photo' | 'video'
  mime: string; size: number; modifiedAt: string
}
export type MediaManifest = {
  generatedAt: string
  files: ManifestFile[]
  references: Record<string, MediaLink[]>
}

const SCAN_DIRS = ['app', 'components', 'lib']
const REF_RE = /\/(?:assets|uploads)\/[\w\-.() ]+\.[A-Za-z0-9]+/g
const EXCLUDE_DIRS = new Set(['node_modules', '.next', 'admin'])

let cache: { at: number; refs: Map<string, MediaLink[]> } | null = null
let manifestCache: MediaManifest | null = null

export function loadMediaManifest(): MediaManifest {
  if (manifestCache) return manifestCache
  try {
    manifestCache = require('./media-manifest.json') as MediaManifest
  } catch {
    manifestCache = { generatedAt: '', files: [], references: {} }
  }
  return manifestCache
}

/** True when we can actually write to the public folder (not serverless). */
export function hasWritableStorage(): boolean {
  try {
    const probe = path.join(process.cwd(), 'public', '.write-probe')
    fs.writeFileSync(probe, '1')
    fs.unlinkSync(probe)
    return true
  } catch {
    return false
  }
}

export function findAssetReferences(): Map<string, MediaLink[]> {
  if (cache && Date.now() - cache.at < 30_000) return cache.refs
  const root = process.cwd()
  const refs = new Map<string, MediaLink[]>()

  // Always start from the build-time manifest (complete picture even on
  // serverless, where only a partial slice of source files is shipped),
  // then overlay a live scan so local edits show up immediately.
  const manifest = loadMediaManifest()
  for (const [p, links] of Object.entries(manifest.references)) {
    // Re-label from source paths so label wording always matches this code version
    refs.set(p, links.map((l) => ({ ...l, label: humanize(l.file) })))
  }

  const merge = (p: string, link: MediaLink) => {
    const arr = refs.get(p) ?? []
    if (!arr.some((l) => l.file === link.file && l.line === link.line)) arr.push(link)
    refs.set(p, arr)
  }

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!EXCLUDE_DIRS.has(entry.name)) walk(path.join(dir, entry.name))
        continue
      }
      if (!/\.(tsx?|jsx?|css)$/.test(entry.name)) continue
      const full = path.join(dir, entry.name)
      const rel = path.relative(root, full)
      if (rel.startsWith(path.join('app', 'admin')) || rel.startsWith(path.join('lib', 'admin'))) continue
      const lines = fs.readFileSync(full, 'utf8').split('\n')
      lines.forEach((lineText, i) => {
        const matches = lineText.match(REF_RE)
        if (!matches) return
        for (const m of matches) {
          merge(m, { file: rel, label: humanize(rel), line: i + 1 })
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

/** Plain-English labels for non-technical admins. */
const COMPONENT_LABELS: Record<string, string> = {
  Navbar: 'Top navigation bar (every page)',
  Footer: 'Footer (every page)',
  Hero: 'Home page — hero video',
  PageHero: 'Page top banner (used on several pages)',
  PromoBanner: 'Promo pop-up banner',
  SocialLinks: 'Social media icons',
  CTASection: 'Call-to-action section',
}
const PAGE_LABELS: Record<string, string> = {
  '': 'Home page',
  about: 'About Us page',
  contact: 'Contact page',
  pricing: 'Pricing page',
  blogs: 'Blog page',
  projects: 'Projects page',
  'case-studies': 'Case Studies page',
  abstracts: 'Abstracts page',
  terms: 'Terms page',
  privacy: 'Privacy page',
  'services/web-development': 'Web Development service page',
  'services/data-analytics': 'Data & Analytics service page',
  'services/social': 'Social service page',
  'services/seo-ads': 'SEO & Ads service page',
  'services/engineering': 'Engineering & CAD service page',
  services: 'Services overview page',
}

export function humanize(rel: string): string {
  const p = rel.replace(/\\/g, '/')
  if (p.startsWith('app/layout')) return 'Social sharing image (link previews)'
  if (p === 'app/page.tsx') return 'Home page'
  const m = p.match(/^app\/(.+)\/page\.tsx$/)
  if (m) {
    if (PAGE_LABELS[m[1]]) return PAGE_LABELS[m[1]]
    return m[1].split('/').map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())).join(' / ') + ' page'
  }
  const c = p.match(/^components\/(?:.+\/)?(.+)\.tsx$/)
  if (c) return COMPONENT_LABELS[c[1]] ?? `${c[1].replace(/([A-Z])/g, ' $1').trim()} section`
  return p
}

export function isLinked(relPath: string): MediaLink[] {
  return findAssetReferences().get(relPath) ?? []
}

/** Keep the media table in sync with disk (persistent envs) or manifest (serverless). */
export async function syncMediaIndex(): Promise<void> {
  await ensureDb()
  const root = process.cwd()
  const writable = hasWritableStorage()

  if (writable) {
    for (const sub of ['assets', 'uploads']) {
      const dir = path.join(root, 'public', sub)
      if (!fs.existsSync(dir)) continue
      for (const f of fs.readdirSync(dir)) {
        const full = path.join(dir, f)
        const st = fs.statSync(full)
        if (!st.isFile()) continue
        const ext = path.extname(f).toLowerCase()
        const kind = ['.mp4', '.webm', '.mov'].includes(ext) ? 'video' : 'photo'
        await run(
          `INSERT INTO media (filename, rel_path, kind, mime, size, added_at, modified_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (rel_path) DO NOTHING`,
          [f, `/${sub}/${f}`, kind, mimeFor(ext), st.size, st.birthtime.toISOString(), st.mtime.toISOString()]
        )
      }
    }
    // Drop rows whose files no longer exist
    const rows = await q<{ id: number; rel_path: string }>('SELECT id, rel_path FROM media')
    for (const r of rows) {
      if (!fs.existsSync(path.join(root, 'public', r.rel_path.replace(/^\//, '')))) {
        await run('DELETE FROM media WHERE id = $1', [r.id])
      }
    }
  } else {
    // Serverless: make sure everything in the manifest is indexed
    for (const f of loadMediaManifest().files) {
      await run(
        `INSERT INTO media (filename, rel_path, kind, mime, size, added_at, modified_at)
         VALUES ($1, $2, $3, $4, $5, $6, $6) ON CONFLICT (rel_path) DO NOTHING`,
        [f.filename, f.relPath, f.kind, f.mime, f.size, f.modifiedAt]
      )
    }
  }
}

export function mimeFor(ext: string): string {
  const { MIME } = require('./db') as typeof import('./db')
  return MIME[ext] || 'application/octet-stream'
}

export const READONLY_STORAGE_MSG =
  'File storage is read-only on this deployment (serverless). Media uploads/replacement work when the site runs on a persistent server, or after we add Blob storage. Everything else in the admin works normally.'
