import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// naive rate limit: 20 submissions / hour / IP
const hits = new Map<string, { n: number; ts: number }>()

/** Public endpoint — every site form posts here. Leads are stored permanently. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'local'
  const h = hits.get(ip)
  if (h && h.n > 20 && Date.now() - h.ts < 3600_000) {
    return NextResponse.json({ error: 'Too many submissions.' }, { status: 429 })
  }
  hits.set(ip, { n: (h && Date.now() - h.ts < 3600_000 ? h.n : 0) + 1, ts: h && Date.now() - h.ts < 3600_000 ? h.ts : Date.now() })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })

  // Honeypot: bots fill the hidden "website" field — pretend success, store nothing
  if (body.website) return NextResponse.json({ ok: true })

  const email = String(body.email ?? '').trim().slice(0, 200)
  const name = String(body.name ?? '').trim().slice(0, 200)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  try {
    const { ensureDb } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const { run } = require('@/lib/admin/pg') as typeof import('@/lib/admin/pg')
    await ensureDb()
    await run(
      `INSERT INTO leads (name, email, phone, company, message, source_page, form_type, package_interest, extra)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        name || null,
        email,
        String(body.phone ?? '').slice(0, 50) || null,
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
        }),
      ]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('lead store failed', e)
    return NextResponse.json({ error: 'Could not save your message — please email us directly.' }, { status: 500 })
  }
}
