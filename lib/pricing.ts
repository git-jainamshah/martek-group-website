/**
 * Public-site pricing reader. Merges admin-managed DB values over the
 * hardcoded page content, so pages keep working even without a DB.
 */
import { PRICING_DEFAULTS, PackageDefault } from './admin/pricing-defaults'

export type PackageOverride = PackageDefault & { idx: number }

export function getPackageOverrides(pageKey: string): PackageOverride[] {
  try {
    const { db } = require('./admin/db') as typeof import('./admin/db')
    const rows = db()
      .prepare('SELECT * FROM packages WHERE page_key = ? ORDER BY idx')
      .all(pageKey) as any[]
    return rows.map((r) => ({
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
    // DB unavailable (e.g. read-only serverless) — fall back to defaults
    return (PRICING_DEFAULTS[pageKey] ?? []).map((p, idx) => ({ ...p, idx }))
  }
}

/**
 * Merge DB-managed fields into an existing hardcoded cards array (by index),
 * preserving any JSX-only fields (like styled headings) from the original.
 */
export function mergePackages<T extends Record<string, any>>(pageKey: string, cards: T[]): T[] {
  const overrides = getPackageOverrides(pageKey)
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
