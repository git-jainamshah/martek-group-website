/**
 * Admin backend — Postgres data layer (Vercel/Neon compatible).
 * Schema is created + seeded automatically on first use.
 */
import crypto from 'crypto'
import { q, q1, run } from './pg'
import { hashPassword } from './auth'
import { PRICING_DEFAULTS } from './pricing-defaults'

let ready: Promise<void> | null = null

/** Ensure schema + seeds exist (memoized per process). */
export function ensureDb(): Promise<void> {
  if (!ready) ready = migrateAndSeed()
  return ready
}

async function migrateAndSeed() {
  await run(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    active INTEGER NOT NULL DEFAULT 1,
    must_change_password INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login TIMESTAMPTZ
  )`)
  await run(`
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
  )`)
  await run(`
  CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    rel_path TEXT NOT NULL UNIQUE,
    kind TEXT NOT NULL,
    mime TEXT,
    size BIGINT NOT NULL DEFAULT 0,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`)
  await run(`
  CREATE TABLE IF NOT EXISTS tag_managers (
    id SERIAL PRIMARY KEY,
    provider TEXT NOT NULL,
    container_id TEXT NOT NULL,
    environment TEXT NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`)
  await run(`
  CREATE TABLE IF NOT EXISTS scripts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'head',
    timing TEXT NOT NULL DEFAULT 'after_tm',
    sort_order INTEGER NOT NULL DEFAULT 0,
    enabled INTEGER NOT NULL DEFAULT 1,
    environment TEXT NOT NULL DEFAULT 'all',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`)
  await run(`
  CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    page_key TEXT NOT NULL,
    idx INTEGER NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    price_note TEXT,
    billing TEXT,
    description TEXT,
    tag TEXT,
    featured INTEGER NOT NULL DEFAULT 0,
    items TEXT NOT NULL DEFAULT '[]',
    cta_label TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(page_key, idx)
  )`)
  await run(`
  CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    message TEXT,
    source_page TEXT,
    form_type TEXT NOT NULL DEFAULT 'contact',
    package_interest TEXT,
    extra TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`)
  await run(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`)
  await run(`
  CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_email TEXT,
    action TEXT NOT NULL,
    detail TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`)

  // ---- Seed first admin ----
  const userCount = await q1<{ c: string }>('SELECT COUNT(*)::int AS c FROM users')
  if (Number(userCount?.c) === 0) {
    await run(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, must_change_password)
       VALUES ($1, $2, $3, $4, 'admin', 0)`,
      ['Jainam', 'Shah', 'email.jainam@gmail.com', hashPassword('Password@023!')]
    )
  }

  // ---- Seed media index from the build-time manifest ----
  const mediaCount = await q1<{ c: number }>('SELECT COUNT(*)::int AS c FROM media')
  if (Number(mediaCount?.c) === 0) {
    try {
      const { loadMediaManifest } = require('./media') as typeof import('./media')
      for (const f of loadMediaManifest().files) {
        await run(
          `INSERT INTO media (filename, rel_path, kind, mime, size, added_at, modified_at)
           VALUES ($1, $2, $3, $4, $5, $6, $6) ON CONFLICT (rel_path) DO NOTHING`,
          [f.filename, f.relPath, f.kind, f.mime, f.size, f.modifiedAt]
        )
      }
    } catch { /* manifest missing — media gets indexed on first admin visit */ }
  }

  // ---- Seed pricing packages ----
  const pkgCount = await q1<{ c: number }>('SELECT COUNT(*)::int AS c FROM packages')
  if (Number(pkgCount?.c) === 0) {
    for (const [pageKey, pkgs] of Object.entries(PRICING_DEFAULTS)) {
      for (let i = 0; i < pkgs.length; i++) {
        const p = pkgs[i]
        await run(
          `INSERT INTO packages (page_key, idx, name, price, price_note, billing, description, tag, featured, items, cta_label)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (page_key, idx) DO NOTHING`,
          [pageKey, i, p.name, p.price, p.priceNote ?? null, p.billing ?? null,
           p.description ?? null, p.tag ?? null, p.featured ? 1 : 0,
           JSON.stringify(p.items ?? []), p.ctaLabel ?? null]
        )
      }
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
      template: 'copy',
      title: '',
      body: '',
      imageUrl: '',
      primaryLabel: 'Learn more',
      primaryHref: '/contact',
      secondaryLabel: '',
      secondaryHref: '',
      delaySeconds: 3,
      frequency: 'once-per-session',
    },
    robots_txt: { extraDisallow: [] as string[], extraRules: '' },
    seo: { siteUrl: 'https://www.martekgroup.com', googleVerification: '', bingVerification: '' },
  }
  for (const [k, v] of Object.entries(defaults)) {
    await run(
      `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
      [k, JSON.stringify(v)]
    )
  }
}

export const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.avif': 'image/avif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime',
}

// ---------- settings helpers ----------
export async function getSetting<T>(key: string): Promise<T | null> {
  await ensureDb()
  const row = await q1<{ value: string }>('SELECT value FROM settings WHERE key = $1', [key])
  return row ? (JSON.parse(row.value) as T) : null
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  await ensureDb()
  await run(
    `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, JSON.stringify(value)]
  )
}

export async function audit(userEmail: string | null, action: string, detail?: string): Promise<void> {
  try {
    await run('INSERT INTO audit_log (user_email, action, detail) VALUES ($1, $2, $3)', [userEmail, action, detail ?? null])
  } catch { /* audit must never break the main action */ }
}

export function generateTempPassword(): string {
  const words = ['Maple', 'Harbor', 'Studio', 'Signal', 'Comet', 'Orbit', 'Pixel', 'Vector', 'Nova', 'Atlas']
  const w = words[crypto.randomInt(words.length)]
  const n = crypto.randomInt(1000, 9999)
  const s = '!@#$%'[crypto.randomInt(5)]
  return `Martek-${w}${n}${s}`
}
