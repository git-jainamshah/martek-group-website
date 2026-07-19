/**
 * Server-side readers for admin-managed site settings (company profile,
 * social links) with hardcoded fallbacks so the public site never breaks
 * if the database is unavailable.
 */
import { SOCIALS as SOCIAL_DEFAULTS } from './social'

export type Company = {
  name: string; tagline: string
  addressLine1: string; addressLine2: string
  email: string; phone: string
  logoFull: string; logoIcon: string
}

export type SocialEntry = { platform: string; label: string; href: string; enabled: boolean }

export const COMPANY_DEFAULTS: Company = {
  name: 'Martek Group',
  tagline: 'Digital studio',
  addressLine1: 'Toronto, ON',
  addressLine2: 'Canada',
  email: 'hello@martek.studio',
  phone: '',
  logoFull: '/assets/martek-group-header.png',
  logoIcon: '/assets/martek-mark.png',
}

export async function getCompany(): Promise<Company> {
  try {
    const { getSetting } = require('./admin/db') as typeof import('./admin/db')
    const c = await getSetting<Company>('company')
    return { ...COMPANY_DEFAULTS, ...(c ?? {}) }
  } catch {
    return COMPANY_DEFAULTS
  }
}

/** Enabled socials only - what the live site should show. */
export async function getEnabledSocials(): Promise<SocialEntry[]> {
  try {
    const { getSetting } = require('./admin/db') as typeof import('./admin/db')
    const s = await getSetting<SocialEntry[]>('socials')
    if (!s) throw new Error('none')
    return s.filter((x) => x.enabled && x.href)
  } catch {
    return SOCIAL_DEFAULTS.map((s) => ({ platform: s.name, label: s.label, href: s.href, enabled: true }))
  }
}
