'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Megaphone } from 'lucide-react'
import { HBarChart, Donut, TimeSeries, StatCard } from '@/components/admin/charts'

type Stats = {
  total: number; withCompany: number; withClickId: number
  byStatus: { label: string; value: number }[]
  byService: { label: string; value: number }[]
  byBudget: { label: string; value: number }[]
  byChannel: { label: string; value: number }[]
  bySourceMedium: { label: string; value: number }[]
  byForm: { label: string; value: number }[]
  byLanding: { label: string; value: number }[]
  topCompanies: { company: string; name: string; status: string; created: string }[]
  series: { date: string; value: number }[]
}

const SERVICE_LABELS: Record<string, string> = {
  web: 'Web Development', data: 'Data & Analytics', social: 'Social', seo: 'SEO & Ads', engineering: 'Engineering',
}
const STATUS_LABELS: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified', won: 'Won', lost: 'Lost',
}

export default function LeadsDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [formType, setFormType] = useState('')

  useEffect(() => {
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    if (formType) p.set('formType', formType)
    const t = setTimeout(() => {
      fetch(`/api/admin/leads/stats?${p}`).then((r) => r.json()).then((d) => setStats(d.stats))
    }, 200)
    return () => clearTimeout(t)
  }, [from, to, formType])

  const Panel = ({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) => (
    <div className="ad-card" style={{ gridColumn: wide ? '1 / -1' : undefined }}>
      <div className="ad-kicker" style={{ marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  )

  return (
    <div style={{ maxWidth: 1060 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div className="ad-kicker">Growth</div>
          <h1>Leads <span className="it">Dashboard</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 6 }}>What kind of leads you get, and how they find you.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/leads" className="ad-btn-ghost"><ArrowLeft size={14} /> Leads</Link>
          <Link href="/admin/leads/marketing" className="ad-btn-ghost"><Megaphone size={14} /> Marketing view</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="ad-card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', padding: 16, marginBottom: 18 }}>
        <div><label className="ad-label">From</label>
          <input type="date" className="ad-input" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className="ad-label">To</label>
          <input type="date" className="ad-input" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div><label className="ad-label">Form</label>
          <select className="ad-input" value={formType} onChange={(e) => setFormType(e.target.value)}>
            <option value="">All</option>
            <option value="contact">Contact Form</option>
            <option value="promo-banner">Promo Banner</option>
          </select></div>
        {(from || to || formType) && (
          <button className="ad-btn-ghost" onClick={() => { setFrom(''); setTo(''); setFormType('') }}>Clear</button>
        )}
      </div>

      {!stats ? (
        <p className="ad-mut" style={{ fontSize: 14 }}>Crunching numbers…</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 18 }}>
            <StatCard label="Total leads" value={stats.total} />
            <StatCard label="From companies" value={stats.withCompany}
              sub={stats.total ? `${Math.round((stats.withCompany / stats.total) * 100)}% of leads` : undefined} />
            <StatCard label="From paid ads" value={stats.withClickId}
              sub={stats.total ? `${Math.round((stats.withClickId / stats.total) * 100)}% carry a click ID` : undefined} />
            <StatCard label="Won" value={stats.byStatus.find((s) => s.label === 'won')?.value ?? 0} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            <Panel title="Leads over time" wide>
              <TimeSeries data={stats.series} />
            </Panel>
            <Panel title="Acquisition channels">
              <Donut data={stats.byChannel} />
            </Panel>
            <Panel title="Pipeline status">
              <HBarChart data={stats.byStatus.map((s) => ({ ...s, label: STATUS_LABELS[s.label] ?? s.label }))} />
            </Panel>
            <Panel title="Services requested">
              <HBarChart data={stats.byService.map((s) => ({ ...s, label: SERVICE_LABELS[s.label] ?? s.label }))} />
            </Panel>
            <Panel title="Budget ranges">
              <HBarChart data={stats.byBudget} />
            </Panel>
            <Panel title="Top sources / mediums">
              <HBarChart data={stats.bySourceMedium} />
            </Panel>
            <Panel title="Landing pages that convert">
              <HBarChart data={stats.byLanding} />
            </Panel>
            <Panel title="Recent company leads" wide>
              {stats.topCompanies.length === 0 ? (
                <p className="ad-soft" style={{ fontSize: 13 }}>No company leads yet.</p>
              ) : (
                <table className="ad-table">
                  <thead><tr><th>Company</th><th>Contact</th><th>Status</th><th>Received</th></tr></thead>
                  <tbody>
                    {stats.topCompanies.map((c, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{c.company}</td>
                        <td className="ad-mut">{c.name}</td>
                        <td><span className="ad-badge grey">{STATUS_LABELS[c.status] ?? c.status}</span></td>
                        <td className="ad-soft" style={{ fontSize: 12 }}>{c.created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  )
}
