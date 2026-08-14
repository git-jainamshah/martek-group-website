import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit, generateLeadPublicId } from '@/lib/admin/db'
import { run, insertReturningId } from '@/lib/admin/pg'
import { requireLeadsEditor } from '@/lib/admin/auth'
import { budgetToRange } from '@/lib/admin/leads'
import { COUNTRIES } from '@/lib/locations'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Offline Leads + Pitches.
 * POST { lead: {...} }          - add one lead (form entry)
 * POST { csv: "..." }           - batch import; the CSV text is parsed in
 *                                 memory and never written to disk or stored.
 * GET  ?download=framework      - the CSV rules document
 * GET  ?download=sample         - a ready-to-edit sample CSV
 */

const CSV_HEADER = 'lead_type,name,email,phone,company,company_website,company_country,company_province,company_remote,contact_method,contact_date,services,budget,timeline,status,message,notes'

const KINDS = ['offline', 'pitch']
const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost']
const SERVICE_ALIASES: Record<string, string> = {
  web: 'web', 'web development': 'web', website: 'web',
  data: 'data', 'data & analytics': 'data', analytics: 'data',
  social: 'social', 'social media': 'social',
  seo: 'seo', 'seo & ads': 'seo', ads: 'seo', 'paid ads': 'seo',
  engineering: 'engineering', cad: 'engineering', 'engineering & cad': 'engineering',
}
const BUDGET_ALIASES: Record<string, string> = {
  '<5k': '<5k', 'under 5k': '<5k', '0-5k': '<5k',
  '5-10k': '5-10k', '5k-10k': '5-10k',
  '10-25k': '10-25k', '10k-25k': '10-25k',
  '25k+': '25k+', 'over 25k': '25k+', '25k plus': '25k+',
}
const METHODS = ['Phone Call', 'Email', 'Walk-in', 'Text / WhatsApp', 'Event / Networking', 'Video Call', 'Cold Email', 'Cold Call', 'LinkedIn Outreach', 'Proposal / RFP', 'Other']

// ---- normalization (human-entered data) ----
const clean = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim()
const smartTitle = (s: string) =>
  // Re-case each word that is all-lower or ALL-UPPER; preserve "McDonald" etc.
  s.split(' ').map((w) =>
    w === w.toLowerCase() || w === w.toUpperCase()
      ? w.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
      : w
  ).join(' ')
function normServices(raw: string): string[] {
  const out = new Set<string>()
  for (const part of raw.split(/[;|,]/)) {
    const key = clean(part).toLowerCase()
    if (SERVICE_ALIASES[key]) out.add(SERVICE_ALIASES[key])
  }
  return [...out]
}
function normDate(raw: string): Date | null {
  const s = clean(raw)
  if (!s) return new Date()
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? s + 'T12:00:00Z' : s)
  return isNaN(d.getTime()) ? null : d
}

// ---- tiny CSV parser with quote support ----
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = [], cell = '', inQ = false
  const src = text.replace(/\r\n?/g, '\n')
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (inQ) {
      if (ch === '"') { if (src[i + 1] === '"') { cell += '"'; i++ } else inQ = false }
      else cell += ch
    } else if (ch === '"') inQ = true
    else if (ch === ',') { row.push(cell); cell = '' }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = '' }
    else cell += ch
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row) }
  return rows.filter((r) => r.some((c) => clean(c) !== ''))
}

const REMOTE_MAP: Record<string, string> = { yes: 'Yes', no: 'No', hybrid: 'Hybrid' }
function normCountry(raw: string): string {
  const s = clean(raw)
  if (!s) return ''
  return COUNTRIES.find((c) => c.toLowerCase() === s.toLowerCase()) || smartTitle(s)
}

type LeadInput = {
  kind: string; name: string; email: string; phone: string; company: string
  companyUrl?: string; companyCountry?: string; companyProvince?: string; companyRemote?: string
  contactMethod: string; contactDate: string; services: string[] | string
  budget: string; timeline: string; status: string; message: string; notes: string
}

