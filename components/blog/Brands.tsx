/* eslint-disable @next/next/no-img-element */

/**
 * Platform marks shown alongside the tools an article covers.
 *
 * Two deliberate rules here:
 *
 * 1. We only display a company's actual logo when we hold the asset. Every
 *    entry in MARKS below is a file supplied to us, trimmed and scaled but
 *    never redrawn. Where we do not hold an official asset we render a
 *    typographic chip instead, because an approximated trademark is worse
 *    than no trademark. To upgrade a chip, drop the official file into
 *    /public/assets/brands and add one line to MARKS.
 *
 * 2. These are referential, identifying the product under discussion. They are
 *    intentionally small and inline, never presented as partner or endorsement
 *    badges, because we are not affiliated with any of them.
 */

export type BrandKey =
  | 'openai'
  | 'ga4'
  | 'gtm'
  | 'google'
  | 'google-ads'
  | 'search-console'
  | 'adobe'
  | 'tealium'
  | 'onetrust'
  | 'microsoft'
  | 'ms-teams'
  | 'outlook'

/**
 * ratio is width / height of the trimmed artwork. Marks are laid out at a
 * fixed height and their natural width, so nothing is ever squashed into a
 * square it was not drawn for: OneTrust is a wordmark and stays wide, the
 * GA bars stay narrow.
 */
type Mark = {
  src: string
  alt: string
  ratio: number
  /** True when the asset is a wordmark rather than an icon. Wordmarks are set
   *  slightly smaller so they do not tower over the icons beside them, and
   *  they suppress the text label, which would otherwise repeat the name. */
  wordmark?: boolean
}

const MARKS: Partial<Record<BrandKey, Mark>> = {
  openai: { src: '/assets/brands/openai-mark.png', alt: 'OpenAI', ratio: 1 },
  ga4: { src: '/assets/brands/ga4-mark.png', alt: 'Google Analytics', ratio: 111 / 128 },
  gtm: { src: '/assets/brands/gtm-mark.png', alt: 'Google Tag Manager', ratio: 1 },
  google: { src: '/assets/brands/google-mark.png', alt: 'Google', ratio: 125 / 128 },
  'google-ads': { src: '/assets/brands/google-ads-mark.png', alt: 'Google Ads', ratio: 140 / 128 },
  adobe: { src: '/assets/brands/adobe-mark.png', alt: 'Adobe', ratio: 146 / 128 },
  tealium: { src: '/assets/brands/tealium-mark.png', alt: 'Tealium', ratio: 81 / 128 },
  onetrust: { src: '/assets/brands/onetrust-mark.png', alt: 'OneTrust', ratio: 725 / 128, wordmark: true },
  microsoft: { src: '/assets/brands/microsoft-mark.png', alt: 'Microsoft', ratio: 122 / 128 },
  'ms-teams': { src: '/assets/brands/ms-teams-mark.png', alt: 'Microsoft Teams', ratio: 138 / 128 },
  outlook: { src: '/assets/brands/outlook-mark.png', alt: 'Microsoft Outlook', ratio: 137 / 128 },
}

/**
 * Fallback chips, for products where we hold no official asset. Google does
 * not publish a Search Console icon in its public logo list, so it stays a
 * colour-matched chip: recognisable, and honest about not being the mark.
 */
const CHIPS: Partial<Record<BrandKey, { text: string; color: string }>> = {
  'search-console': { text: 'GSC', color: '#4285F4' },
}

export function BrandMark({ k, size = 22 }: { k: BrandKey; size?: number }) {
  const mark = MARKS[k]
  if (mark) {
    const h = mark.wordmark ? Math.round(size * 0.72) : size
    const w = Math.round(h * mark.ratio)
    return (
      <img
        src={mark.src}
        alt={mark.alt}
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        style={{ width: w, height: h, objectFit: 'contain', flex: 'none' }}
      />
    )
  }
  const chip = CHIPS[k] ?? { text: k.slice(0, 3).toUpperCase(), color: '#4A4A55' }
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
          {MARKS[it.key]?.wordmark ? null : it.label}
        </span>
      ))}
    </div>
  )
}
