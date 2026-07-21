/**
 * =====================================================================
 * MARTEK ANALYTICS - TRAFFIC IDENTIFICATION
 * =====================================================================
 * Single source of truth for how a visitor was acquired. Runs in the
 * browser only. Captures:
 *
 *  - Ad-platform click IDs: gclid, gbraid, wbraid (Google), fbclid (Meta),
 *    li_fat_id (LinkedIn), ttclid (TikTok), epik (Pinterest), msclkid
 *    (Microsoft), dclid (Display & Video 360), twclid (X/Twitter),
 *    sclid (Snapchat), irclickid (Impact), plus anything ending in
 *    "clid"/"click_id" is swept into otherClickIds.
 *  - UTM parameters (source / medium / campaign / term / content)
 *  - GA4 client ID + GA4 session ID (read from Google's _ga cookies)
 *  - Our own session ID (30-minute inactivity window, like GA4)
 *  - FIRST-touch attribution (persisted forever in localStorage)
 *  - SESSION-touch attribution (persisted per session in sessionStorage)
 *  - Channel group for both, using GA4-style rules (see channelGroup())
 *  - The referrer URL and landing page
 *
 * "Direct" is only assigned when there is genuinely no signal: no UTMs,
 * no click IDs, and no external referrer.
 *
 * Usage:
 *   import { getTrafficData } from '@/analytics/traffic-identification'
 *   const traffic = getTrafficData()   // attach to lead submissions
 *
 * A future dataLayer implementation should also live in this folder so
 * every acquisition-related concern stays in one place.
 * =====================================================================
 */

const FIRST_KEY = 'mk_first_touch'      // localStorage - first ever visit
const SESSION_KEY = 'mk_session_touch'  // sessionStorage - this visit
const SESSION_ID_KEY = 'mk_session_id'
const SESSION_LAST_SEEN = 'mk_session_last_seen'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 min, matching GA4 default

// Known ad click IDs we break out into named fields
const CLICK_ID_PARAMS = [
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'li_fat_id', 'ttclid', 'epik',
  'msclkid', 'dclid', 'twclid', 'sclid', 'irclickid',
]

const SEARCH_ENGINES = [
  'google.', 'bing.', 'duckduckgo.', 'yahoo.', 'baidu.', 'yandex.', 'ecosia.', 'brave.',
]
const SOCIAL_SITES = [
  'facebook.', 'instagram.', 'linkedin.', 'twitter.', 't.co', 'x.com', 'tiktok.',
  'pinterest.', 'reddit.', 'youtube.', 'threads.', 'snapchat.', 'lnkd.in', 'fb.me',
]
const VIDEO_SITES = ['youtube.', 'vimeo.', 'twitch.']

// Internal / debug referrers. Traffic that arrives from these is NOT real
// acquisition - it's us testing tags. tagassistant.google.com is the Google
// Tag Assistant preview; gtm-msr.appspot.com is GTM server preview. Flagged as
// its own "GTM Debug" channel so it can be excluded from reports.
const INTERNAL_REFERRERS = ['tagassistant.google.com', 'gtm-msr.appspot.com']
function isInternalRef(host) {
  return !!host && INTERNAL_REFERRERS.some((d) => host === d || host.endsWith('.' + d))
}

/* ------------------------------------------------------------------ */
/* small helpers                                                       */
/* ------------------------------------------------------------------ */

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : ''
}

