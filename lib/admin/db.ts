/**
 * Admin backend — SQLite data layer.
 * Single-file DB at data/admin.db (gitignored). Zero external services.
 * Swap point: if we later move to Supabase/Vercel Postgres, only this file
 * and the route handlers' queries change — the API contracts stay the same.
 */
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { openDatabase, DB } from './sqlite'
import { hashPassword } from './auth'
import { PRICING_DEFAULTS } from './pricing-defaults'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'admin.db')

let _db: DB | null = null

export function db(): DB {
  if (_db) return _db
  fs.mkdirSync(DATA_DIR, { recursive: true })
  _db = openDatabase(DB_PATH)
  _db.pragma('journal_mode = WAL')
  migrate(_db)
  seed(_db)
  return _db
}

function migrate(d: DB) {
  d.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    active INTEGER NOT NULL DEFAULT 1,
    must_change_password INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login TEXT
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    rel_path TEXT NOT NULL UNIQUE,      -- public URL path e.g. /assets/foo.jpg or /uploads/bar.mp4
    kind TEXT NOT NULL,                 -- photo | video
    mime TEXT,
    size INTEGER NOT NULL DEFAULT 0,
    added_at TEXT NOT NULL DEFAULT (datetime('now')),
    modified_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS tag_managers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,             -- gtm | tealium
    container_id TEXT NOT NULL,         -- GTM-XXXX or tealium account/profile/env
    environment TEXT NOT NULL,          -- production | qa | dev
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS scripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'head',   -- head | body | footer
    timing TEXT NOT NULL DEFAULT 'after_tm', -- before_tm | after_tm
    sort_order INTEGER NOT NULL DEFAULT 0,
    enabled INTEGER NOT NULL DEFAULT 1,
    environment TEXT NOT NULL DEFAULT 'all', -- all | production | qa | dev
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_key TEXT NOT NULL,
    idx INTEGER NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    price_note TEXT,
    billing TEXT,
    description TEXT,
    tag TEXT,
    featured INTEGER NOT NULL DEFAULT 0,
    items TEXT NOT NULL DEFAULT '[]',   -- JSON array of feature strings
    cta_label TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(page_key, idx)
  );
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    message TEXT,
    source_page TEXT,                   -- URL path the form was on
    form_type TEXT NOT NULL DEFAULT 'contact', -- contact | promo-banner | other
    package_interest TEXT,
    extra TEXT,                         -- JSON: services, budget, timeline, referral, etc.
    status TEXT NOT NULL DEFAULT 'new', -- new | contacted | qualified | won | lost
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    action TEXT NOT NULL,
    detail TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  `)
}

function seed(d: DB) {
  // ---- Seed first admin (only if no users exist) ----
  const userCount = d.prepare('SELECT COUNT(*) c FROM users').get() as { c: number }
  if (userCount.c === 0) {
    d.prepare(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, must_change_password)
       VALUES (?, ?, ?, ?, 'admin', 0)`
    ).run('Jainam', 'Shah', 'email.jainam@gmail.com', hashPassword('Password@023!'))
  }

  // ---- Seed media index from public/assets ----
  const mediaCount = d.prepare('SELECT COUNT(*) c FROM media').get() as { c: number }
  if (mediaCount.c === 0) {
    const assetsDir = path.join(process.cwd(), 'public', 'assets')
    if (fs.existsSync(assetsDir)) {
      const insert = d.prepare(
        `INSERT OR IGNORE INTO media (filename, rel_path, kind, mime, size, added_at, modified_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      for (const f of fs.readdirSync(assetsDir)) {
        const full = path.join(assetsDir, f)
        const st = fs.statSync(full)
        if (!st.isFile()) continue
        const ext = path.extname(f).toLowerCase()
        const kind = ['.mp4', '.webm', '.mov'].includes(ext) ? 'video' : 'photo'
        const mime = MIME[ext] || 'application/octet-stream'
        insert.run(f, `/assets/${f}`, kind, mime, st.size, st.birthtime.toISOString(), st.mtime.toISOString())
      }
    }
  }

  // ---- Seed pricing packages from current hardcoded site content ----
  const pkgCount = d.prepare('SELECT COUNT(*) c FROM packages').get() as { c: number }
  if (pkgCount.c === 0) {
    const insert = d.prepare(
      `INSERT INTO packages (page_key, idx, name, price, price_note, billing, description, tag, featured, items, cta_label)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    for (const [pageKey, pkgs] of Object.entries(PRICING_DEFAULTS)) {
      pkgs.forEach((p, i) =>
        insert.run(
          pageKey, i, p.name, p.price, p.priceNote ?? null, p.billing ?? null,
          p.description ?? null, p.tag ?? null, p.featured ? 1 : 0,
          JSON.stringify(p.items ?? []), p.ctaLabel ?? null
        )
      )
    }
  }

  // ---- Seed default settings ----
  const defaults: Record<string, unknown> = {
    announcement: {
      // **bold** renders as bold on the site
      default: {
        pill: 'New',
        text: 'We just launched a **fixed-price startup sprint**: a landing page in 14 days.',
        ctaLabel: 'See sprint pricing',
        ctaHref: '/#pricing',
        contactHref: '/contact',
      },
      overrides: [
        { path: '/services/web-development', pill: 'Web', text: 'Most launch sites go live in **4–6 weeks**. Landing-page sprints in 14 days.', ctaLabel: 'Start yours', ctaHref: '/contact?service=web', contactHref: '/contact?service=web' },
        { path: '/services/data-analytics', pill: 'Data', text: 'Most teams get a **clean dashboard + weekly report** within two weeks of kickoff.', ctaLabel: 'Get set up', ctaHref: '/contact?service=data', contactHref: '/contact?service=data' },
        { path: '/services/social', pill: 'Social', text: 'We become your **in-house content team**, strategy, posts, replies, and creator deals.', ctaLabel: "Let's talk", ctaHref: '/contact?service=social', contactHref: '/contact?service=social' },
        { path: '/services/seo-ads', pill: 'SEO & Ads', text: 'We move your **cost-per-acquisition down**, week by week, with receipts.', ctaLabel: 'Get a plan', ctaHref: '/contact?service=seo', contactHref: '/contact?service=seo' },
        { path: '/services/engineering', pill: 'Engineering', text: 'The side of the studio we built **first**, 4 years of CAD, drafting & 3D modelling.', ctaLabel: 'Send a brief', ctaHref: '/contact?service=engineering', contactHref: '/contact?service=engineering' },
        { path: '/contact', pill: 'Open', text: 'Currently taking on **new projects** — we keep slots limited to stay hands-on.', ctaLabel: 'Grab a slot', ctaHref: '/contact#form', contactHref: '/contact#form' },
      ],
    },
    promo_banner: {
      enabled: false,
      template: 'copy', // copy | picture | signup
      title: '',
      body: '',
      imageUrl: '',
      primaryLabel: 'Learn more',
      primaryHref: '/contact',
      secondaryLabel: '',
      secondaryHref: '',
      delaySeconds: 3,
      frequency: 'once-per-session', // once-per-session | every-visit
    },
    robots_txt: {
      extraDisallow: [] as string[],
      extraRules: '', // raw extra lines appended to robots
    },
    seo: {
      siteUrl: 'https://www.martekgroup.com',
      googleVerification: '',
      bingVerification: '',
    },
  }
  const has = d.prepare('SELECT COUNT(*) c FROM settings WHERE key = ?')
  const ins = d.prepare('INSERT INTO settings (key, value) VALUES (?, ?)')
  for (const [k, v] of Object.entries(defaults)) {
    if ((has.get(k) as { c: number }).c === 0) ins.run(k, JSON.stringify(v))
  }
}

export const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.avif': 'image/avif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
}

// ---------- settings helpers ----------
export function getSetting<T>(key: string): T | null {
  const row = db().prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined
  return row ? (JSON.parse(row.value) as T) : null
}

export function setSetting(key: string, value: unknown) {
  db().prepare(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
  ).run(key, JSON.stringify(value))
}

export function audit(userEmail: string | null, action: string, detail?: string) {
  db().prepare('INSERT INTO audit_log (user_email, action, detail) VALUES (?, ?, ?)').run(userEmail, action, detail ?? null)
}

export function generateTempPassword(): string {
  const words = ['Maple', 'Harbor', 'Studio', 'Signal', 'Comet', 'Orbit', 'Pixel', 'Vector', 'Nova', 'Atlas']
  const w = words[crypto.randomInt(words.length)]
  const n = crypto.randomInt(1000, 9999)
  const s = '!@#$%'[crypto.randomInt(5)]
  return `Martek-${w}${n}${s}`
}
