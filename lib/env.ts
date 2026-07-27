/**
 * Environment awareness for the site and admin panel.
 *
 * SAFETY: everything here defaults to `production`. If `NEXT_PUBLIC_APP_ENV`
 * is not set - which is the case for the live site today - behaviour is exactly
 * what it was before this file existed. QA and DEV opt in explicitly by setting
 * the variable in their own Vercel environment.
 *
 * Each environment points at its own DATABASE_URL, so leads, users, invoices,
 * settings and tracking configuration are fully isolated. Nothing in the code
 * can cross environments, because the connection string is the only door in.
 */

export type AppEnv = 'production' | 'qa' | 'dev'

const RAW = (process.env.NEXT_PUBLIC_APP_ENV ?? '').trim().toLowerCase()

/** Current environment. Unknown / unset always resolves to production. */
export const APP_ENV: AppEnv =
  RAW === 'qa' ? 'qa' : RAW === 'dev' || RAW === 'development' ? 'dev' : 'production'

export const isProduction = APP_ENV === 'production'
export const isQA = APP_ENV === 'qa'
export const isDev = APP_ENV === 'dev'
/** True for anything that is not the live customer-facing site. */
export const isNonProduction = !isProduction

/** Human label used in banners and titles. */
export const ENV_LABEL: Record<AppEnv, string> = {
  production: 'Production',
  qa: 'QA',
  dev: 'Development',
}

/** Banner colour per environment (amber = QA, blue = dev). */
export const ENV_COLOR: Record<AppEnv, string> = {
  production: '#2F6B4F',
  qa: '#B4791A',
  dev: '#3F5EA8',
}

export const envLabel = ENV_LABEL[APP_ENV]
export const envColor = ENV_COLOR[APP_ENV]

/** Canonical base URL for this environment. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (isQA ? 'https://qa.marrelay.com' : isDev ? 'https://dev.marrelay.com' : 'https://www.marrelay.com')

/**
 * Short fingerprint of the database this deployment is talking to (host + db
 * name only, never credentials). Surfaced in the admin banner so you can
 * confirm at a glance that QA is not pointed at the production database.
 */
export function dbFingerprint(): string {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
  if (!url) return 'no database configured'
  try {
    const u = new URL(url)
    const name = u.pathname.replace(/^\//, '') || 'postgres'
    return `${u.hostname.split('.')[0]}/${name}`
  } catch {
    return 'unparseable database url'
  }
}