function validate(d: LeadInput): { ok: true; v: any } | { ok: false; error: string } {
  const kind = clean(d.kind).toLowerCase() || 'offline'
  if (!KINDS.includes(kind)) return { ok: false, error: `lead_type must be "offline" or "pitch" (got "${d.kind}")` }
  const name = smartTitle(clean(d.name))
  const email = clean(d.email).toLowerCase()
  const phone = clean(d.phone)
  if (!name) return { ok: false, error: 'name is required' }
  if (!email) return { ok: false, error: 'email is required' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: `invalid email "${email}"` }
  if (!phone) return { ok: false, error: 'phone is required' }
  if ((phone.match(/\d/g) ?? []).length < 7) return { ok: false, error: `phone "${d.phone}" needs at least 7 digits` }
  const date = normDate(d.contactDate)
  if (!date) return { ok: false, error: `contact_date "${d.contactDate}" not understood (use YYYY-MM-DD)` }
  const status = clean(d.status).toLowerCase() || 'new'
  if (!STATUSES.includes(status)) return { ok: false, error: `status must be one of ${STATUSES.join(', ')}` }
  const budgetRaw = clean(d.budget).toLowerCase().replace(/\$|,|\s+to\s+/g, '')
  const budget = budgetRaw ? BUDGET_ALIASES[budgetRaw] ?? BUDGET_ALIASES[clean(d.budget).toLowerCase()] : ''
  if (budgetRaw && !budget) return { ok: false, error: `budget "${d.budget}" not recognized (use <5k, 5-10k, 10-25k, 25k+)` }
  const services = Array.isArray(d.services) ? d.services : normServices(String(d.services ?? ''))
  const methodClean = clean(d.contactMethod)
  const contactMethod = METHODS.find((m) => m.toLowerCase() === methodClean.toLowerCase()) || smartTitle(methodClean) || (kind === 'pitch' ? 'Cold Email' : 'Phone Call')
  const remoteRaw = clean(d.companyRemote).toLowerCase()
  if (remoteRaw && !REMOTE_MAP[remoteRaw]) return { ok: false, error: `company_remote "${d.companyRemote}" must be Yes, No, or Hybrid` }
  return {
    ok: true,
    v: {
      kind, name, email: email || null, phone: phone || null,
      company: smartTitle(clean(d.company)) || null, contactMethod,
      companyUrl: clean(d.companyUrl) || null,
      companyCountry: normCountry(String(d.companyCountry ?? '')) || null,
      companyProvince: smartTitle(clean(d.companyProvince)) || null,
      companyRemote: remoteRaw ? REMOTE_MAP[remoteRaw] : null,
      date, services, budget: budget || null, timeline: clean(d.timeline) || null,
      status, message: clean(d.message) || null, notes: clean(d.notes) || null,
    },
  }
}

async function insertLead(v: any, addedBy: string) {
  const atIso = v.date.toISOString()
  const range = budgetToRange(v.budget ?? '')
  const leadId = await insertReturningId(
    `INSERT INTO leads (name, email, phone, company, message, source_page, form_type, extra, public_id, consent, consent_at, status, notes, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,1,$10,$11,$12,$10) RETURNING id`,
    [
      v.name, v.email, v.phone, v.company, v.message, null, v.kind,
      JSON.stringify({
        services: v.services.length ? v.services : undefined, budget: v.budget ?? undefined, timeline: v.timeline ?? undefined,
        companyUrl: v.companyUrl ?? undefined, companyCountry: v.companyCountry ?? undefined,
        companyProvince: v.companyProvince ?? undefined, companyRemote: v.companyRemote ?? undefined,
      }),
      generateLeadPublicId(), atIso, v.status, v.notes,
    ]
  )
  const source = v.contactMethod.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const channel = v.kind === 'pitch' ? 'Pitch' : 'Offline'
  // first_touch_at is TEXT but created_at is TIMESTAMPTZ. Reusing one $5 for
  // both made Postgres reject the statement with 42P08 ("inconsistent types
  // deduced for parameter $5"), which failed AFTER the leads row was already
  // inserted - so the lead saved but the request 500'd. They need separate
  // placeholders so each parameter has exactly one inferred type.
  await run(
    `INSERT INTO leads_marketing (
      lead_id, first_source, first_medium, first_channel_group, first_touch_at,
      session_source, session_medium, session_channel_group,
      budget_min, budget_max, created_at
    ) VALUES ($1,$2,$3,$4,$5,$2,$3,$4,$6,$7,$8)`,
    [leadId, source, v.kind, channel, atIso, range.min, range.max, atIso]
  )
  await run(
    `INSERT INTO leads_offline (lead_id, lead_kind, contact_method, added_by, created_at) VALUES ($1,$2,$3,$4,$5)`,
    [leadId, v.kind, v.contactMethod, addedBy, atIso]
  )
  return leadId
}

const FRAMEWORK = `MARTEK OFFLINE LEADS - CSV FRAMEWORK
=====================================

Header row (required, exactly these columns, in this order):
${CSV_HEADER}

Rules per column
----------------
lead_type        "offline" or "pitch". Blank = offline.
name             Required. The person's full name.
email            Required. Must look like an email.
phone            Required. At least 7 digits.
company          Optional.
company_website  Optional. e.g. https://company.com
company_country  Optional. Full country name, e.g. Canada, United States.
company_province Optional. Province or state, e.g. Ontario, California.
company_remote   Optional. One of: Yes, No, Hybrid.
contact_method  How they reached us / how we reached them. Suggested values:
                ${METHODS.join(', ')}.
                Anything else is accepted and stored as typed.
contact_date    YYYY-MM-DD (e.g. 2026-07-15). Blank = today.
services        Any of: web, data, social, seo, engineering.
                Separate multiple with a semicolon: web;seo
                Full names also work (e.g. "Web Development; SEO & Ads").
budget          One of: <5k, 5-10k, 10-25k, 25k+  (blank allowed)
timeline        Free text, e.g. "ASAP", "1-2 months". (blank allowed)
status          new, contacted, qualified, won, lost. Blank = new.
message         What the conversation was about. Use "quotes" if it contains commas.
notes           Internal notes. Same quoting rule.

Good to know
------------
- Values are cleaned automatically: extra spaces are trimmed, emails are
  lowercased, and ALL-CAPS or all-lowercase names are re-cased.
- Rows that fail validation are skipped and reported with the reason;
  valid rows still import.
- The uploaded file is parsed in memory only - it is never stored.
`

