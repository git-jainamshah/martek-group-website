import { NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, getSetting } from '@/lib/admin/db'
import { q, q1 } from '@/lib/admin/pg'
import { DEFAULT_FX, FxRates, toCAD } from '@/lib/admin/finance'
import { paymentState } from '@/lib/admin/billing'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ym = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
const round = (n: number) => Math.round(n * 100) / 100

export async function GET() {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const fx = (await getSetting<FxRates>('fx_rates')) || DEFAULT_FX
  const rows = (await q<any>(`SELECT i.*, c.name AS client_name FROM invoices i JOIN clients c ON c.id = i.client_id`)).map((r) => ({
    ...r, total: Number(r.total) || 0, amount_paid: Number(r.amount_paid) || 0,
  }))
  const live = rows.filter((r) => r.status !== 'void')

  const cad = (v: number, cur: string) => toCAD(v, cur, fx)
  let billed = 0, collected = 0, overdue = 0
  const byStatus: Record<string, { count: number; amount: number }> = {}
  const byClient: Record<string, { billed: number; collected: number; outstanding: number }> = {}
  const series: Record<string, { billed: number; collected: number }> = {}

  for (const r of live) {
    const tCAD = cad(r.total, r.currency)
    const pCAD = cad(r.amount_paid, r.currency)
    billed += tCAD; collected += pCAD
    const bal = Math.max(0, tCAD - pCAD)
    const st = paymentState(r)
    if (st === 'overdue') overdue += bal
    byStatus[st] = byStatus[st] || { count: 0, amount: 0 }
    byStatus[st].count += 1; byStatus[st].amount += tCAD
    const cn = r.client_name || 'Unknown'
    byClient[cn] = byClient[cn] || { billed: 0, collected: 0, outstanding: 0 }
    byClient[cn].billed += tCAD; byClient[cn].collected += pCAD; byClient[cn].outstanding += bal
    if (r.issue_date) {
      const key = ym(new Date(r.issue_date))
      series[key] = series[key] || { billed: 0, collected: 0 }
      series[key].billed += tCAD; series[key].collected += pCAD
    }
  }

  const now = new Date()
  const series12 = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    const key = ym(d)
    const s = series[key] || { billed: 0, collected: 0 }
    return { month: key, billed: round(s.billed), collected: round(s.collected) }
  })

  const clientCount = await q1<{ c: number }>('SELECT COUNT(*)::int AS c FROM clients')
  const projectCount = await q1<{ c: number }>('SELECT COUNT(*)::int AS c FROM client_projects')

  const recent = live
    .slice()
    .sort((a, b) => (a.issue_date < b.issue_date ? 1 : -1))
    .slice(0, 8)
    .map((r) => ({
      id: r.id, invoice_number: r.invoice_number, client_name: r.client_name,
      total: r.total, amount_paid: r.amount_paid, currency: r.currency,
      status: paymentState(r), issue_date: r.issue_date, due_date: r.due_date,
    }))

  return NextResponse.json({
    fx,
    kpis: {
      billed: round(billed), collected: round(collected), outstanding: round(Math.max(0, billed - collected)),
      overdue: round(overdue), invoices: live.length,
      clients: Number(clientCount?.c) || 0, projects: Number(projectCount?.c) || 0,
      collectionRate: billed > 0 ? Math.round((collected / billed) * 100) : 0,
    },
    series12,
    byStatus: Object.entries(byStatus).map(([label, v]) => ({ label, count: v.count, value: round(v.amount) })),
    byClient: Object.entries(byClient).map(([label, v]) => ({ label, billed: round(v.billed), collected: round(v.collected), outstanding: round(v.outstanding) })).sort((a, b) => b.billed - a.billed).slice(0, 10),
    recent,
  })
}
