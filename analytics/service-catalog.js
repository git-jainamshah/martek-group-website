/**
 * =====================================================================
 * MARRELAY ANALYTICS - SERVICE CATALOG & CONVERSION VALUE
 * =====================================================================
 * Services are modeled as GA4 Ecommerce "items" so leads can be reported
 * by revenue / conversion value. Value is derived from the budget tier the
 * visitor selects (best signal we collect), split across chosen services.
 *
 * EVERYTHING HERE IS EDITABLE - tweak values / currency without touching
 * event logic.
 * =====================================================================
 */

export const CURRENCY = 'CAD'

/** Form service value -> display name. Keyed by the form's <value> strings. */
export const SERVICE_CATALOG = {
  web:         { item_id: 'web',         item_name: 'Web Development',   item_category: 'Service' },
  data:        { item_id: 'data',        item_name: 'Data & Analytics',  item_category: 'Service' },
  social:      { item_id: 'social',      item_name: 'Social',            item_category: 'Service' },
  seo:         { item_id: 'seo',         item_name: 'SEO & Ads',         item_category: 'Service' },
  engineering: { item_id: 'engineering', item_name: 'Engineering & CAD', item_category: 'Service' },
}

/** Map a /services/* or /projects/* slug to a catalog key. */
export const SLUG_TO_SERVICE = {
  'web-development': 'web',
  'data-analytics': 'data',
  'social': 'social',
  'seo-ads': 'seo',
  'engineering': 'engineering',
  // case-study project slugs
  'analytics-tagging': 'data',
  'engineering-drawings': 'engineering',
}

/** Budget tier (form value) -> CAD midpoint used as the lead's pipeline value. */
export const BUDGET_VALUE = {
  '<5k': 2500,
  '5-15k': 10000,
  '15-40k': 27500,
  '40k+': 50000,
  'unsure': 3000,
}
const DEFAULT_VALUE = 3000

/** Total conversion value (CAD) for a lead, from its budget tier. */
export function leadValue(budget) {
  return BUDGET_VALUE[budget] != null ? BUDGET_VALUE[budget] : DEFAULT_VALUE
}

/** Round to 2dp to avoid float noise in revenue. */
function money(n) {
  return Math.round(n * 100) / 100
}

/**
 * Build a GA4 items[] array for the selected services, splitting the lead's
 * total value evenly across them. Falls back to a generic item when no
 * services are selected.
 */
export function buildItems(services, totalValue) {
  const list = Array.isArray(services) ? services.filter((s) => SERVICE_CATALOG[s]) : []
  if (!list.length) {
    return [{ item_id: 'general_enquiry', item_name: 'General Enquiry', item_category: 'Service', price: money(totalValue || DEFAULT_VALUE), quantity: 1 }]
  }
  const each = money((totalValue || DEFAULT_VALUE) / list.length)
  return list.map((s, i) => ({
    ...SERVICE_CATALOG[s],
    index: i,
    price: each,
    quantity: 1,
  }))
}

/** Single item for a service page (view_item / select_item). */
export function itemForService(serviceKey, value) {
  const base = SERVICE_CATALOG[serviceKey]
  if (!base) return null
  return { ...base, price: money(value != null ? value : DEFAULT_VALUE), quantity: 1 }
}

/** All services as an item list (view_item_list). */
export function allServiceItems() {
  return Object.values(SERVICE_CATALOG).map((it, i) => ({ ...it, index: i, price: DEFAULT_VALUE, quantity: 1 }))
}
