'use client'

import { useEffect, useState } from 'react'
import { PieChart } from 'lucide-react'
import { StatCard } from '@/components/admin/charts'
import { fmtMoney, fmtMoneyShort, CURRENCIES } from '@/lib/admin/finance'
import { fmtDate } from '@/lib/admin/dates'

type Stats = {
  fx: { base: string; updatedAt?: string; rates: Record<string, number> }
  kpis: { monthlyRunRate: number; annualRunRate: number; activeSubscriptions: number; oneOffYTD: number; spendThisMonth: number; totalExpenses: number }
  series12: { month: string; recurring: number; oneoff: number; total: number }[]
  recByCategory: { label: string; value: number }[]
  offByCategory: { label: string; value: number }[]
  byTool: { label: string; value: number }[]
  byAccount: { label: string; value: number }[]
  byCurrency: { label: string; value: number }[]
  byFrequency: { label: string; count: number; monthly: number }[]
  marketingTotal: number
  marketingByType: { label: string; value: number }[]
  marketingByPlatform: { label: string; value: number }[]
  byPerson: { label: string; value: number }[]
  upcoming: { expense_id: string; name: string; date: string; amount_cad: number; amount_original: number; currency: string; frequency: string }[]
}

const PALETTE = ['#ED1C24', '#6B9080', '#8390C8', '#E07A5F', '#8B5A8C', '#F2CC8F', '#6E6A62', '#C8141B']

export default function FinanceDashboard() {
  const [s, setS] = useState<Stats | null>(null)
  const load = () => fetch('/api/admin/finance/stats').then((r) => r.json()).then(setS).catch(() => {})
  useEffect(() => { load() }, [])

  if (!s) return <div className="ad-soft" style={{ padding: 20 }}>Loading…</div>

  return (
    <div className="max-w-6xl">
      <div className="ad-kicker">Finance</div>
      <h1 className="text-2xl font-bold tracking-tight" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><PieChart size={22} /> Expenses Dashboard</h1>
      <p className="ad-mut" style={{ fontSize: 14, marginTop: 6 }}>Company spend, normalised to CAD. Recurring costs shown as monthly run-rate; one-off shown when incurred.</p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginTop: 18 }}>
        <StatCard label="Monthly run-rate" value={fmtMoneyShort(s.kpis.monthlyRunRate)} exact={fmtMoney(s.kpis.monthlyRunRate)} sub="active recurring, CAD/mo" />
        <StatCard label="Projected annual" value={fmtMoneyShort(s.kpis.annualRunRate)} exact={fmtMoney(s.kpis.annualRunRate)} sub="recurring × 12, CAD" />
        <StatCard label="Spend this month" value={fmtMoneyShort(s.kpis.spendThisMonth)} exact={fmtMoney(s.kpis.spendThisMonth)} sub="recurring + one-off" />
        <StatCard label="One-off YTD" value={fmtMoneyShort(s.kpis.oneOffYTD)} exact={fmtMoney(s.kpis.oneOffYTD)} sub="this calendar year" />
        <StatCard label="Active subscriptions" value={String(s.kpis.activeSubscriptions)} sub="recurring, not expired" />
        <StatCard label="Total records" value={String(s.kpis.totalExpenses)} sub="all expenses" />
      </div>

      {/* 12-month trend */}
      <Card title="Spend over the last 12 months (CAD)">
        <StackedTrend data={s.series12} />
        <Legend items={[['Recurring', '#ED1C24'], ['One-off', '#8390C8']]} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16, marginTop: 16 }}>
        <Card title="Recurring by category (CAD/mo)"><MoneyBars data={s.recByCategory} /></Card>
        <Card title="Top subscriptions (CAD/mo)"><MoneyBars data={s.byTool} /></Card>
        <Card title="One-off by category (YTD, CAD)"><MoneyBars data={s.offByCategory} /></Card>
        <Card title="By billing account (CAD/mo run-rate)"><MoneyBars data={s.byAccount} /></Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16, marginTop: 16 }}>
        <Card title="Currency mix (original amounts)">
          <MoneyBars data={s.byCurrency.map((c) => ({ label: c.label, value: c.value }))} showCurrency />
          <p className="ad-soft" style={{ fontSize: 11.5, marginTop: 8 }}>Native amounts before conversion. Totals elsewhere are in CAD.</p>
        </Card>
        <Card title="Recurring by frequency">
          <table className="ad-table" style={{ width: '100%' }}>
            <thead><tr><th>Frequency</th><th>Count</th><th style={{ textAlign: 'right' }}>CAD/mo</th></tr></thead>
            <tbody>
              {s.byFrequency.length ? s.byFrequency.map((f) => (
                <tr key={f.label}><td style={{ textTransform: 'capitalize' }}>{f.label}</td><td>{f.count}</td><td style={{ textAlign: 'right' }}>{fmtMoney(f.monthly)}</td></tr>
              )) : <tr><td colSpan={3} className="ad-soft" style={{ textAlign: 'center', padding: 18 }}>No recurring expenses yet.</td></tr>}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Marketing / Ads breakdown */}
      {s.marketingByType.length > 0 && (
        <>
          <div className="ad-kicker" style={{ marginTop: 24 }}>Marketing / Ads - {fmtMoney(s.marketingTotal)} (run-rate + one-off YTD, CAD)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16, marginTop: 8 }}>
            <Card title="By marketing type (CAD)"><MoneyBars data={s.marketingByType} /></Card>
            <Card title="By platform (CAD)"><MoneyBars data={s.marketingByPlatform} /></Card>
          </div>
        </>
      )}

      {/* Who logged spend */}
      {s.byPerson.length > 0 && (
        <Card title="Spend logged by person (CAD)"><MoneyBars data={s.byPerson} /></Card>
      )}

      {/* Upcoming renewals */}
      <Card title="Upcoming renewals (next 60 days)">
        <table className="ad-table" style={{ width: '100%' }}>
          <thead><tr><th>Subscription</th><th>Renews</th><th>Frequency</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
          <tbody>
            {s.upcoming.length ? s.upcoming.map((u) => (
              <tr key={u.expense_id + u.date}>
                <td><div style={{ fontWeight: 600 }}>{u.name}</div><div className="ad-soft" style={{ fontSize: 11 }}>{u.expense_id}</div></td>
                <td className="ad-mut" style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>{fmtDate(u.date)}</td>
                <td className="ad-mut" style={{ fontSize: 12.5, textTransform: 'capitalize' }}>{u.frequency}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{fmtMoney(u.amount_cad)}<div className="ad-soft" style={{ fontSize: 10.5 }}>{fmtMoney(u.amount_original, u.currency)}</div></td>
              </tr>
            )) : <tr><td colSpan={4} className="ad-soft" style={{ textAlign: 'center', padding: 18 }}>Nothing renewing in the next 60 days.</td></tr>}
          </tbody>
        </table>
      </Card>

      {/* FX editor */}
      <FxCard fx={s.fx} onSaved={load} />
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="ad-card" style={{ padding: 18, marginTop: 16 }}><div className="ad-kicker" style={{ marginBottom: 12 }}>{title}</div>{children}</div>
}
function Legend({ items }: { items: [string, string][] }) {
  return <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>{items.map(([l, c]) => <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{l}</span>)}</div>
}

