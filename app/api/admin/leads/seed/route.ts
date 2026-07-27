import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit, generateLeadPublicId } from '@/lib/admin/db'
import { run, insertReturningId } from '@/lib/admin/pg'
import { requireAdmin } from '@/lib/admin/auth'
import { budgetToRange } from '@/lib/admin/leads'
import { isProduction } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Demo data: POST { count? } (Admins only) inserts realistic fake leads so
 * the tables, filters, and dashboard can be tested without real traffic.
 * Every demo record is tagged extra.demo=true, so they are easy to find
 * (search notes/message for "demo") and bulk-delete later.
 *
 * QA/DEV only. Hiding the button is not enough - this refuses to run on
 * production so fake records can never land among real customer leads,
 * whatever calls it.
 */

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const chance = (p: number) => Math.random() < p

const FIRST = ['Aiden', 'Priya', 'Marco', 'Sofia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Maya', 'Lucas', 'Zara', 'Owen', 'Isla', 'Ravi', 'Chloe', 'Dev', 'Nina', 'Cole', 'Tara']
const LAST = ['Patel', 'Chen', 'Rossi', 'Nguyen', 'Smith', 'Garcia', 'Kim', 'Brown', 'Singh', 'Miller', 'Costa', 'Ali', 'Fischer', 'Dube', 'Ortiz', 'Kaur', 'Wong', 'Silva', 'Novak', 'Reid']
const COMPANIES = ['Northline Goods', 'Bluepine Labs', 'Harbourview Dental', 'Stackform Studio', 'Maple & Main Cafe', 'Trailhead Outfitters', 'Vantage Legal', 'Brightside HVAC', 'Loom & Letter', 'Quartz Fitness', 'Ferris Logistics', 'Willow Property Co', 'Atlas Tutoring', 'Peak Auto Group', 'Cedar Financial']
const DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com']
const MESSAGES = [
  'Looking to redo our website before the fall season. Can you share timelines?',
  'We need help setting up GA4 and conversion tracking properly.',
  'Our social presence is dead. Want a team to run it end to end.',
  'Interested in the landing page sprint. What does it include?',
  'Need CAD drawings for a small commercial renovation.',
  'Our ads are burning budget with no leads. Can you audit them?',
  'Want a quote for a 5-10 page marketing site with a blog.',
  'Referred by a friend. We need branding plus a new site.',
  'Looking for monthly SEO support for a local business.',
  'Do you build e-commerce? We sell about 40 products.',
]
const BUDGETS = ['<5k', '5-10k', '10-25k', '25k+']
const TIMELINES = ['ASAP', '1-2 months', '3-6 months', 'Flexible']
const SERVICES = ['web', 'data', 'social', 'seo', 'engineering']
const STATUSES = ['new', 'new', 'new', 'new', 'contacted', 'contacted', 'contacted', 'qualified', 'qualified', 'won', 'lost']
const LANDINGS = ['/', '/services/web-development', '/services/data-analytics', '/services/seo-ads', '/services/social', '/contact', '/case-studies']
const REFERRALS = ['google', 'social', 'referral', 'other']
const COUNTRIES: [string, string[]][] = [
  ['Canada', ['Ontario', 'British Columbia', 'Alberta', 'Quebec']],
  ['United States', ['New York', 'California', 'Texas', 'Washington']],
]

type Scenario = {
  weight: number
  channel: string; source: string; medium: string
  campaign?: () => string | null; term?: () => string | null; content?: () => string | null
  clickId?: [string, string]; referrer?: string
}
const rnd = () => Math.random().toString(36).slice(2, 10)
const SCENARIOS: Scenario[] = [
  { weight: 22, channel: 'Direct', source: '(direct)', medium: '(none)' },
  { weight: 20, channel: 'Organic Search', source: 'google', medium: 'organic', referrer: 'https://www.google.com/' },
  { weight: 4, channel: 'Organic Search', source: 'bing', medium: 'organic', referrer: 'https://www.bing.com/' },
  { weight: 16, channel: 'Paid Search', source: 'google', medium: 'cpc', campaign: () => pick(['brand-search', 'web-design-toronto', 'seo-services']), term: () => pick(['web design agency', 'seo company near me', 'landing page design']), clickId: ['gclid', 'EAIaIQ'], referrer: 'https://www.google.com/' },
  { weight: 4, channel: 'Paid Search', source: 'bing', medium: 'cpc', campaign: () => 'bing-search', clickId: ['msclkid', 'ms'], referrer: 'https://www.bing.com/' },
  { weight: 10, channel: 'Paid Social', source: 'facebook', medium: 'paid-social', campaign: () => pick(['spring-promo', 'retargeting-q3']), content: () => pick(['carousel-a', 'video-15s']), clickId: ['fbclid', 'IwAR'], referrer: 'https://www.facebook.com/' },
  { weight: 5, channel: 'Paid Social', source: 'linkedin', medium: 'paid-social', campaign: () => 'b2b-leadgen', clickId: ['li_fat_id', 'li'], referrer: 'https://www.linkedin.com/' },
  { weight: 3, channel: 'Paid Social', source: 'tiktok', medium: 'paid-social', campaign: () => 'tt-awareness', clickId: ['ttclid', 'tt'], referrer: 'https://www.tiktok.com/' },
  { weight: 8, channel: 'Organic Social', source: 'instagram', medium: 'social', referrer: 'https://l.instagram.com/' },
  { weight: 4, channel: 'Organic Social', source: 'linkedin', medium: 'social', referrer: 'https://www.linkedin.com/' },
  { weight: 6, channel: 'Referral', source: pick(['clutch.co', 'partner-site.com', 'designrush.com']), medium: 'referral', referrer: 'https://clutch.co/profile' },
  { weight: 4, channel: 'Email', source: 'newsletter', medium: 'email', campaign: () => 'monthly-digest' },
]
function pickScenario(): Scenario {
  const total = SCENARIOS.reduce((a, s) => a + s.weight, 0)
  let r = Math.random() * total
  for (const s of SCENARIOS) { r -= s.weight; if (r <= 0) return s }
  return SCENARIOS[0]
}

