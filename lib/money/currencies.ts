/**
 * Currencies offered by the price switcher.
 *
 * Deliberately short. Every extra option is another row in a dropdown that
 * most readers will never open, and the point is to cover where our readers
 * actually are rather than to be exhaustive.
 *
 * CAD is the base: all prices in the posts are authored in Canadian dollars
 * because that is where we are and who we quote.
 */

export const BASE = 'CAD'

export type CurrencyCode =
  | 'CAD' | 'USD' | 'EUR' | 'AUD' | 'NZD'
  | 'AED' | 'SAR' | 'INR' | 'CNY' | 'HKD'

export type Currency = {
  code: CurrencyCode
  /** Shown in the switcher. */
  label: string
  /** Overrides Intl when its default is ambiguous or ugly. */
  symbol?: string
}

export const CURRENCIES: Currency[] = [
  { code: 'CAD', label: 'Canadian dollar' },
  { code: 'USD', label: 'US dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'AUD', label: 'Australian dollar' },
  { code: 'NZD', label: 'New Zealand dollar' },
  { code: 'AED', label: 'UAE dirham' },
  { code: 'SAR', label: 'Saudi riyal' },
  { code: 'INR', label: 'Indian rupee' },
  { code: 'CNY', label: 'Chinese yuan' },
  { code: 'HKD', label: 'Hong Kong dollar' },
]

export const CODES = CURRENCIES.map((c) => c.code)

export type Rates = {
  /** Units of the target currency per 1 CAD. CAD is always exactly 1. */
  rates: Record<string, number>
  /** ISO date the rates were published. */
  date: string
  /** True when the live fetch failed and we fell back to the baked-in table. */
  stale: boolean
}

/**
 * Round to a number a human would actually write.
 *
 * Converting CA$5,000 gives 343,712 rupees, and printing that implies a
 * precision the original figure never had: the posts say "roughly" and
 * "indicative" throughout. Rounding to the magnitude of the number keeps the
 * converted figure as honest as the one it came from.
 */
export function roundNice(v: number): number {
  if (!isFinite(v) || v === 0) return 0
  const abs = Math.abs(v)
  const step =
    abs < 20 ? 1 :
    abs < 200 ? 5 :
    abs < 2_000 ? 50 :
    abs < 20_000 ? 500 :
    abs < 200_000 ? 1_000 : 10_000
  return Math.sign(v) * Math.round(abs / step) * step
}

/**
 * Format an amount already expressed in `code`.
 *
 * Intl renders CAD in an en-CA locale as a bare "$", which is precisely the
 * ambiguity this whole feature exists to remove: a reader in Sydney or Hong
 * Kong sees "$15" and has no idea whose dollar it is. Force the CA prefix.
 */
export function formatMoney(amount: number, code: CurrencyCode): string {
  try {
    const s = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: code,
      // Default display, NOT narrowSymbol: the default is what produces the
      // disambiguating US$, A$, NZ$, HK$ and CN¥ prefixes. narrowSymbol
      // collapses all of them to a bare "$", which is the exact problem.
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount)
    return code === 'CAD' && s.startsWith('$') ? `CA${s}` : s
  } catch {
    return `${code} ${Math.round(amount).toLocaleString('en-CA')}`
  }
}

/** Convert a CAD amount and format it, rounding unless it is the base. */
export function convertAndFormat(cad: number, code: CurrencyCode, rates: Record<string, number>): string {
  if (code === BASE) return formatMoney(cad, BASE)
  const rate = rates[code]
  if (!rate) return formatMoney(cad, BASE)
  return formatMoney(roundNice(cad * rate), code)
}
