/**
 * =====================================================================
 * MARRELAY ANALYTICS - EVENT HELPERS
 * =====================================================================
 * Named helpers for every tracked event. All go through dlPush (base params
 * are added automatically). Ecommerce events clear the ecommerce object first
 * (GA4 best practice). Conversions carry hashed PII in user_data.
 * =====================================================================
 */

import { dlPush, clearEcommerce } from './datalayer.js'
import { setUserId } from './identity.js'
import { buildUserData, splitName } from './hash.js'
import {
  CURRENCY, leadValue, buildItems, itemForService, allServiceItems,
} from './service-catalog.js'

/* ---------------- engagement & navigation ---------------- */

export function trackPageView(extra = {}) {
  dlPush('page_view', { funnel_step: 'page_view', ...extra })
}

export function trackScrollDepth(percent) {
  dlPush('scroll_depth', { percent_scrolled: percent })
}

export function trackEngagedVisit(reason, engagementMs) {
  dlPush('engaged_visit', { trigger_reason: reason, engagement_time_msec: engagementMs })
}

export function trackNav({ label, url, group, location }) {
  dlPush('navigation_click', { nav_label: label, nav_url: url, nav_group: group || '', nav_location: location || 'header' })
}

export function trackMenuOpen(name) {
  dlPush('menu_open', { menu_name: name })
}

export function trackCta({ text, destination, location, type }) {
  dlPush('cta_click', { cta_text: text, cta_destination: destination || '', cta_location: location || '', cta_type: type || 'button' })
}

export function trackLinkClick({ url, text, domain, outbound }) {
  dlPush(outbound ? 'outbound_click' : 'link_click', { link_url: url, link_text: text || '', link_domain: domain || '', outbound: !!outbound })
}

export function trackSocial(platform) {
  dlPush('social_click', { platform })
}

export function trackCaseStudyInteraction({ widget, action, value }) {
  dlPush('case_study_interaction', { widget, action, interaction_value: value != null ? value : '' })
}

/* ---------------- lead funnel (steps) ---------------- */

export function trackFormView({ formId, formType, location }) {
  dlPush('form_view', { funnel_step: 'form_view', form_id: formId, form_type: formType, form_location: location || '' })
}

export function trackFormStart({ formId, formType }) {
  dlPush('form_start', { funnel_step: 'form_start', form_id: formId, form_type: formType })
}

export function trackFormError({ formId, formType, errorFields }) {
  const list = errorFields || []
  // array for GTM/BigQuery + comma-string so it works as a GA4 custom dimension
  dlPush('form_error', { form_id: formId, form_type: formType, error_fields: list, error_field_list: list.join(',') })
}

/* ---------------- GA4 ecommerce ---------------- */

export function trackViewItemList(listName) {
  clearEcommerce()
  dlPush('view_item_list', { ecommerce: { item_list_name: listName || 'Services', items: allServiceItems() } })
}

export function trackSelectItem(serviceKey, listName) {
  const item = itemForService(serviceKey)
  if (!item) return
  clearEcommerce()
  dlPush('select_item', { ecommerce: { item_list_name: listName || 'Services', items: [item] } })
}

export function trackViewItem(serviceKey) {
  const item = itemForService(serviceKey)
  if (!item) return
  clearEcommerce()
  dlPush('view_item', { ecommerce: { currency: CURRENCY, value: item.price, items: [item] } })
}

export function trackAddToCart(services, budget) {
  const value = leadValue(budget)
  const items = buildItems(services, value)
  clearEcommerce()
  dlPush('add_to_cart', { ecommerce: { currency: CURRENCY, value, items } })
}

export function trackBeginCheckout(services, budget, formType) {
  const value = leadValue(budget)
  const items = buildItems(services, value)
  clearEcommerce()
  dlPush('begin_checkout', { funnel_step: 'begin_checkout', form_type: formType || '', ecommerce: { currency: CURRENCY, value, items } })
}

/* ---------------- conversion (generate_lead + purchase) ---------------- */

/**
 * Fire the lead conversion. Pushes BOTH generate_lead (clean conversion) and
 * purchase (revenue lens). PII is hashed client-side into user_data.
 *
 * @param {Object} [opts]
 * @param {string} [opts.name]
 * @param {string} [opts.email]
 * @param {string} [opts.phone]
 * @param {string[]} [opts.services]
 * @param {string} [opts.budget]
 * @param {string} [opts.timeline]
 * @param {string} [opts.formType]
 * @param {string} [opts.company]
 * @param {string} [opts.companyCountry]
 * @param {string} [opts.companyProvince]
 * @param {string} [opts.companyRemote]
 * @param {string} [opts.publicId]
 * @param {boolean} [opts.consent]
 * @returns {Promise<object>} the hashed user_data (also useful for the caller)
 */
export async function trackLead(opts = {}) {
  const {
    name, email, phone,
    services = [], budget, timeline,
    formType = 'contact', company,
    companyCountry, companyProvince, companyRemote,
    publicId, consent,
  } = opts
  const value = leadValue(budget)
  const items = buildItems(services, value)
  const transaction_id = publicId || `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const { firstName, lastName } = splitName(name)
  const user_data = await buildUserData({
    email, phone, firstName, lastName,
    region: companyProvince, country: companyCountry,
  })
  if (user_data.sha256_email) setUserId(user_data.sha256_email)

  const shared = {
    lead_type: formType,
    services,
    services_list: services.join(','), // comma-string for GA4 custom dimension use
    service_count: services.length,
    budget: budget || '',
    timeline: timeline || '',
    company: company || '',
    company_country: companyCountry || '',
    company_region: companyProvince || '',
    company_remote: companyRemote || '',
    lead_id: publicId || '',
    value,
    currency: CURRENCY,
    consent: !!consent,
    user_id: user_data.sha256_email || '',
    user_data,
  }

  // 1) GA4 recommended conversion
  dlPush('generate_lead', { funnel_step: 'lead', transaction_id, ...shared })

  // 2) Revenue lens - ecommerce purchase mirror
  clearEcommerce()
  dlPush('purchase', {
    ...shared,
    ecommerce: { transaction_id, currency: CURRENCY, value, items },
  })

  return user_data
}