export async function POST(req: NextRequest) {
  if (isProduction) {
    return NextResponse.json(
      { error: 'Demo data is disabled on production.' },
      { status: 403 }
    )
  }

  const auth = await requireAdmin()
  if ('error' in auth) return auth.error
  await ensureDb()
  const body = await req.json().catch(() => ({}))
  const count = Math.min(Math.max(Number(body.count) || 50, 1), 200)

  let created = 0
  for (let i = 0; i < count; i++) {
    const first = pick(FIRST), last = pick(LAST)
    const hasCompany = chance(0.62)
    const company = hasCompany ? pick(COMPANIES) : null
    const email = `${first}.${last}${Math.floor(Math.random() * 90) + 10}@${pick(DOMAINS)}`.toLowerCase()
    const services = SERVICES.filter(() => chance(0.3))
    if (!services.length) services.push(pick(SERVICES))
    const budget = pick(BUDGETS)
    const range = budgetToRange(budget)
    const formType = chance(0.85) ? 'contact' : 'promo-banner'
    const referral = pick(REFERRALS)
    const sc = pickScenario()
    const landing = pick(LANDINGS)
    // Spread over the last 90 days, weighted toward recent weeks
    const daysAgo = Math.floor(Math.pow(Math.random(), 1.6) * 90)
    const at = new Date(Date.now() - daysAgo * 864e5 - Math.floor(Math.random() * 864e5))
    const atIso = at.toISOString()
    const [country, provinces] = pick(COUNTRIES)

    const leadId = await insertReturningId(
      `INSERT INTO leads (name, email, phone, company, message, source_page, form_type, extra, public_id, consent, consent_at, status, notes, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,1,$10,$11,$12,$10) RETURNING id`,
      [
        `${first} ${last}`, email,
        chance(0.5) ? `+1 ${Math.floor(Math.random() * 900) + 100} 555 ${String(Math.floor(Math.random() * 9000) + 1000)}` : null,
        company, pick(MESSAGES), landing, formType,
        JSON.stringify({
          demo: true, services, budget, timeline: pick(TIMELINES), referral,
          referralDetail: referral === 'referral' ? `${pick(FIRST)} ${pick(LAST)}` : undefined,
          companyUrl: hasCompany && chance(0.7) ? `https://www.${company!.toLowerCase().replace(/[^a-z]+/g, '')}.com` : undefined,
          companyCountry: hasCompany ? country : undefined,
          companyProvince: hasCompany ? pick(provinces) : undefined,
          companyRemote: hasCompany ? pick(['Yes', 'No', 'Hybrid']) : undefined,
        }),
        generateLeadPublicId(), atIso, pick(STATUSES), 'Demo record (generated for testing)',
      ]
    )

    const ck: Record<string, string | null> = { gclid: null, fbclid: null, li_fat_id: null, ttclid: null, msclkid: null }
    if (sc.clickId) ck[sc.clickId[0]] = `${sc.clickId[1]}${rnd()}${rnd()}`
    await run(
      `INSERT INTO leads_marketing (
        lead_id, ga_client_id, ga_session_id, session_id,
        gclid, fbclid, li_fat_id, ttclid, msclkid,
        first_source, first_medium, first_campaign, first_term, first_content, first_channel_group, first_touch_at,
        session_source, session_medium, session_campaign, session_term, session_content, session_channel_group,
        referrer_url, landing_page, user_agent, budget_min, budget_max, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)`,
      [
        leadId,
        `${Math.floor(Math.random() * 1e9)}.${Math.floor(at.getTime() / 1000)}`,
        String(Math.floor(at.getTime() / 1000)), rnd() + rnd(),
        ck.gclid, ck.fbclid, ck.li_fat_id, ck.ttclid, ck.msclkid,
        sc.source, sc.medium, sc.campaign?.() ?? null, sc.term?.() ?? null, sc.content?.() ?? null, sc.channel, atIso,
        sc.source, sc.medium, sc.campaign?.() ?? null, sc.term?.() ?? null, sc.content?.() ?? null, sc.channel,
        sc.referrer ?? null, landing,
        'Mozilla/5.0 (demo data)', range.min, range.max, atIso,
      ]
    )
    created++
  }

  await audit(auth.user.email, 'leads_seed_demo', `${created} demo leads`)
  return NextResponse.json({ ok: true, created })
}
