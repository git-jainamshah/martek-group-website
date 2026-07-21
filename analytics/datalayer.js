/**
 * =====================================================================
 * MARRELAY ANALYTICS - DATALAYER CORE
 * =====================================================================
 * The single chokepoint for every dataLayer event. Guarantees:
 *   - window.dataLayer exists
 *   - a unique event_id (dedupe / server-side matching)
 *   - a consistent set of BASE PARAMS on every event (identity, acquisition,
 *     page, device, consent)
 * Nothing should push to window.dataLayer directly - always go through dlPush.
 * =====================================================================
 */

import { getIdentity } from './identity.js'
import { getTrafficData } from './traffic-identification.js'

function isBrowser() {
  return typeof window !== 'undefined'
}

function uuid() {
  try { return crypto.randomUUID() } catch { return 'e-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) }
}

function deviceType() {
  const w = isBrowser() ? window.innerWidth : 0
  if (w && w < 768) return 'mobile'
  if (w && w < 1024) return 'tablet'
  return 'desktop'
}

/** Flatten the acquisition object into GTM-friendly top-level params. */
function acquisitionParams() {
  const t = getTrafficData() || {}
  const clickIds = { ...(t.clickIds || {}), ...(t.otherClickIds || {}) }
  return {
    first_source: t.firstSource || '',
    first_medium: t.firstMedium || '',
    first_campaign: t.firstCampaign || '',
    first_channel_group: t.firstChannelGroup || '',
    first_touch_at: t.firstTouchAt || '',
    session_source: t.sessionSource || '',
    session_medium: t.sessionMedium || '',
    session_campaign: t.sessionCampaign || '',
    session_channel_group: t.sessionChannelGroup || '',
    landing_page: t.landingPage || '',
    referrer_url: t.referrerUrl || '',
    ...clickIds, // gclid, fbclid, li_fat_id, msclkid, ttclid, ...
  }
}

/** Base params merged into EVERY event. */
export function baseParams() {
  if (!isBrowser()) return {}
  const id = getIdentity()
  return {
    event_id: uuid(),
    event_time: new Date().toISOString(),
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    page_referrer: document.referrer || '',
    language: navigator.language || '',
    device_type: deviceType(),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    ...id,
    ...acquisitionParams(),
  }
}

/**
 * Push an event to the dataLayer with base params merged in.
 * @param {string} event  event name
 * @param {object} params event-specific params (override base if same key)
 */
export function dlPush(event, params = {}) {
  if (!isBrowser()) return
  window.dataLayer = window.dataLayer || []
  const payload = { event, ...baseParams(), ...params }
  window.dataLayer.push(payload)
  if (isDebug()) {
    // eslint-disable-next-line no-console
    console.log('%c[DL]', 'color:#8B5A8C;font-weight:bold', event, payload)
  }
  return payload
}

/** Clear the GA4 ecommerce object before a new ecommerce event (prevents merge). */
export function clearEcommerce() {
  if (!isBrowser()) return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ ecommerce: null })
}

let _debug
function isDebug() {
  if (_debug !== undefined) return _debug
  try {
    _debug = new URLSearchParams(window.location.search).has('dl_debug') ||
      localStorage.getItem('mk_dl_debug') === '1'
  } catch { _debug = false }
  return _debug
}
