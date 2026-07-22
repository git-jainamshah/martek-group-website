/**
 * Finance / expenses domain helpers: option lists, id generation, currency
 * conversion (to a CAD base), and recurring-frequency math.
 * Isomorphic (no node-only imports) so client pages can share it.
 */

/** Uniform random int, using Web Crypto when available (Node 20+ and browsers). */
function randInt(max: number): number {
  const g: any = typeof globalThis !== 'undefined' ? (globalThis as any).crypto : null
  if (g && g.getRandomValues) {
    const a = new Uint32Array(1)
    g.getRandomValues(a)
    return a[0] % max
  }
  return Math.floor(Math.random() * max)
}

export const CURRENCIES = ['CAD', 'USD', 'INR', 'EUR'] as const
export type Currency = (typeof CURRENCIES)[number]
export const CURRENCY_SYMBOL: Record<string, string> = { CAD: 'CA$', USD: 'US$', INR: '₹', EUR: '€' }

export const ACCOUNT_TYPES = [
  'Chequing Account',
  'Savings Account',
  'Visa Credit Card',
  'Amex Credit Card',
  'Mastercard Credit Card',
] as const

export const OWNER_TYPES = ['company', 'individual'] as const

export const FREQUENCIES = ['weekly', 'bi-weekly', 'monthly', 'quarterly', 'twice-a-year', 'yearly'] as const
export type Frequency = (typeof FREQUENCIES)[number]

/** Occurrences per year for each frequency (used to normalise spend). */
export const FREQ_PER_YEAR: Record<string, number> = {
  weekly: 52, 'bi-weekly': 26, monthly: 12, quarterly: 4, 'twice-a-year': 2, yearly: 1,
}
export const FREQ_DAYS: Record<string, number> = {
  weekly: 7, 'bi-weekly': 14, monthly: 30, quarterly: 91, 'twice-a-year': 182, yearly: 365,
}

/** Recurring expense sub-types + a starter list of common tools. */
export const RECURRING_CATEGORIES = ['Tool / Software', 'Hosting / Domain', 'Marketing / Ads', 'Office / Rent', 'Insurance', 'Payroll / Contractor', 'Other'] as const
export const EXPENSE_CATEGORIES = ['Software', 'Hardware', 'Office', 'Travel', 'Meals', 'Marketing / Ads', 'Contractor', 'Fees / Bank', 'Taxes', 'Other'] as const

/** The category that unlocks the marketing type + platform fields. */
export const MARKETING_CATEGORY = 'Marketing / Ads'
/** What kind of marketing spend this is. */
export const MARKETING_TYPES = [
  'Display Ads', 'Paid Search Ads', 'Paid Social Ads', 'Video Ads', 'Retargeting',
  'Print / Pamphlets', 'Sponsorship', 'Influencer / Creator', 'Content / SEO', 'Email Marketing', 'Events', 'Other',
] as const
/** Which platform / channel the spend went to. "Other" opens a free-text field. */
export const MARKETING_PLATFORMS = [
  'Meta (Facebook/Instagram)', 'TikTok', 'LinkedIn', 'X (Twitter)', 'Google Ads', 'Google SA360',
  'Google DV360', 'YouTube Ads', 'Microsoft / Bing Ads', 'Pinterest', 'Snapchat', 'Reddit', 'Amazon Ads', 'Other',
] as const
export const TOOL_PRESETS = [
  'Microsoft 365', 'Google Workspace', 'Squarespace Domain', 'Vercel', 'Canva', 'Claude',
  'ChatGPT', 'Adobe Creative Cloud', 'Figma', 'Notion', 'Slack', 'GitHub', 'Zoom', 'QuickBooks',
]

export function generateExpenseId(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return 'MEX-' + Array.from({ length: 6 }, () => chars[randInt(chars.length)]).join('')
}
export function generateAccountId(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return 'ACC-' + Array.from({ length: 5 }, () => chars[randInt(chars.length)]).join('')
}

export type FxRates = { base: string; updatedAt?: string; rates: Record<string, number> }
export const DEFAULT_FX: FxRates = { base: 'CAD', rates: { CAD: 1, USD: 1.37, EUR: 1.48, INR: 0.016 } }

/** Convert an amount in `currency` to the CAD base using the given rates. */
export function toCAD(amount: number, currency: string, fx: FxRates = DEFAULT_FX): number {
  const rate = fx.rates?.[currency]
  if (!rate || !isFinite(rate)) return Number(amount) || 0
  return (Number(amount) || 0) * rate
}

/** Monthly-equivalent CAD cost of a recurring expense (0 for one-off). */
export function monthlyCAD(e: { amount: number; currency: string; kind: string; frequency?: string | null }, fx: FxRates = DEFAULT_FX): number {
  if (e.kind !== 'recurring' || !e.frequency) return 0
  const perYear = FREQ_PER_YEAR[e.frequency] ?? 12
  return (toCAD(e.amount, e.currency, fx) * perYear) / 12
}
/** Annual CAD cost of a recurring expense. */
export function annualCAD(e: { amount: number; currency: string; kind: string; frequency?: string | null }, fx: FxRates = DEFAULT_FX): number {
  if (e.kind !== 'recurring' || !e.frequency) return 0
  const perYear = FREQ_PER_YEAR[e.frequency] ?? 12
  return toCAD(e.amount, e.currency, fx) * perYear
}

/** True if a recurring expense is active on a given date (respects expiry). */
export function isActiveOn(e: { kind: string; start_date?: string | null; expiry_date?: string | null }, date: Date): boolean {
  if (e.kind !== 'recurring') return false
  const t = date.getTime()
  if (e.start_date && new Date(e.start_date).getTime() > t) return false
  if (e.expiry_date && new Date(e.expiry_date).getTime() < t) return false
  return true
}

/** Next renewal date from start + frequency, rolled forward to the future. */
export function nextRenewal(startDate?: string | null, frequency?: string | null, expiry?: string | null): string | null {
  if (!startDate || !frequency) return null
  const start = new Date(startDate)
  if (isNaN(start.getTime())) return null
  const now = new Date()
  const next = new Date(start)
  const bump = () => {
    switch (frequency) {
      case 'weekly': next.setDate(next.getDate() + 7); break
      case 'bi-weekly': next.setDate(next.getDate() + 14); break
      case 'monthly': next.setMonth(next.getMonth() + 1); break
      case 'quarterly': next.setMonth(next.getMonth() + 3); break
      case 'twice-a-year': next.setMonth(next.getMonth() + 6); break
      case 'yearly': next.setFullYear(next.getFullYear() + 1); break
      default: next.setMonth(next.getMonth() + 1)
    }
  }
  let guard = 0
  while (next.getTime() <= now.getTime() && guard < 2000) { bump(); guard++ }
  if (expiry && next.getTime() > new Date(expiry).getTime()) return null // no renewal past expiry
  return next.toISOString().slice(0, 10)
}

export function fmtMoney(amount: number, currency = 'CAD'): string {
  const sym = CURRENCY_SYMBOL[currency] || (currency + ' ')
  return sym + (Number(amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
