import { q } from './pg'
import { ensureDb } from './db'
import { fmtDateTime, fmtDate, easternDayKey } from './dates'

/** Budget chips → numeric range ('5-15k' → 5000..15000). */
export function budgetToRange(b: string): { min: number | null; max: number | null } {
  switch (b) {
    case '<5k': return { min: 0, max: 5000 }
    case '5-15k': return { min: 5000, max: 15000 }
    case '15-40k': return { min: 15000, max: 40000 }
    case '40k+': return { min: 40000, max: null }
    default: return { min: null, max: null }
  }
}

export type LeadFilters = {
  q?: string
  status?: string
  formType?: string
  sourcePage?: string
  service?: string
  budget?: string
  from?: string // YYYY-MM-DD
  to?: string
  // numeric budget range (overlap semantics)
  minBudget?: number
  maxBudget?: number
  // marketing filters
  channel?: string        // matches session OR first channel group
  source?: string
  medium?: string
  campaign?: string
  clickId?: string        // 'any' | gclid | fbclid | li_fat_id | ttclid | epik | msclkid | twclid | other
  landing?: string
  referrer?: string
  deleted?: boolean       // true = Delete Folder view
}

const CLICK_COLS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'li_fat_id', 'ttclid', 'epik', 'msclkid', 'dclid', 'twclid', 'sclid', 'irclickid']

/** Leads joined with their marketing snapshot, fully filterable. */
export async function queryLeads(f: LeadFilters): Promise<any[]> {
  await ensureDb()
  const where: string[] = [f.deleted ? 'l.deleted_at IS NOT NULL' : 'l.deleted_at IS NULL']
  const params: unknown[] = []
  const p = () => `$${params.length}`

  if (f.q) {
    const like = `%${f.q}%`
    params.push(like)
    const n = p()
    where.push(`(l.name ILIKE ${n} OR l.email ILIKE ${n} OR l.company ILIKE ${n} OR l.message ILIKE ${n})`)
  }
  if (f.status) { params.push(f.status); where.push(`l.status = ${p()}`) }
  if (f.formType) { params.push(f.formType); where.push(`l.form_type = ${p()}`) }
  if (f.sourcePage) { params.push(`%${f.sourcePage}%`); where.push(`l.source_page ILIKE ${p()}`) }
  if (f.service) { params.push(`%"${f.service}"%`); where.push(`l.extra LIKE ${p()}`) }
  if (f.budget) { params.push(`%"budget":"${f.budget}"%`); where.push(`l.extra LIKE ${p()}`) }
  if (f.from) { params.push(`${f.from}T00:00:00Z`); where.push(`l.created_at >= ${p()}::timestamptz`) }
  if (f.to) { params.push(`${f.to}T23:59:59Z`); where.push(`l.created_at <= ${p()}::timestamptz`) }

  // numeric budget overlap: lead range [min,max] intersects filter range
  if (f.minBudget !== undefined && !Number.isNaN(f.minBudget)) {
    params.push(f.minBudget)
    where.push(`(m.budget_max IS NULL OR m.budget_max >= ${p()})`)
  }
  if (f.maxBudget !== undefined && !Number.isNaN(f.maxBudget)) {
    params.push(f.maxBudget)
    where.push(`(m.budget_min IS NULL OR m.budget_min <= ${p()})`)
  }

  if (f.channel) { params.push(f.channel); const n = p(); where.push(`(m.session_channel_group = ${n} OR m.first_channel_group = ${n})`) }
  if (f.source) { params.push(`%${f.source}%`); const n = p(); where.push(`(m.session_source ILIKE ${n} OR m.first_source ILIKE ${n})`) }
  if (f.medium) { params.push(`%${f.medium}%`); const n = p(); where.push(`(m.session_medium ILIKE ${n} OR m.first_medium ILIKE ${n})`) }
  if (f.campaign) { params.push(`%${f.campaign}%`); const n = p(); where.push(`(m.session_campaign ILIKE ${n} OR m.first_campaign ILIKE ${n})`) }
  if (f.landing) { params.push(`%${f.landing}%`); where.push(`m.landing_page ILIKE ${p()}`) }
  if (f.referrer) { params.push(`%${f.referrer}%`); where.push(`m.referrer_url ILIKE ${p()}`) }
  if (f.clickId === 'any') {
    where.push(`(${CLICK_COLS.map((c) => `m.${c} IS NOT NULL`).join(' OR ')} OR m.other_click_ids IS NOT NULL)`)
  } else if (f.clickId && CLICK_COLS.includes(f.clickId)) {
    where.push(`m.${f.clickId} IS NOT NULL`)
  } else if (f.clickId === 'none') {
    where.push(`(${CLICK_COLS.map((c) => `m.${c} IS NULL`).join(' AND ')} AND m.other_click_ids IS NULL)`)
  }

  const sql = `
    SELECT l.*,
      m.ga_client_id, m.ga_session_id, m.session_id,
      ${CLICK_COLS.map((c) => `m.${c}`).join(', ')}, m.other_click_ids,
      m.first_source, m.first_medium, m.first_campaign, m.first_term, m.first_content, m.first_channel_group, m.first_touch_at,
      m.session_source, m.session_medium, m.session_campaign, m.session_term, m.session_content, m.session_channel_group,
      m.referrer_url, m.landing_page, m.user_agent, m.budget_min, m.budget_max,
      o.lead_kind, o.contact_method, o.added_by
    FROM leads l
    LEFT JOIN leads_marketing m ON m.lead_id = l.id
    LEFT JOIN leads_offline o ON o.lead_id = l.id
    WHERE ${where.join(' AND ')}
    ORDER BY l.id DESC`
  const rows = await q(sql, params)
  return rows.map((r) => ({ ...r, created_at: fmt(r.created_at), updated_at: fmt(r.updated_at), deleted_at: r.deleted_at ? fmt(r.deleted_at) : null }))
}

