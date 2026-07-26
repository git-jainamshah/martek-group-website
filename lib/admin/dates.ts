/**
 * Human-friendly date formatting for the admin panel.
 *
 * The database keeps everything in UTC (TIMESTAMPTZ) - that does not change.
 * These helpers only affect how a date is *displayed*, converting to Eastern
 * time so non-technical users see a timestamp they recognise:
 *
 *    "July 26, 2026, 2:03 PM EDT"
 *
 * America/Toronto is used rather than a fixed -5 offset so the label is
 * correct year round: it prints EST in winter and EDT during daylight saving.
 */

export const ADMIN_TZ = 'America/Toronto'

/** Accepts a Date, an ISO string, or a Postgres timestamp string. */
function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  const s = String(value).trim()
  if (!s) return null
  // Postgres may hand back "2026-07-25 05:40:50+00" - normalise for Safari/JS.
  const normalised = s.includes('T') ? s : s.replace(' ', 'T')
  const d = new Date(normalised)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Full timestamp: "July 26, 2026, 2:03 PM EDT"
 */
export function fmtDateTime(value: unknown, fallback = '-'): string {
  const d = toDate(value)
  if (!d) return fallback
  const date = d.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: ADMIN_TZ,
  })
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: ADMIN_TZ, timeZoneName: 'short',
  })
  return `${date}, ${time}`
}

/**
 * Date only: "July 26, 2026"
 */
export function fmtDate(value: unknown, fallback = '-'): string {
  const d = toDate(value)
  if (!d) return fallback
  return d.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: ADMIN_TZ,
  })
}

/**
 * Compact form for dense tables: "Jul 26, 2026, 2:03 PM"
 */
export function fmtDateTimeShort(value: unknown, fallback = '-'): string {
  const d = toDate(value)
  if (!d) return fallback
  const date = d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: ADMIN_TZ,
  })
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: ADMIN_TZ,
  })
  return `${date}, ${time}`
}

/**
 * Relative age for "how fresh is this lead": "2 hours ago", "Yesterday".
 * Falls back to an absolute date beyond a week.
 */
export function fmtRelative(value: unknown, fallback = '-'): string {
  const d = toDate(value)
  if (!d) return fallback
  const diffMs = Date.now() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return fmtDate(d, fallback)
}

/** YYYY-MM-DD in Eastern time, for grouping rows into days. */
export function easternDayKey(value: unknown): string {
  const d = toDate(value)
  if (!d) return ''
  return d.toLocaleDateString('en-CA', { timeZone: ADMIN_TZ })
}
