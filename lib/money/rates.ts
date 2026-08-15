import { BASE, CODES, type Rates } from './currencies'

/**
 * Exchange rates, fetched on the server once a day.
 *
 * Two decisions worth recording.
 *
 * Why not fetch in the browser: every visitor would make a third-party request
 * on load, prices would pop in after first paint (a layout shift on a site that
 * publishes a Core Web Vitals guide), and a slow or down API would leave the
 * prices broken. Fetching here means the reader's switcher is instant and
 * cannot fail.
 *
 * Why daily is enough: the figures in the posts are explicitly approximate
 * ("roughly", "indicative", "about"). A rate that is twelve hours old moves a
 * CA$5,000 estimate by a few dollars, which is far inside the error bars of the
 * estimate itself.
 *
 * Note there is no free Google currency API. Google retired theirs in 2012;
 * what remains lives inside Search and is not callable. This uses
 * exchangerate-api's open endpoint, which needs no key and, unlike the ECB
 * feeds, carries the Gulf currencies.
 */

const ENDPOINT = `https://open.er-api.com/v6/latest/${BASE}`

/**
 * Fallback so a failed fetch degrades to slightly stale numbers rather than to
 * no prices at all. Captured 15 August 2026. Anything using these is flagged
 * stale in the UI.
 */
const FALLBACK: Record<string, number> = {
  CAD: 1, USD: 0.7206, EUR: 0.6228, AUD: 1.0174, NZD: 1.2237,
  AED: 2.6462, SAR: 2.7021, INR: 68.742, CNY: 4.863, HKD: 5.6557,
}
const FALLBACK_DATE = '2026-08-15'

export async function getRates(): Promise<Rates> {
  try {
    const res = await fetch(ENDPOINT, {
      // Revalidate daily. Independent of the page's own revalidate window.
      next: { revalidate: 60 * 60 * 24 },
    })
    if (!res.ok) throw new Error(`rates: HTTP ${res.status}`)

    const json = (await res.json()) as {
      result?: string
      rates?: Record<string, number>
      time_last_update_utc?: string
    }
    if (json.result !== 'success' || !json.rates) throw new Error('rates: bad payload')

    const rates: Record<string, number> = { [BASE]: 1 }
    for (const code of CODES) {
      const v = json.rates[code]
      // Reject anything non-numeric or absurd rather than rendering nonsense.
      if (typeof v === 'number' && isFinite(v) && v > 0) rates[code] = v
    }

    // If the provider dropped currencies we promise in the switcher, fill the
    // gaps from the fallback rather than showing a currency with no price.
    let patched = false
    for (const code of CODES) {
      if (!rates[code]) { rates[code] = FALLBACK[code]; patched = true }
    }

    const date = json.time_last_update_utc
      ? new Date(json.time_last_update_utc).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)

    return { rates, date, stale: patched }
  } catch {
    return { rates: { ...FALLBACK }, date: FALLBACK_DATE, stale: true }
  }
}