/**
 * Serialise a timestamp for the API as full ISO 8601 **with** the timezone marker.
 *
 * This used to return "2026-07-25 05:40:50" (T and Z stripped). Without a
 * timezone the browser parses it as LOCAL time, so a UTC timestamp rendered as
 * if it were already Eastern and every lead looked hours newer than it was.
 * Keep it unambiguous here and let the display layer (lib/admin/dates.ts)
 * convert to Eastern.
 */
function fmt(v: unknown): string {
  if (v instanceof Date) return v.toISOString()
  const s = String(v ?? '')
  if (!s) return ''
  // Postgres text form "2026-07-25 05:40:50+00" -> normalise to ISO.
  const d = new Date(s.includes('T') ? s : s.replace(' ', 'T') + (/[+-]\d{2}|Z$/.test(s) ? '' : 'Z'))
  return isNaN(d.getTime()) ? s : d.toISOString()
}

export function parseFilters(p: URLSearchParams): LeadFilters {
  const num = (k: string) => (p.get(k) ? Number(p.get(k)) : undefined)
  return {
    q: p.get('q') || undefined,
    status: p.get('status') || undefined,
    formType: p.get('formType') || undefined,
    sourcePage: p.get('sourcePage') || undefined,
    service: p.get('service') || undefined,
    budget: p.get('budget') || undefined,
    from: p.get('from') || undefined,
    to: p.get('to') || undefined,
    minBudget: num('minBudget'),
    maxBudget: num('maxBudget'),
    channel: p.get('channel') || undefined,
    source: p.get('source') || undefined,
    medium: p.get('medium') || undefined,
    campaign: p.get('campaign') || undefined,
    clickId: p.get('clickId') || undefined,
    landing: p.get('landing') || undefined,
    referrer: p.get('referrer') || undefined,
    deleted: p.get('deleted') === '1',
  }
}

export const LEAD_EXPORT_HEADERS = [
  'Lead ID', 'Created', 'Name', 'Email', 'Company', 'Phone', 'Form', 'Source page',
  'Services', 'Budget', 'Timeline', 'Referral', 'Status', 'Message', 'Notes', 'Consent', 'Consent at', 'Company URL', 'Company location', 'Remote',
]

