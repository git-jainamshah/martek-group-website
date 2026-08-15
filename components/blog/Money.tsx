'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  BASE, CURRENCIES, convertAndFormat,
  type CurrencyCode, type Rates,
} from '@/lib/money/currencies'

/**
 * Client half of the price switcher.
 *
 * Rates arrive from the server already fetched, so choosing a currency is pure
 * arithmetic in the browser: no request, no spinner, no layout shift. The
 * choice is remembered so a reader who works in rupees does not have to pick
 * it again on every article.
 */

type Ctx = { code: CurrencyCode; setCode: (c: CurrencyCode) => void; rates: Rates }

const MoneyCtx = createContext<Ctx | null>(null)
const STORAGE_KEY = 'marrelay:currency'

export function MoneyProvider({ rates, children }: { rates: Rates; children: React.ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>(BASE as CurrencyCode)

  // Read the saved preference after mount. Doing this in useState's initialiser
  // would make the server and client render different text and trip hydration.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null
      if (saved && CURRENCIES.some((c) => c.code === saved)) setCode(saved)
    } catch { /* private mode, storage disabled: base currency is fine */ }
  }, [])

  const choose = (c: CurrencyCode) => {
    setCode(c)
    try { localStorage.setItem(STORAGE_KEY, c) } catch { /* not important enough to handle */ }
  }

  return <MoneyCtx.Provider value={{ code, setCode: choose, rates }}>{children}</MoneyCtx.Provider>
}

/** One price. Authored in CAD, displayed in whatever the reader picked. */
export function Money({ cad }: { cad: number }) {
  const ctx = useContext(MoneyCtx)
  if (!ctx) return <>{convertAndFormat(cad, BASE as CurrencyCode, { CAD: 1 })}</>
  const text = convertAndFormat(cad, ctx.code, ctx.rates.rates)
  // Converted figures are rounded approximations of an approximation, so the
  // title makes the original explicit for anyone who wants the authored number.
  return (
    <span className="bp-money" title={ctx.code === BASE ? undefined : `${convertAndFormat(cad, BASE as CurrencyCode, ctx.rates.rates)} converted`}>
      {text}
    </span>
  )
}

export function CurrencySwitcher() {
  const ctx = useContext(MoneyCtx)
  if (!ctx) return null
  const { code, setCode, rates } = ctx

  return (
    <div className="bp-fx">
      <label htmlFor="bp-fx-select">
        Prices in
      </label>
      <select
        id="bp-fx-select"
        value={code}
        onChange={(e) => setCode(e.target.value as CurrencyCode)}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>{c.code} · {c.label}</option>
        ))}
      </select>
      <span className="bp-fx-note">
        {code === BASE
          ? 'Written in Canadian dollars'
          : `Converted from CAD at ${rates.stale ? 'a recent' : 'the'} rate of ${rates.date}, rounded`}
      </span>
    </div>
  )
}
