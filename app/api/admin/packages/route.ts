import { NextRequest, NextResponse } from 'next/server'
import { db, audit } from '@/lib/admin/db'
import { requireUser } from '@/lib/admin/auth'
import { PAGE_LABELS } from '@/lib/admin/pricing-defaults'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const rows = db().prepare('SELECT * FROM packages ORDER BY page_key, idx').all()
  return NextResponse.json({ packages: rows, pageLabels: PAGE_LABELS })
}

/** PUT — bulk save for one page: { pageKey, packages: [{idx, name, price, ...}] } */
export async function PUT(req: NextRequest) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const { pageKey, packages } = await req.json().catch(() => ({}))
  if (!pageKey || !Array.isArray(packages)) {
    return NextResponse.json({ error: 'pageKey and packages are required.' }, { status: 400 })
  }
  const upd = db().prepare(
    `UPDATE packages SET name = ?, price = ?, price_note = ?, billing = ?, description = ?,
     tag = ?, featured = ?, items = ?, cta_label = ?, updated_at = datetime('now')
     WHERE page_key = ? AND idx = ?`
  )
  const tx = db().transaction(() => {
    for (const p of packages) {
      upd.run(
        String(p.name ?? ''), String(p.price ?? ''), p.priceNote ?? null, p.billing ?? null,
        p.description ?? null, p.tag ?? null, p.featured ? 1 : 0,
        JSON.stringify(p.items ?? []), p.ctaLabel ?? null,
        pageKey, Number(p.idx)
      )
    }
  })
  tx()
  audit(auth.user.email, 'packages_update', pageKey)
  return NextResponse.json({ ok: true })
}