function MoneyBars({ data, showCurrency }: { data: { label: string; value: number }[]; showCurrency?: boolean }) {
  const rows = data.slice(0, 8)
  const max = Math.max(1, ...rows.map((r) => r.value))
  if (!rows.length) return <p className="ad-soft" style={{ fontSize: 13 }}>No data yet.</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 84px', gap: 10, alignItems: 'center', fontSize: 12.5 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.label}>{r.label}</span>
          <div style={{ background: 'var(--paper-3)', borderRadius: 6, height: 16, overflow: 'hidden' }}><div style={{ width: `${(r.value / max) * 100}%`, height: '100%', background: PALETTE[i % PALETTE.length], borderRadius: 6, transition: 'width .4s' }} /></div>
          <b style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{showCurrency ? fmtMoney(r.value, r.label) : fmtMoney(r.value)}</b>
        </div>
      ))}
    </div>
  )
}

function StackedTrend({ data }: { data: { month: string; recurring: number; oneoff: number; total: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.total))
  const H = 150, bw = 30, gap = 10
  const w = Math.max(320, data.length * (bw + gap))
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={w} height={H + 28} style={{ display: 'block' }}>
        {data.map((d, i) => {
          const x = i * (bw + gap) + 4
          const hRec = (d.recurring / max) * H
          const hOff = (d.oneoff / max) * H
          return (
            <g key={d.month}>
              <rect x={x} y={H - hRec} width={bw} height={hRec} fill="#ED1C24">
                <title>{d.month} recurring: {fmtMoney(d.recurring)}</title>
              </rect>
              <rect x={x} y={H - hRec - hOff} width={bw} height={hOff} fill="#8390C8">
                <title>{d.month} one-off: {fmtMoney(d.oneoff)}</title>
              </rect>
              <text x={x + bw / 2} y={H - hRec - hOff - 4} textAnchor="middle" style={{ fontSize: 8.5, fill: 'var(--ink-mut)' }}>{Math.round(d.total)}</text>
              <text x={x + bw / 2} y={H + 14} textAnchor="middle" style={{ fontSize: 8.5, fill: 'var(--ink-soft)' }}>{d.month.slice(2)}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function FxCard({ fx, onSaved }: { fx: Stats['fx']; onSaved: () => void }) {
  const [rates, setRates] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {}
    CURRENCIES.forEach((c) => { o[c] = String(fx.rates?.[c] ?? '') })
    return o
  })
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState('')
  async function save() {
    setBusy(true); setMsg('')
    const payload = { rates: Object.fromEntries(CURRENCIES.map((c) => [c, Number(rates[c])])) }
    const res = await fetch('/api/admin/finance/fx', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setBusy(false)
    if (res.ok) { setMsg('Rates saved.'); onSaved() }
  }
  return (
    <Card title="Conversion rates → CAD (editable)">
      <p className="ad-soft" style={{ fontSize: 12, marginBottom: 12 }}>1 unit of each currency equals this many CAD. Update these to keep totals accurate.{fx.updatedAt ? ` Last updated ${fmtDate(fx.updatedAt)}.` : ''}</p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {CURRENCIES.map((c) => (
          <label key={c} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="ad-soft" style={{ fontSize: 12 }}>1 {c} =</span>
            <input className="ad-input" style={{ width: 110 }} inputMode="decimal" disabled={c === 'CAD'} value={rates[c]} onChange={(e) => setRates({ ...rates, [c]: e.target.value.replace(/[^\d.]/g, '') })} />
          </label>
        ))}
        <button className="ad-btn" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save rates'}</button>
        {msg && <span className="ad-soft" style={{ fontSize: 12, color: 'var(--accent, #6B9080)' }}>{msg}</span>}
      </div>
    </Card>
  )
}
