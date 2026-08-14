import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { budgetToRange } from '@/lib/admin/leads'

// naive rate limit: 20 submissions / hour / IP
const hits = new Map<string, { n: number; ts: number }>()

/**
 * Public endpoint - every site form posts here.
 * Writes the lead to `leads` (simple) AND `leads_marketing` (attribution snapshot).
 * Traffic data comes from analytics/traffic-identification.js on the client.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local'
  const h = hits.get(ip)
  if (h && h.n > 20 && Date.now() - h.ts < 3600_000) {
    return NextResponse.json({ error: 'Too many submissions.' }, { status: 429 })
  }
  hits.set(ip, { n: (h && Date.now() - h.ts < 3600_000 ? h.n : 0) + 1, ts: h && Date.now() - h.ts < 3600_000 ? h.ts : Date.now() })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })

  // Honeypot: bots fill the hidden "website" field - pretend success, store nothing
  if (body.website) return NextResponse.json({ ok: true })

  const email = String(body.email ?? '').trim().slice(0, 200)
  const name = String(body.name ?? '').trim().slice(0, 200)
  const phone = String(body.phone ?? '').trim().slice(0, 50)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }
  if (!phone || (phone.match(/\d/g) ?? []).length < 7) {
    return NextResponse.json({ error: 'A valid phone number is required.' }, { status: 400 })
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: 'Please consent to sharing your details to continue.' }, { status: 400 })
  }

  try {
    const { ensureDb, generateLeadPublicId } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const { run, insertReturningId } = require('@/lib/admin/pg') as typeof import('@/lib/admin/pg')
    await ensureDb()

    const publicId = generateLeadPublicId()

    /* Auto-assign to the configured default owner so a new enquiry always has
       someone's name on it. Unset (or pointing at a deactivated user) leaves
       the lead unassigned rather than guessing - it then shows up in the
       pipeline's Unassigned count, which is the visible, fixable state. */
    let ownerId: number | null = null
    try {
      const { getSetting } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
      const { DEFAULT_OWNER_KEY } = require('@/lib/admin/pipeline') as typeof import('@/lib/admin/pipeline')
      const { q1 } = require('@/lib/admin/pg') as typeof import('@/lib/admin/pg')
      const configured = await getSetting<number>(DEFAULT_OWNER_KEY)
      if (configured) {
        const owner = await q1<{ id: number }>('SELECT id FROM users WHERE id = $1 AND active = 1', [configured])
        ownerId = owner?.id ?? null
      }
    } catch { /* assignment must never block capturing the lead */ }

    const leadId = await insertReturningId(
      `INSERT INTO leads (name, email, phone, company, message, source_page, form_type, package_interest, extra, public_id, consent, consent_at, owner_user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,1,now(),$11) RETURNING id`,
      [
        name || null,
        email,
        phone || null,
        String(body.company ?? '').slice(0, 200) || null,
        String(body.message ?? '').slice(0, 5000) || null,
        String(body.sourcePage ?? '').slice(0, 300) || null,
        ['contact', 'promo-banner', 'other'].includes(body.formType) ? body.formType : 'other',
        String(body.packageInterest ?? '').slice(0, 200) || null,
        JSON.stringify({
          services: body.services ?? undefined,
          budget: body.budget ?? undefined,
          timeline: body.timeline ?? undefined,
          referral: body.referral ?? undefined,
          referralDetail: String(body.referralDetail ?? '').slice(0, 200) || undefined,
          companyUrl: String(body.companyUrl ?? '').slice(0, 300) || undefined,
          companyCountry: String(body.companyCountry ?? '').slice(0, 100) || undefined,
          companyProvince: String(body.companyProvince ?? '').slice(0, 100) || undefined,
          companyRemote: ['Yes', 'No', 'Hybrid'].includes(body.companyRemote) ? body.companyRemote : undefined,
        }),
        publicId,
        ownerId,
      ]
    )

    // ---- marketing snapshot (never blocks the lead itself) ----
    try {
      const t = body.traffic ?? {}
      const c = t.clickIds ?? {}
      const s = (v: unknown, n = 300) => (v ? String(v).slice(0, n) : null)
      const budget = budgetToRange(String(body.budget ?? ''))

      // Every lead gets acquisition data. If the browser sent nothing
      // (JS blocked, etc.) the visit is treated as true Direct.
      t.firstSource = t.firstSource || '(direct)'
      t.firstMedium = t.firstMedium || '(none)'
      t.firstChannelGroup = t.firstChannelGroup || 'Direct'
      t.sessionSource = t.sessionSource || t.firstSource
      t.sessionMedium = t.sessionMedium || t.firstMedium
      t.sessionChannelGroup = t.sessionChannelGroup || t.firstChannelGroup
      await run(
        `INSERT INTO leads_marketing (
          lead_id, ga_client_id, ga_session_id, session_id,
          gclid, gbraid, wbraid, fbclid, li_fat_id, ttclid, epik, msclkid, dclid, twclid, sclid, irclickid,
          other_click_ids,
          first_source, first_medium, first_campaign, first_term, first_content, first_channel_group, first_touch_at,
          session_source, session_medium, session_campaign, session_term, session_content, session_channel_group,
          referrer_url, landing_page, user_agent, budget_min, budget_max
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35)`,
        [
          leadId, s(t.gaClientId, 100), s(t.gaSessionId, 100), s(t.sessionId, 100),
          s(c.gclid), s(c.gbraid), s(c.wbraid), s(c.fbclid), s(c.li_fat_id), s(c.ttclid),
          s(c.epik), s(c.msclkid), s(c.dclid), s(c.twclid), s(c.sclid), s(c.irclickid),
          t.otherClickIds && Object.keys(t.otherClickIds).length ? JSON.stringify(t.otherClickIds).slice(0, 2000) : null,
          s(t.firstSource, 150), s(t.firstMedium, 150), s(t.firstCampaign, 200), s(t.firstTerm, 200), s(t.firstContent, 200), s(t.firstChannelGroup, 50), s(t.firstTouchAt, 40),
          s(t.sessionSource, 150), s(t.sessionMedium, 150), s(t.sessionCampaign, 200), s(t.sessionTerm, 200), s(t.sessionContent, 200), s(t.sessionChannelGroup, 50),
          s(t.referrerUrl, 500), s(t.landingPage, 500), s(t.userAgent, 400),
          budget.min, budget.max,
        ]
      )
    } catch (e) {
      console.error('marketing snapshot failed (lead saved)', e)
    }

    // Return the DB-generated public lead id so the client can stamp it onto
    // the generate_lead / purchase dataLayer events (lead_id + transaction_id).
    return NextResponse.json({ ok: true, leadId: publicId })
  } catch (e) {
    console.error('lead store failed', e)
    return NextResponse.json({ error: 'Could not save your message - please email us directly.' }, { status: 500 })
  }
}