export const MARKETING_EXPORT_HEADERS = [
  ...LEAD_EXPORT_HEADERS,
  'Session channel', 'Session source', 'Session medium', 'Session campaign', 'Session term', 'Session content',
  'First channel', 'First source', 'First medium', 'First campaign', 'First term', 'First content', 'First touch at',
  'GA4 client ID', 'GA4 session ID', 'Session ID',
  'gclid', 'fbclid', 'li_fat_id', 'ttclid', 'epik', 'msclkid', 'twclid', 'Other click IDs',
  'Referrer URL', 'Landing page', 'Budget min', 'Budget max',
]

export function leadToRow(l: any): string[] {
  let extra: any = {}
  try { extra = JSON.parse(l.extra || '{}') } catch {}
  return [
    l.public_id || String(l.id), fmtDateTime(l.created_at, ''), l.name ?? '', l.email ?? '', l.company ?? '', l.phone ?? '',
    l.form_type ?? '', l.source_page ?? '',
    Array.isArray(extra.services) ? extra.services.join('; ') : '',
    extra.budget ?? '', [extra.timeline].filter(Boolean).join(''), [extra.referral, extra.referralDetail].filter(Boolean).join(' - '),
    l.status ?? '', l.message ?? '', l.notes ?? '',
    l.consent ? 'Yes' : 'No', l.consent_at ? fmtDateTime(l.consent_at, '') : '',
    extra.companyUrl ?? '', [extra.companyProvince, extra.companyCountry].filter(Boolean).join(', '), extra.companyRemote ?? '',
  ]
}

export function leadToMarketingRow(l: any): string[] {
  return [
    ...leadToRow(l),
    l.session_channel_group ?? '', l.session_source ?? '', l.session_medium ?? '', l.session_campaign ?? '', l.session_term ?? '', l.session_content ?? '',
    l.first_channel_group ?? '', l.first_source ?? '', l.first_medium ?? '', l.first_campaign ?? '', l.first_term ?? '', l.first_content ?? '', l.first_touch_at ?? '',
    l.ga_client_id ?? '', l.ga_session_id ?? '', l.session_id ?? '',
    l.gclid ?? '', l.fbclid ?? '', l.li_fat_id ?? '', l.ttclid ?? '', l.epik ?? '', l.msclkid ?? '', l.twclid ?? '', l.other_click_ids ?? '',
    l.referrer_url ?? '', l.landing_page ?? '', l.budget_min != null ? String(l.budget_min) : '', l.budget_max != null ? String(l.budget_max) : '',
  ]
}

/** Aggregates for the leads dashboard. */
export async function leadStats(f: LeadFilters) {
  const leads = await queryLeads(f)
  const count = (fn: (l: any) => string | undefined | null) => {
    const map = new Map<string, number>()
    for (const l of leads) {
      const k = fn(l) || '(not set)'
      map.set(k, (map.get(k) ?? 0) + 1)
    }
    return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }
  const extraOf = (l: any) => { try { return JSON.parse(l.extra || '{}') } catch { return {} } }

  // per-day series
  const byDay = new Map<string, number>()
  for (const l of leads) {
    const d = easternDayKey(l.created_at)
    byDay.set(d, (byDay.get(d) ?? 0) + 1)
  }
  const series = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, value]) => ({ date, value }))

  // services multi-count
  const svc = new Map<string, number>()
  for (const l of leads) {
    for (const s of extraOf(l).services ?? []) svc.set(s, (svc.get(s) ?? 0) + 1)
  }

  return {
    total: leads.length,
    withCompany: leads.filter((l) => l.company).length,
    withClickId: leads.filter((l) => l.gclid || l.fbclid || l.li_fat_id || l.ttclid || l.epik || l.msclkid || l.twclid || l.other_click_ids).length,
    byStatus: count((l) => l.status),
    byService: [...svc.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
    byBudget: count((l) => extraOf(l).budget),
    byChannel: count((l) => l.session_channel_group),
    bySourceMedium: count((l) => (l.session_source ? `${l.session_source} / ${l.session_medium}` : null)).slice(0, 8),
    byForm: count((l) => l.form_type),
    byLanding: count((l) => l.landing_page).slice(0, 8),
    topCompanies: leads.filter((l) => l.company).slice(0, 10).map((l) => ({ company: l.company, name: l.name, status: l.status, created: l.created_at })),
    series,
  }
}
