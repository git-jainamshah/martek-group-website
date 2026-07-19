#!/usr/bin/env node
/**
 * Build-time media manifest: lists every file in public/assets + public/uploads
 * and every place it's referenced in the source. Written to
 * lib/admin/media-manifest.json so the admin panel has full media/link info
 * even on serverless deployments where source files aren't shipped.
 * Runs automatically via the npm "prebuild" hook.
 */
import fs from 'fs'
import path from 'path'

const root = process.cwd()
const REF_RE = /\/(?:assets|uploads)\/[\w\-.() ]+\.[A-Za-z0-9]+/g
const VIDEO_EXT = ['.mp4', '.webm', '.mov']
const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.avif': 'image/avif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
}

function humanize(rel) {
  const p = rel.replace(/\\/g, '/')
  if (p.startsWith('components/Navbar')) return 'Navigation bar (site-wide)'
  if (p.startsWith('components/Footer')) return 'Footer (site-wide)'
  if (p.startsWith('components/Hero')) return 'Home - hero'
  if (p.startsWith('app/layout')) return 'Site metadata / social sharing image'
  const m = p.match(/^app\/(.+)\/page\.tsx$/)
  if (m) return m[1].split('/').map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())).join(' / ')
  if (p === 'app/page.tsx') return 'Home page'
  const c = p.match(/^components\/(.+)\.tsx$/)
  if (c) return `Component: ${c[1]}`
  return p
}

// ---- files ----
const files = []
for (const sub of ['assets', 'uploads']) {
  const dir = path.join(root, 'public', sub)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f)
    const st = fs.statSync(full)
    if (!st.isFile()) continue
    const ext = path.extname(f).toLowerCase()
    files.push({
      filename: f,
      relPath: `/${sub}/${f}`,
      kind: VIDEO_EXT.includes(ext) ? 'video' : 'photo',
      mime: MIME[ext] || 'application/octet-stream',
      size: st.size,
      modifiedAt: st.mtime.toISOString(),
    })
  }
}

// ---- references ----
const references = {}
const EXCLUDE = new Set(['node_modules', '.next', 'admin'])
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!EXCLUDE.has(entry.name)) walk(path.join(dir, entry.name))
      continue
    }
    if (!/\.(tsx?|jsx?|css)$/.test(entry.name)) continue
    const full = path.join(dir, entry.name)
    const rel = path.relative(root, full)
    if (rel.startsWith(path.join('app', 'admin')) || rel.startsWith(path.join('lib', 'admin'))) continue
    fs.readFileSync(full, 'utf8').split('\n').forEach((line, i) => {
      const matches = line.match(REF_RE)
      if (!matches) return
      for (const m of matches) {
        references[m] = references[m] || []
        references[m].push({ file: rel, label: humanize(rel), line: i + 1 })
      }
    })
  }
}
for (const d of ['app', 'components', 'lib']) {
  const full = path.join(root, d)
  if (fs.existsSync(full)) walk(full)
}

const manifest = { generatedAt: new Date().toISOString(), files, references }
const out = path.join(root, 'lib', 'admin', 'media-manifest.json')
fs.writeFileSync(out, JSON.stringify(manifest, null, 1))
console.log(`media manifest: ${files.length} files, ${Object.keys(references).length} referenced paths -> ${path.relative(root, out)}`)
