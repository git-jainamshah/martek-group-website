import { NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, getSetting } from '@/lib/admin/db'
import { q } from '@/lib/admin/pg'
import {
  DEFAULT_FX, FxRates, toCAD, monthlyCAD, annualCAD, isActiveOn, nextRenewal, FREQ_PER_YEAR,
} from '@/lib/admin/finance'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Row = {
  id: number; expense_id: string; kind: string; category: string | null; vendor: string | null; tool_name: string | null
  description: string | null; amount: any; currency: string; frequency: string | null; start_date: string | null; expiry_date: string | null
  expense_date: string | null; billing_account_id: number | null; account_name?: string | null
  marketing_type?: string | null; marketing_platform?: string | null; created_by?: string | null
}

const ym = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
const bump = (m: Record<string, number>, k: string | null | undefined, v: number) => {
  const key = (k && String(k).trim()) || 'Uncategorised'
  m[key] = (m[key] || 0) + v
}
const toArr = (m: Record<string, number>) =>
  Object.entries(m).map(([label, value]) => ({ label, value: Math.round(value * 100) / 100 })).sort((a, b) => b.value - a.value)

export async function GET() {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const fx = (await getSetting<FxRates>('fx_rates')) || DEFAULT_FX
  const rows = (await q('SELECT * FROM expenses')) as Row[]
  const list = rows.map((r) => ({ ...r, amount: Number(r.amount) || 0 }))

  // email -> "First Last" for friendly "who logged spend" labels
  const userRows = (await q('SELECT email, first_name, last_name FROM users')) as { email: string; first_name: string; last_name: string }[]
  const nameByEmail = new Map<string, string>()
  for (const u of userRows) nameByEmail.set(String(u.email).toLowerCase(), `${u.first_name || ''} ${u.last_name || ''}`.trim())
  const personLabel = (email: string | null | undefined) => {
    if (!email) return 'Unknown'
    return nameByEmail.get(String(email).toLowerCase()) || String(email).split('@')[0]
  }

  const now = new Date()
  const thisMonth = ym(now)
  const yearStart = new Date(now.getFullYear(), 0, 1)

  const recurring = list.filter((e) => e.kind === 'recurring')
  const oneoff = list.filter((e) => e.kind === 'one_off')
  const activeRecurring = recurring.filter((e) => isActiveOn(e, now))

  // KPIs
  const monthlyRunRate = activeRecurring.reduce((s, e) => s + monthlyCAD(e, fx), 0)
  const annualRunRate = activeRecurring.reduce((s, e) => s + annualCAD(e, fx), 0)
  const oneOffYTD = oneoff
    .filter((e) => e.expense_date && new Date(e.expense_date) >= yearStart)
    .reduce((s, e) => s + toCAD(e.amount, e.currency, fx), 0)
  const oneOffThisMonth = oneoff
    .filter((e) => e.expense_date && ym(new Date(e.expense_date)) === thisMonth)
    .reduce((s, e) => s + toCAD(e.amount, e.currency, fx), 0)
  const spendThisMonth = monthlyRunRate + oneOffThisMonth

  // 12-month series (recurring monthly-equivalent active that month + one-off dated in month)
  const series12: { month: string; recurring: number; oneoff: number; total: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 15)
    const key = ym(d)
    const rec = recurring.filter((e) => isActiveOn(e, d)).reduce((s, e) => s + monthlyCAD(e, fx), 0)
    const off = oneoff.filter((e) => e.expense_date && ym(new Date(e.expense_date)) === key).reduce((s, e) => s + toCAD(e.amount, e.currency, fx), 0)
    series12.push({ month: key, recurring: Math.round(rec * 100) / 100, oneoff: Math.round(off * 100) / 100, total: Math.round((rec + off) * 100) / 100 })
  }

  // breakdowns
  const recByCategory: Record<string, number> = {}
  const byTool: Record<string, number> = {}
  const byAccount: Record<string, number> = {}
  const byFreqCount: Record<string, number> = {}
  const byFreqAmt: Record<string, number> = {}
  for (const e of activeRecurring) {
    const m = monthlyCAD(e, fx)
    bump(recByCategory, e.category, m)
    bump(byTool, e.tool_name || e.vendor, m)
    bump(byAccount, e.account_name, m)
    bump(byFreqCount, e.frequency, 1)
    bump(byFreqAmt, e.frequency, m)
  }
  const offByCategory: Record<string, number> = {}
  for (const e of oneoff.filter((e) => e.expense_date && new Date(e.expense_date) >= yearStart)) {
    bump(offByCategory, e.category, toCAD(e.amount, e.currency, fx))
    bump(byAccount, e.account_name, toCAD(e.amount, e.currency, fx) / 12) // amortise one-off into the account run-rate view
  }

  // currency mix (original amounts, monthly-equiv for recurring + YTD one-off)
  const byCurrency: Record<string, number> = {}
  for (const e of activeRecurring) byCurrency[e.currency] = (byCurrency[e.currency] || 0) + (e.amount * (FREQ_PER_YEAR[e.frequency || 'monthly'] ?? 12)) / 12
  for (const e of oneoff.filter((e) => e.expense_date && new Date(e.expense_date) >= yearStart)) byCurrency[e.currency] = (byCurrency[e.currency] || 0) + e.amount

  // marketing breakdowns + who logged spend (recurring run-rate + one-off YTD, CAD)
  const mktByType: Record<string, number> = {}
  const mktByPlatform: Record<string, number> = {}
  const byPerson: Record<string, number> = {}
  const contrib = (e: typeof list[number]) =>
    e.kind === 'recurring'
      ? (isActiveOn(e, now) ? monthlyCAD(e, fx) : 0)
      : (e.expense_date && new Date(e.expense_date) >= yearStart ? toCAD(e.amount, e.currency, fx) : 0)
  let marketingTotal = 0
  for (const e of list) {
    const c = contrib(e)
    if (c > 0) bump(byPerson, personLabel(e.created_by), c)
    if (e.category === 'Marketing / Ads' && c > 0) {
      marketingTotal += c
      bump(mktByType, e.marketing_type, c)
      bump(mktByPlatform, e.marketing_platform, c)
    }
  }

  // upcoming renewals (next 60 days)
  const soon = new Date(now.getTime() + 60 * 864e5)
  const upcoming = activeRecurring
    .map((e) => ({ e, next: nextRenewal(e.start_date, e.frequency, e.expiry_date) }))
    .filter((x) => x.next && new Date(x.next) <= soon)
    .sort((a, b) => (a.next! < b.next! ? -1 : 1))
    .slice(0, 15)
    .map((x) => ({
      expense_id: x.e.expense_id,
      name: x.e.tool_name || x.e.vendor || x.e.description || 'Recurring',
      date: x.next,
      amount_cad: Math.round(toCAD(x.e.amount, x.e.currency, fx) * 100) / 100,
      amount_original: x.e.amount, currency: x.e.currency, frequency: x.e.frequency,
    }))

  return NextResponse.json({
    fx,
    kpis: {
      monthlyRunRate: Math.round(monthlyRunRate * 100) / 100,
      annualRunRate: Math.round(annualRunRate * 100) / 100,
      activeSubscriptions: activeRecurring.length,
      oneOffYTD: Math.round(oneOffYTD * 100) / 100,
      spendThisMonth: Math.round(spendThisMonth * 100) / 100,
      totalExpenses: list.length,
    },
    series12,
    recByCategory: toArr(recByCategory),
    offByCategory: toArr(offByCategory),
    byTool: toArr(byTool),
    byAccount: toArr(byAccount),
    byCurrency: Object.entries(byCurrency).map(([label, value]) => ({ label, value: Math.round(value * 100) / 100 })),
    byFrequency: Object.keys(byFreqCount).map((f) => ({ label: f, count: byFreqCount[f], monthly: Math.round(byFreqAmt[f] * 100) / 100 })),
    marketingTotal: Math.round(marketingTotal * 100) / 100,
    marketingByType: toArr(mktByType),
    marketingByPlatform: toArr(mktByPlatform),
    byPerson: toArr(byPerson),
    upcoming,
  })
}
