/**
 * Public-site pricing reader. Merges admin-managed DB values over the
 * hardcoded page content, with graceful fallback to built-in defaults
 * when the database is unavailable.
 */
import { PRICING_DEFAULTS, PackageDefault } from './admin/pricing-defaults'

export type PackageOverride = PackageDefault & { idx: number }

export async function getPackageOverrides(pageKey: string): Promise<PackageOverride[]> {
  try {
    const { ensureDb } = require('./admin/db') as typeof import('./admin/db')
    const { q } = require('./admin/pg') as typeof import('./admin/pg')
    await ensureDb()
    const rows = await q('SELECT * FROM packages WHERE page_key = $1 ORDER BY idx', [pageKey])
    if (!rows.length) throw new Error('empty')
    return rows.map((r: any) => ({
      idx: r.idx,
      name: r.name,
      price: r.price,
      priceNote: r.price_note ?? undefined,
      billing: r.billing ?? undefined,
      description: r.description ?? undefined,
      tag: r.tag ?? undefined,
      featured: !!r.featured,
      items: JSON.parse(r.items || '[]'),
      ctaLabel: r.cta_label ?? undefined,
    }))
  } catch {
    // DB unavailable - fall back to defaults so the public site never breaks
    return (PRICING_DEFAULTS[pageKey] ?? []).map((p, idx) => ({ ...p, idx }))
  }
}

/**
 * Merge DB-managed fields into an existing hardcoded cards array (by index),
 * preserving any JSX-only fields (like styled headings) from the original.
 */
export async function mergePackages<T extends Record<string, any>>(pageKey: string, cards: T[]): Promise<T[]> {
  const overrides = await getPackageOverrides(pageKey)
  if (!overrides.length) return cards
  return cards.map((card, i) => {
    const o = overrides.find((x) => x.idx === i)
    if (!o) return card
    return {
      ...card,
      name: o.name ?? card.name,
      price: o.price ?? card.price,
      priceNote: o.priceNote ?? card.priceNote,
      billing: o.billing ?? card.billing,
      desc: o.description ?? card.desc,
      tag: o.tag ?? card.tag,
      featured: o.featured,
      items: o.items && o.items.length ? o.items : card.items,
      ctaLabel: o.ctaLabel ?? card.ctaLabel,
    }
  })
}
