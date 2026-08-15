/* eslint-disable @next/next/no-img-element */

/**
 * Platform marks shown alongside the tools an article covers.
 *
 * Two deliberate rules here:
 *
 * 1. We only display a company's actual logo when we hold the asset. The OpenAI
 *    mark is a supplied file. For Google products we do NOT draw an approximate
 *    Google logo from memory: a wrong-looking trademark is worse than none, so
 *    those render as a typographic chip instead. Drop an official SVG into
 *    /public/assets/brands and add it to MARKS to upgrade any of them.
 *
 * 2. These are referential, identifying the product under discussion. They are
 *    intentionally small and inline, never presented as partner or endorsement
 *    badges, because we are not affiliated with any of them.
 */

type BrandKey = 'openai' | 'ga4' | 'gtm' | 'google-ads' | 'search-console'

const MARKS: Partial<Record<BrandKey, { src: string; alt: string }>> = {
  openai: { src: '/assets/brands/openai-mark.png', alt: 'OpenAI' },
}

/**
 * Fallback chips, used where we do not hold an official asset.
 *
 * Google does not publish Analytics or Tag Manager icons in its public
 * logo list, and the rest of its brand assets sit behind Partner Marketing
 * Hub approval. The "free logo download" sites are neither official nor
 * reliably accurate, so these are colour-matched typographic chips instead:
 * recognisable at a glance, and honest about not being the real mark.
 */
const CHIPS: Record<BrandKey, { text: string; color: string }> = {
  openai: { text: 'AI', color: '#1A1A1E' },
  ga4: { text: 'GA4', color: '#E37400' },
  gtm: { text: 'GTM', color: '#246FDB' },
  'google-ads': { text: 'Ads', color: '#3C8BD9' },
  'search-console': { text: 'GSC', color: '#4285F4' },
}

export function BrandMark({ k, size = 22 }: { k: BrandKey; size?: number }) {
  const mark = MARKS[k]
  if (mark) {
    return (
      <img
        src={mark.src}
        alt={mark.alt}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain', flex: 'none' }}
      />
    )
  }
  const chip = CHIPS[k]
  return (
    <span
      aria-hidden
      style={{
        height: size, minWidth: size, padding: '0 7px', borderRadius: 6,
        border: `1.5px solid ${chip.color}`, background: chip.color,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--mono)', fontSize: size * 0.42, fontWeight: 700,
        color: '#fff', flex: 'none', letterSpacing: '0.02em',
      }}
    >{chip.text}</span>
  )
}

export function BrandRow({ items }: { items: { key: BrandKey; label: string }[] }) {
  return (
    <div className="bp-brands">
      {items.map((it) => (
        <span className="bp-brand" key={it.key}>
          <BrandMark k={it.key} />
          {it.label}
        </span>
      ))}
    </div>
  )
}
