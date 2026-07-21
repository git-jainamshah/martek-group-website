/**
 * =====================================================================
 * MARRELAY ANALYTICS - IDENTITY & SESSION
 * =====================================================================
 * Stable identifiers passed on every dataLayer event so each user/session
 * can be uniquely identified:
 *   - client_id          GA4 _ga cookie (device); falls back to our own mk_cid
 *   - session_id         GA4 _ga_XXX session id
 *   - mk_session_id      our 30-min-window session id (survives if GA absent)
 *   - ga_session_number  session count from GA4
 *   - user_type          "new" (first session) or "returning"
 *   - user_pseudo_id     = client_id
 * All mirrored into first-party cookies so the server can read them too.
 * =====================================================================
 */

const COOKIE_DAYS = 400
const SESSION_ID_KEY = 'mk_session_id' // set by traffic-identification.js (sessionStorage)

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function getCookie(name) {
  if (!isBrowser()) return ''
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : ''
}

export function setCookie(name, value, days = COOKIE_DAYS) {
  if (!isBrowser()) return
  try {
    const maxAge = days ? `; Max-Age=${Math.floor(days * 86400)}` : ''
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/${maxAge}; SameSite=Lax${secure}`
  } catch { /* blocked - degrade */ }
}

function uuid() {
  try { return crypto.randomUUID() } catch {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
  }
}

/** GA4 client id from _ga cookie: GA1.1.111.222 -> 111.222 */
function gaClientId() {
  const m = getCookie('_ga').match(/(\d+\.\d+)$/)
  return m ? m[1] : ''
}

/** Parse the _ga_XXXX session cookie -> { sessionId, sessionNumber } */
function gaSession() {
  if (!isBrowser()) return { sessionId: '', sessionNumber: '' }
  const m = document.cookie.match(/_ga_[A-Z0-9]+=([^;]+)/)
  if (!m) return { sessionId: '', sessionNumber: '' }
  const parts = decodeURIComponent(m[1]).split('.')
  // GS1.1.<sessionId>.<sessionNumber>.<engaged>...
  return { sessionId: parts[2] || '', sessionNumber: parts[3] || '' }
}

/** Our own client id (only used when GA hasn't set _ga yet). */
function ownClientId() {
  let v = getCookie('mk_cid')
  if (!v) { v = uuid(); setCookie('mk_cid', v) }
  return v
}

/** Our session id, from sessionStorage (traffic-identification) or cookie fallback. */
function mkSessionId() {
  if (!isBrowser()) return ''
  try {
    const s = sessionStorage.getItem(SESSION_ID_KEY)
    if (s) { setCookie('mk_sid', s, 0); return s } // session cookie mirror
  } catch { /* ignore */ }
  let v = getCookie('mk_sid')
  if (!v) { v = uuid(); setCookie('mk_sid', v, 0) }
  return v
}

/**
 * Count sessions and derive user_type. A session change is detected by the
 * session key changing (GA4 session id preferred, else mk_session_id).
 * new  = first session ever, returning = 2nd session onward.
 */
function resolveUserType(sessionKey) {
  const last = getCookie('mk_last_sess')
  let count = parseInt(getCookie('mk_sessions') || '0', 10) || 0
  if (sessionKey && sessionKey !== last) {
    count += 1
    setCookie('mk_sessions', String(count))
    setCookie('mk_last_sess', sessionKey)
    if (!getCookie('mk_first_ts')) setCookie('mk_first_ts', String(Date.now()))
  } else if (count === 0) {
    count = 1
    setCookie('mk_sessions', '1')
    if (sessionKey) setCookie('mk_last_sess', sessionKey)
    if (!getCookie('mk_first_ts')) setCookie('mk_first_ts', String(Date.now()))
  }
  return { count, userType: count <= 1 ? 'new' : 'returning' }
}

/** Everything identity-related for the current pageview/event. */
export function getIdentity() {
  if (!isBrowser()) return {}
  const client_id = gaClientId() || ownClientId()
  const { sessionId: ga_session_id, sessionNumber: ga_session_number } = gaSession()
  const mk_session_id = mkSessionId()
  const { userType, count } = resolveUserType(ga_session_id || mk_session_id)

  // mirror the resolved user_type for server-side reads
  setCookie('mk_user_type', userType)

  return {
    client_id,
    user_pseudo_id: client_id,
    session_id: ga_session_id || mk_session_id,
    ga_session_id,
    ga_session_number,
    mk_session_id,
    user_type: userType,
    visit_count: count,
  }
}

/** Set the known-user id (hashed email) after a lead, for cross-device stitching. */
export function setUserId(hashedEmail) {
  if (hashedEmail) setCookie('mk_uid', hashedEmail)
}
export function getUserId() {
  return getCookie('mk_uid')
}