const SAMPLE = `${CSV_HEADER}
offline,Jane Miller,jane.miller@example.com,+1 416 555 0192,Miller Renovations,https://millerreno.com,Canada,Ontario,Hybrid,Phone Call,2026-07-12,web;seo,10-25k,1-2 months,new,"Called about a new website, wants a quote before September.",Spoke with Jainam - send proposal
offline,RAKESH SHARMA,rakesh@example.com,+1 647 555 0114,,,Canada,Ontario,No,Walk-in,2026-07-15,engineering,<5k,ASAP,contacted,"Needs CAD drawings for a basement permit.",
offline,Dan Reeves,dan@northpeak.example.com,+1 212 555 0177,Northpeak Fitness,https://northpeak.example.com,United States,California,Yes,Email,2026-07-16,social;seo,5-10k,3-6 months,qualified,"Emailed asking about ongoing social + ads.",Follow up Friday
`

export async function GET(req: NextRequest) {
  const auth = await requireLeadsEditor()
  if ('error' in auth) return auth.error
  const dl = req.nextUrl.searchParams.get('download')
  if (dl === 'framework') {
    return new NextResponse(FRAMEWORK, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': 'attachment; filename="offline-leads-framework.txt"' },
    })
  }
  if (dl === 'sample') {
    return new NextResponse(SAMPLE, {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="offline-leads-sample.csv"' },
    })
  }
  return NextResponse.json({ header: CSV_HEADER })
}

export async function POST(req: NextRequest) {
  const auth = await requireLeadsEditor()
  if ('error' in auth) return auth.error
  await ensureDb()
  const addedBy = `${auth.user.first_name} ${auth.user.last_name}`
  const body = await req.json().catch(() => ({}))

  // ---- single lead (form) ----
  if (body.lead) {
    const res = validate(body.lead)
    if (!res.ok) return NextResponse.json({ error: res.error }, { status: 400 })
    const id = await insertLead(res.v, addedBy)
    await audit(auth.user.email, 'lead_add_' + res.v.kind, `${res.v.name} (#${id})`)
    return NextResponse.json({ ok: true, id })
  }

  // ---- batch CSV (parsed in memory; never stored) ----
  if (typeof body.csv === 'string') {
    const rows = parseCsv(body.csv)
    if (!rows.length) return NextResponse.json({ error: 'The file appears to be empty.' }, { status: 400 })
    const expected = CSV_HEADER.split(',')
    const header = rows[0].map((h) => clean(h).toLowerCase())
    if (header.join(',') !== CSV_HEADER) {
      return NextResponse.json({
        error: `Header row does not match the framework. Expected: ${CSV_HEADER}`,
      }, { status: 400 })
    }
    if (rows.length > 501) return NextResponse.json({ error: 'Maximum 500 rows per upload.' }, { status: 400 })

    let added = 0
    const skipped: { row: number; reason: string }[] = []
    for (let i = 1; i < rows.length; i++) {
      const c = rows[i]
      const get = (name: string) => c[expected.indexOf(name)] ?? ''
      const res = validate({
        kind: get('lead_type'), name: get('name'), email: get('email'), phone: get('phone'),
        company: get('company'), companyUrl: get('company_website'), companyCountry: get('company_country'),
        companyProvince: get('company_province'), companyRemote: get('company_remote'),
        contactMethod: get('contact_method'), contactDate: get('contact_date'),
        services: get('services'), budget: get('budget'), timeline: get('timeline'),
        status: get('status'), message: get('message'), notes: get('notes'),
      })
      if (!res.ok) { skipped.push({ row: i + 1, reason: res.error }); continue }
      try { await insertLead(res.v, addedBy); added++ }
      catch (e: any) { skipped.push({ row: i + 1, reason: e?.message || 'database error' }) }
    }
    await audit(auth.user.email, 'leads_batch_import', `${added} added, ${skipped.length} skipped`)
    return NextResponse.json({ ok: true, added, skipped })
  }

  return NextResponse.json({ error: 'Nothing to import.' }, { status: 400 })
}
