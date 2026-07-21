/**
 * =====================================================================
 * MARRELAY ANALYTICS - PII HASHING
 * =====================================================================
 * SHA-256 hashing (Web Crypto) for personally identifiable info before it
 * ever touches the dataLayer. Values are normalized the way Google Ads
 * Enhanced Conversions and Meta CAPI expect, THEN hashed. Only hashes
 * leave this module - never raw PII.
 * =====================================================================
 */

function isBrowser() {
  return typeof window !== 'undefined' && typeof crypto !== 'undefined' && !!crypto.subtle
}

/** Lowercase + trim; collapse internal whitespace. */
export function normText(v) {
  return String(v || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Email: trim + lowercase. (Gmail dot/plus stripping intentionally NOT done - keep it standard.) */
export function normEmail(v) {
  return String(v || '').trim().toLowerCase()
}

/**
 * Phone -> E.164-ish digits. Keeps a leading +, strips everything else.
 * Assumes North American (+1) when no country code is present and 10 digits.
 */
export function normPhone(v) {
  let s = String(v || '').replace(/[^\d+]/g, '')
  if (!s) return ''
  if (s.startsWith('+')) return s
  const digits = s.replace(/\D/g, '')
  if (digits.length === 10) return '+1' + digits // NANP default
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits
  return '+' + digits
}

/** SHA-256 -> lowercase hex. Returns '' on empty input or non-browser. */
export async function sha256(value) {
  const v = String(value || '')
  if (!v || !isBrowser()) return ''
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v))
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return ''
  }
}

/**
 * Build the hashed user_data object for a lead. Every value is normalized
 * then SHA-256'd. Empty inputs are omitted so match rates stay clean.
 */
export async function buildUserData({ email, phone, firstName, lastName, region, country } = {}) {
  const [em, ph, fn, ln, rg, co] = await Promise.all([
    sha256(normEmail(email)),
    sha256(normPhone(phone)),
    sha256(normText(firstName)),
    sha256(normText(lastName)),
    sha256(normText(region)),
    sha256(normText(country)),
  ])
  const out = {}
  if (em) out.sha256_email = em
  if (ph) out.sha256_phone_number = ph
  if (fn) out.sha256_first_name = fn
  if (ln) out.sha256_last_name = ln
  if (rg) out.sha256_region = rg
  if (co) out.sha256_country = co
  return out
}

/** Split a full name into first / last for hashing. */
export function splitName(full) {
  const parts = String(full || '').trim().split(/\s+/)
  if (parts.length <= 1) return { firstName: parts[0] || '', lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}
