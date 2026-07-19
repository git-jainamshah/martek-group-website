import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, run } from '@/lib/admin/pg'
import { requireUser, requireEditor } from '@/lib/admin/auth'
import { PAGE_LABELS } from '@/lib/admin/pricing-defaults'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()
  const rows = await q('SELECT * FROM packages ORDER BY page_key, idx')
  return NextResponse.json({ packages: rows, pageLabels: PAGE_LABELS })
}

/** PUT - bulk save for one page: { pageKey, packages: [{idx, name, price, ...}] } */
export async function PUT(req: NextRequest) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error
  const { pageKey, packages } = await req.json().catch(() => ({}))
  if (!pageKey || !Array.isArray(packages)) {
    return NextResponse.json({ error: 'pageKey and packages are required.' }, { status: 400 })
  }
  for (const p of packages) {
    await run(
      `UPDATE packages SET name = $1, price = $2, price_note = $3, billing = $4, description = $5,
       tag = $6, featured = $7, items = $8, cta_label = $9, updated_at = now()
       WHERE page_key = $10 AND idx = $11`,
      [String(p.name ?? ''), String(p.price ?? ''), p.priceNote ?? null, p.billing ?? null,
       p.description ?? null, p.tag ?? null, p.featured ? 1 : 0,
       JSON.stringify(p.items ?? []), p.ctaLabel ?? null,
       pageKey, Number(p.idx)]
    )
  }
  await audit(auth.user.email, 'packages_update', pageKey)
  return NextResponse.json({ ok: true })
}
