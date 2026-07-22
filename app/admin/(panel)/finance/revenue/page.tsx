'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/admin/charts'
import { fmtMoney } from '@/lib/admin/finance'
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLOR } from '@/lib/admin/billing'

type Stats = {
  kpis: { billed: number; collected: number; outstanding: number; overdue: number; invoices: number; clients: number; projects: number; collectionRate: number }
  series12: { month: string; billed: number; collected: number }[]
  byStatus: { label: string; count: number; value: number }[]
  byClient: { label: string; billed: number; collected: number; outstanding: number }[]
  recent: { id: number; invoice_number: string; client_name: string; total: number; amount_paid: number; currency: string; status: string; issue_date: string; due_date: string | null }[]
}
const badge: Record<string, string> = { grey: 'grey', blue: 'blue', amber: 'amber', green: 'green', red: 'red' }

export default function RevenueDashboard() {
  const [s, setS] = useState<Stats | null>(null)
  useEffect(() => { fetch('/api/admin/finance/revenue/stats').then((r) => r.json()).then(setS).catch(() => {}) }, [])
  if (!s) return <div className="ad-soft" style={{ padding: 20 }}>Loading…</div>

  return (
    <div className="max-w-6xl">
      <div className="ad-kicker">Finance</div>
      <h1 className="text-2xl font-bold tracking-tight" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><TrendingUp size={22} /> Revenue Dashboard</h1>
      <p className="ad-mut" style={{ fontSize: 14, marginTop: 6 }}>Client revenue and payment status, converted to CAD. Billed = invoiced; collected = paid.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginTop: 18 }}>
        <StatCard label="Total billed" value={fmtMoney(s.kpis.billed)} sub="all non-void invoices" />
        <StatCard label="Collected" value={fmtMoney(s.kpis.collected)} sub={`${s.kpis.collectionRate}% collection rate`} />
        <StatCard label="Outstanding" value={fmtMoney(s.kpis.outstanding)} sub="billed − collected" />
        <StatCard label="Overdue" value={fmtMoney(s.kpis.overdue)} sub="past due, unpaid" />
        <StatCard label="Invoices" value={String(s.kpis.invoices)} sub={`${s.kpis.clients} clients · ${s.kpis.projects} projects`} />
      </div>

      <Card title="Billed vs collected — last 12 months (CAD)">
        <GroupedBars data={s.series12} />
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <Leg c="#ED1C24" l="Billed" /><Leg c="#6B9080" l="Collected" />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16, marginTop: 16 }}>
        <Card title="By payment status">
          <table className="ad-table" style={{ width: '100%' }}>
            <thead><tr><th>Status</th><th>Count</th><th style={{ textAlign: 'right' }}>Billed (CAD)</th></tr></thead>
            <tbody>
              {s.byStatus.length ? s.byStatus.map((r) => (
                <tr key={r.label}><td><span className={`ad-badge ${badge[INVOICE_STATUS_COLOR[r.label]] || 'grey'}`}>{INVOICE_STATUS_LABELS[r.label] || r.label}</span></td><td>{r.count}</td><td style={{ textAlign: 'right' }}>{fmtMoney(r.value)}</td></tr>
              )) : <tr><td colSpan={3} className="ad-soft" style={{ textAlign: 'center', padding: 16 }}>No invoices yet.</td></tr>}
            </tbody>
          </table>
        </Card>
        <Card title="Top clients by revenue (CAD)">
          <table className="ad-table" style={{ width: '100%' }}>
            <thead><tr><th>Client</th><th style={{ textAlign: 'right' }}>Billed</th><th style={{ textAlign: 'right' }}>Paid</th><th style={{ textAlign: 'right' }}>Owed</th></tr></thead>
            <tbody>
              {s.byClient.length ? s.byClient.map((r) => (
                <tr key={r.label}><td style={{ fontWeight: 600 }}>{r.label}</td><td style={{ textAlign: 'right' }}>{fmtMoney(r.billed)}</td><td style={{ textAlign: 'right' }}>{fmtMoney(r.collected)}</td><td style={{ textAlign: 'right', color: r.outstanding > 0.005 ? 'var(--brand-ink)' : undefined }}>{fmtMoney(r.outstanding)}</td></tr>
              )) : <tr><td colSpan={4} className="ad-soft" style={{ textAlign: 'center', padding: 16 }}>No invoices yet.</td></tr>}
            </tbody>
          </table>
        </Card>
      </div>

      <Card title="Recent invoices">
        <table className="ad-table" style={{ width: '100%' }}>
          <thead><tr><th>Invoice</th><th>Client</th><th>Issued</th><th>Status</th><th style={{ textAlign: 'right' }}>Total</th><th></th></tr></thead>
          <tbody>
            {s.recent.length ? s.recent.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.invoice_number}</td>
                <td className="ad-mut" style={{ fontSize: 12.5 }}>{r.client_name}</td>
                <td className="ad-soft" style={{ fontSize: 12 }}>{r.issue_date}</td>
                <td><span className={`ad-badge ${badge[INVOICE_STATUS_COLOR[r.status]] || 'grey'}`}>{INVOICE_STATUS_LABELS[r.status] || r.status}</span></td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{fmtMoney(r.total, r.currency)}</td>
                <td style={{ textAlign: 'right' }}><a href={`/admin/receipt/${r.id}`} target="_blank" className="ad-btn-ghost" style={{ fontSize: 12 }}>Receipt</a></td>
              </tr>
            )) : <tr><td colSpan={6} className="ad-soft" style={{ textAlign: 'center', padding: 16 }}>No invoices yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="ad-card" style={{ padding: 18, marginTop: 16 }}><div className="ad-kicker" style={{ marginBottom: 12 }}>{title}</div>{children}</div>
}
function Leg({ c, l }: { c: string; l: string }) {
  return <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{l}</span>
}
function GroupedBars({ data }: { data: { month: string; billed: number; collected: number }[] }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.billed, d.collected)))
  const H = 150, group = 44, bw = 16, w = Math.max(320, data.length * group)
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={w} height={H + 26} style={{ display: 'block' }}>
        {data.map((d, i) => {
          const x = i * group + 6
          const hb = (d.billed / max) * H, hc = (d.collected / max) * H
          return (
            <g key={d.month}>
              <rect x={x} y={H - hb} width={bw} height={hb} rx={3} fill="#ED1C24"><title>{d.month} billed: {fmtMoney(d.billed)}</title></rect>
              <rect x={x + bw + 3} y={H - hc} width={bw} height={hc} rx={3} fill="#6B9080"><title>{d.month} collected: {fmtMoney(d.collected)}</title></rect>
              <text x={x + bw} y={H + 14} textAnchor="middle" style={{ fontSize: 8.5, fill: 'var(--ink-soft)' }}>{d.month.slice(2)}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
