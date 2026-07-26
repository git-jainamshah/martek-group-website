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

/**
 * Accepts a Date, an ISO string, a Unix epoch, or a Postgres timestamp string.
 *
 * Important: a timestamp with no timezone marker ("2026-07-25 05:40:50") is
 * treated as **UTC**, because that is what the database stores. Left to the
 * browser, JS would parse it as local time and every timestamp would be wrong
 * by the viewer's offset - which is exactly the bug this guards against.
 */
function toDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value

  // Epoch (seconds or milliseconds)
  if (typeof value === 'number') {
    const ms = value < 1e12 ? value * 1000 : value
    const d = new Date(ms)
    return isNaN(d.getTime()) ? null : d
  }

  const s = String(value).trim()
  if (!s) return null

  // Numeric string epoch
  if (/^\d{10}$|^\d{13}$/.test(s)) {
    const n = Number(s)
    return new Date(n < 1e12 ? n * 1000 : n)
  }

  // "2026-07-25 05:40:50" / "2026-07-25 05:40:50+00" / full ISO
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(s)
  const normalised = (s.includes('T') ? s : s.replace(' ', 'T')) + (hasZone ? '' : 'Z')
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/**
 * Date only: "July 26, 2026"
 *
 * A plain calendar date ("2026-07-26", as stored in DATE columns such as
 * invoice issue_date) is rendered literally with **no** timezone conversion.
 * Converting it would shift it to the previous day for anyone west of UTC,
 * which is how invoices end up dated a day early.
 */
export function fmtDate(value: unknown, fallback = '-'): string {
  if (typeof value === 'string') {
    const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (m) return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`
  }
  const d = toDate(value)
  if (!d) return fallback
  return d.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: ADMIN_TZ,
  })
}

/** Compact calendar date: "Jul 26, 2026". Same no-shift rule as fmtDate. */
export function fmtDateShort(value: unknown, fallback = '-'): string {
  if (typeof value === 'string') {
    const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (m) return `${MONTHS[Number(m[2]) - 1].slice(0, 3)} ${Number(m[3])}, ${m[1]}`
  }
  const d = toDate(value)
  if (!d) return fallback
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: ADMIN_TZ,
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