/** Write a first-party cookie (days=0 -> session cookie). */
function setCookie(name, value, days) {
  try {
    const maxAge = days ? `; Max-Age=${Math.floor(days * 86400)}` : ''
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/${maxAge}; SameSite=Lax${secure}`
  } catch { /* blocked - degrade */ }
}

/** Compact acquisition snapshot for cookie storage (small, server-readable). */
function compactTouch(t) {
  const sm = inferSourceMedium(t)
  return JSON.stringify({
    s: sm.source, m: sm.medium, c: t.campaign || '',
    ch: channelGroup(t), lp: t.landingPage || '', at: t.at || '',
  })
}

/** GA4 client id, from the _ga cookie: GA1.1.111111.222222 -> 111111.222222 */
function ga4ClientId() {
  const v = getCookie('_ga')
  const m = v.match(/\d+\.\d+$/)
  return m ? m[0] : ''
}

/** GA4 session id, from any _ga_XXXX cookie: GS1.1.<sessionId>.<n>... */
function ga4SessionId() {
  const m = document.cookie.match(/_ga_[A-Z0-9]+=([^;]+)/)
  if (!m) return ''
  const parts = decodeURIComponent(m[1]).split('.')
  return parts.length > 2 ? parts[2] : ''
}

function uuid() {
  try {
    return crypto.randomUUID()
  } catch {
    return 'xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }) + '-' + Date.now().toString(36)
  }
}

function hostOf(url) {
  try { return new URL(url).hostname.toLowerCase() } catch { return '' }
}

function isExternalReferrer(ref) {
  if (!ref) return false
  const h = hostOf(ref)
  return !!h && h !== window.location.hostname
}

/* ------------------------------------------------------------------ */
/* touch capture                                                       */
/* ------------------------------------------------------------------ */

/** Read UTMs + click IDs + referrer for the CURRENT page load. */
function captureTouch() {
  const qs = new URLSearchParams(window.location.search)
  const clickIds = {}
  const otherClickIds = {}

  for (const p of CLICK_ID_PARAMS) {
    const v = qs.get(p)
    if (v) clickIds[p] = v
  }
  // sweep unknown *clid / *click_id params too
  qs.forEach((v, k) => {
    const lk = k.toLowerCase()
    if ((lk.endsWith('clid') || lk.endsWith('click_id')) && !CLICK_ID_PARAMS.includes(lk)) {
      otherClickIds[lk] = v
    }
  })

  const ref = document.referrer || ''
  return {
    source: qs.get('utm_source') || '',
    medium: qs.get('utm_medium') || '',
    campaign: qs.get('utm_campaign') || '',
    term: qs.get('utm_term') || '',
    content: qs.get('utm_content') || '',
    clickIds,
    otherClickIds,
    referrer: isExternalReferrer(ref) ? ref : '',
    landingPage: window.location.pathname + window.location.search,
    at: new Date().toISOString(),
  }
}

/** True when this touch carries any acquisition signal at all. */
function hasSignal(t) {
  return !!(t.source || t.medium || t.campaign || Object.keys(t.clickIds).length ||
    Object.keys(t.otherClickIds).length || t.referrer)
}

/**
 * Infer source/medium when UTMs are missing, from click IDs + referrer.
 * Only falls back to direct/(none) when there is truly no signal.
 */
function inferSourceMedium(t) {
  let source = t.source
  let medium = t.medium

  // Internal GTM/Tag Assistant debug traffic is never real acquisition.
  if (t.referrer && isInternalRef(hostOf(t.referrer))) {
    return { source: 'gtm-debug', medium: 'internal' }
  }

  if (!source) {
    if (t.clickIds.gclid || t.clickIds.gbraid || t.clickIds.wbraid) { source = 'google'; medium = medium || 'cpc' }
    else if (t.clickIds.fbclid) { source = 'facebook'; medium = medium || 'paid-social' }
    else if (t.clickIds.li_fat_id) { source = 'linkedin'; medium = medium || 'paid-social' }
    else if (t.clickIds.ttclid) { source = 'tiktok'; medium = medium || 'paid-social' }
    else if (t.clickIds.epik) { source = 'pinterest'; medium = medium || 'paid-social' }
    else if (t.clickIds.msclkid) { source = 'bing'; medium = medium || 'cpc' }
    else if (t.clickIds.twclid) { source = 'x'; medium = medium || 'paid-social' }
    else if (t.clickIds.sclid) { source = 'snapchat'; medium = medium || 'paid-social' }
    else if (t.clickIds.dclid) { source = 'dv360'; medium = medium || 'display' }
    else if (t.referrer) {
      const h = hostOf(t.referrer)
      source = h.replace(/^www\./, '')
      if (SEARCH_ENGINES.some((s) => h.includes(s))) medium = medium || 'organic'
      else if (SOCIAL_SITES.some((s) => h.includes(s))) medium = medium || 'social'
      else medium = medium || 'referral'
    }
  }

  if (!source) { source = '(direct)'; medium = '(none)' }
  if (!medium) medium = '(not set)'
  return { source, medium }
}

/**
 * GA4-style default channel grouping.
 * Direct is ONLY used when there is no source signal whatsoever.
 */
function channelGroup(t) {
  // Internal GTM/Tag Assistant debug traffic → its own channel, never Organic.
  if (t.referrer && isInternalRef(hostOf(t.referrer))) return 'GTM Debug'
  const { source, medium } = inferSourceMedium(t)
  const src = source.toLowerCase()
  const med = medium.toLowerCase()
  const paidMediums = /^(cpc|ppc|paid|paid-social|paid_social|paidsearch|sem|retargeting|display|banner|cpm|cpv)$/

  if (src === '(direct)' && med === '(none)') return 'Direct'
  const isSearch = SEARCH_ENGINES.some((s) => src.includes(s.replace('.', ''))) || ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex'].includes(src)
  const isSocial = SOCIAL_SITES.some((s) => src.includes(s.replace(/\.|com/g, ''))) ||
    ['facebook', 'instagram', 'linkedin', 'twitter', 'x', 'tiktok', 'pinterest', 'reddit', 'threads', 'snapchat'].includes(src)
  const isVideo = VIDEO_SITES.some((s) => src.includes(s.replace('.', ''))) || src === 'youtube'

  if (isSearch && paidMediums.test(med)) return 'Paid Search'
  if (isSocial && paidMediums.test(med)) return 'Paid Social'
  if (isVideo && paidMediums.test(med)) return 'Paid Video'
  if (med === 'display' || med === 'banner' || med === 'cpm') return 'Display'
  if (paidMediums.test(med)) return 'Paid Other'
  if (isSearch) return 'Organic Search'
  if (isSocial) return 'Organic Social'
  if (isVideo) return 'Organic Video'
  if (med === 'email' || src === 'email' || med === 'e-mail') return 'Email'
  if (med === 'affiliate') return 'Affiliates'
  if (med === 'referral' || t.referrer) return 'Referral'
  return 'Unassigned'
}

/* ------------------------------------------------------------------ */
/* session + first-touch persistence                                   */
/* ------------------------------------------------------------------ */

/** Initialize/refresh persistence. Safe to call on every page view. */
export function initTraffic() {
  if (!isBrowser()) return
  try {
    const now = Date.now()
    const touch = captureTouch()

    // --- our session id (30-min inactivity window) ---
    const lastSeen = Number(sessionStorage.getItem(SESSION_LAST_SEEN) || 0)
    const expired = now - lastSeen > SESSION_TIMEOUT_MS
    if (!sessionStorage.getItem(SESSION_ID_KEY) || expired) {
      sessionStorage.setItem(SESSION_ID_KEY, uuid())
      sessionStorage.removeItem(SESSION_KEY) // new session -> new session attribution
    }
    sessionStorage.setItem(SESSION_LAST_SEEN, String(now))
    // mirror session id into a session cookie so the server can read it
    setCookie('mk_sid', sessionStorage.getItem(SESSION_ID_KEY), 0)

    // --- first-touch: only set once, ever (localStorage + 400-day cookie) ---
    if (!localStorage.getItem(FIRST_KEY)) {
      localStorage.setItem(FIRST_KEY, JSON.stringify(touch))
    }
    // keep the first-touch cookie in sync (backfills if the cookie was cleared)
    if (!getCookie('mk_first_touch')) {
      const firstStored = JSON.parse(localStorage.getItem(FIRST_KEY) || 'null') || touch
      setCookie('mk_first_touch', compactTouch(firstStored), 400)
    }

    // --- session-touch: first signal of the session wins; a NEW signal
    //     mid-session (e.g. user re-enters via an ad) overwrites it ---
    const existing = sessionStorage.getItem(SESSION_KEY)
    if (!existing || (hasSignal(touch) && !hasSignal(JSON.parse(existing)))) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(touch))
    }
    // mirror session-touch into a session cookie (kept fresh each page)
    const sessStored = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') || touch
    setCookie('mk_session_touch', compactTouch(sessStored), 0)
  } catch { /* storage blocked - degrade silently */ }
}

/** Everything we know about how this visitor was acquired. */
export function getTrafficData() {
  if (!isBrowser()) return null
  try {
    initTraffic()
    const first = JSON.parse(localStorage.getItem(FIRST_KEY) || 'null') || captureTouch()
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') || captureTouch()
    const firstSM = inferSourceMedium(first)
    const sessionSM = inferSourceMedium(session)

    return {
      // identifiers
      gaClientId: ga4ClientId(),
      gaSessionId: ga4SessionId(),
      sessionId: sessionStorage.getItem(SESSION_ID_KEY) || '',
      // click ids (session touch has priority; falls back to first touch)
      clickIds: { ...first.clickIds, ...session.clickIds },
      otherClickIds: { ...first.otherClickIds, ...session.otherClickIds },
      // first touch
      firstSource: firstSM.source,
      firstMedium: firstSM.medium,
      firstCampaign: first.campaign || '',
      firstTerm: first.term || '',
      firstContent: first.content || '',
      firstChannelGroup: channelGroup(first),
      firstTouchAt: first.at || '',
      // session touch
      sessionSource: sessionSM.source,
      sessionMedium: sessionSM.medium,
      sessionCampaign: session.campaign || '',
      sessionTerm: session.term || '',
      sessionContent: session.content || '',
      sessionChannelGroup: channelGroup(session),
      // context
      referrerUrl: session.referrer || first.referrer || '',
      landingPage: session.landingPage || first.landingPage || '',
      userAgent: navigator.userAgent || '',
    }
  } catch {
    return null
  }
}
