'use client'

import { useCallback, useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

type Lead = {
  id: number; name: string | null; email: string; phone: string | null; company: string | null
  message: string | null; source_page: string | null; form_type: string; package_interest: string | null
  extra: string | null; status: string; notes: string | null; created_at: string; updated_at: string
}

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost']
const STATUS_COLORS: Record<string, string> = {
  new: 'ad-badge blue',
  contacted: 'ad-badge amber',
  qualified: 'ad-badge purple',
  won: 'ad-badge green',
  lost: 'ad-badge grey',
}
const SERVICES = ['web', 'data', 'social', 'seo', 'engineering']
const BUDGETS = ['<5k', '5-15k', '15-40k', '40k+', 'unsure']

const EMPTY = { q: '', status: '', formType: '', service: '', budget: '', from: '', to: '' }

export default function LeadsPage() {
  const [filters, setFilters] = useState({ ...EMPTY })
  const [leads, setLeads] = useState<Lead[]>([])
  const [selected, setSelected] = useState<Lead | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  const qs = useCallback(() => {
    const p = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => v && p.set(k, v))
    return p.toString()
  }, [filters])

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/leads?${qs()}`).then((r) => r.json()).then((d) => setLeads(d.leads || [])).finally(() => setLoading(false))
  }, [qs])

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])

  async function update(id: number, patch: { status?: string; notes?: string }) {
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
    })
    load()
  }

  const extra = (l: Lead) => { try { return JSON.parse(l.extra || '{}') } catch { return {} } }
  const input = 'ad-input'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm ad-mut mt-1">{leads.length} lead{leads.length === 1 ? '' : 's'} matching filters. Every form submission is stored permanently.</p>
        </div>
        <div className="flex gap-2">
          {(['csv', 'xls', 'pdf'] as const).map((f) => (
            <a key={f} href={`/api/admin/leads/export?format=${f}&${qs()}`}
              className="ad-btn-ghost">
              <Download className="w-4 h-4" /> {f.toUpperCase()}
            </a>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-end ad-card">
        <div className="space-y-1 flex-1 min-w-48">
          <label className="text-xs ad-mut">Search (name, email, company, message)</label>
          <input className={`${input} w-full`} value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs ad-mut">Status</label>
          <select className={input} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs ad-mut">Form</label>
          <select className={input} value={filters.formType} onChange={(e) => setFilters({ ...filters, formType: e.target.value })}>
            <option value="">All</option>
            <option value="contact">Contact form</option>
            <option value="promo-banner">Promo banner</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs ad-mut">Service</label>
          <select className={input} value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value })}>
            <option value="">All</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs ad-mut">Budget</label>
          <select className={input} value={filters.budget} onChange={(e) => setFilters({ ...filters, budget: e.target.value })}>
            <option value="">All</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs ad-mut">From</label>
          <input type="date" className={input} value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs ad-mut">To</label>
          <input type="date" className={input} value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        </div>
        <button onClick={() => setFilters({ ...EMPTY })} className="text-sm ad-mut hover:text-[#1A1A1E] px-2 py-2">Clear</button>
      </div>

      {/* Table */}
      <div className="ad-table-wrap overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider ad-soft border-b border-[#E2D9C4]">
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Services</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Form</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const ex = extra(l)
              return (
                <tr key={l.id} onClick={() => { setSelected(l); setNotes(l.notes ?? '') }}
                  className="border-b border-[#E2D9C4] last:border-0 hover:bg-[#F4EDDD] cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="font-medium">{l.name || '—'}</div>
                    <div className="ad-soft text-xs">{l.email}{l.company ? ` · ${l.company}` : ''}</div>
                  </td>
                  <td className="px-4 py-3 ad-mut text-xs">{Array.isArray(ex.services) ? ex.services.join(', ') : '—'}</td>
                  <td className="px-4 py-3 ad-mut text-xs">{ex.budget || '—'}</td>
                  <td className="px-4 py-3 ad-mut text-xs">{l.form_type}</td>
                  <td className="px-4 py-3 ad-soft text-xs whitespace-nowrap">{l.created_at}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select value={l.status} onChange={(e) => update(l.id, { status: e.target.value })}
                      className={`text-xs border rounded-full px-2 py-1 bg-transparent ${STATUS_COLORS[l.status] || ''}`}>
                      {STATUSES.map((s) => <option key={s} value={s} className="bg-[#FFFDF7] text-[#1A1A1E]">{s}</option>)}
                    </select>
                  </td>
                </tr>
              )
            })}
            {leads.length === 0 && !loading && (
              <tr><td colSpan={6} className="px-4 py-10 text-center ad-soft">No leads match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-[#FBF6EC] border-l border-[#E2D9C4] h-full overflow-y-auto p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{selected.name || selected.email}</h2>
              <button onClick={() => setSelected(null)} className="ad-soft hover:text-[#1A1A1E]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <Row k="Email" v={<a className="underline text-[#C8141B]" href={`mailto:${selected.email}`}>{selected.email}</a>} />
              <Row k="Company" v={selected.company || '—'} />
              <Row k="Received" v={selected.created_at} />
              <Row k="Form" v={selected.form_type} />
              <Row k="Source page" v={selected.source_page || '—'} />
              {(() => {
                const ex = extra(selected)
                return (
                  <>
                    <Row k="Services" v={Array.isArray(ex.services) ? ex.services.join(', ') : '—'} />
                    <Row k="Budget" v={ex.budget || '—'} />
                    <Row k="Timeline" v={ex.timeline || '—'} />
                    <Row k="Heard via" v={ex.referral || '—'} />
                  </>
                )
              })()}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider ad-soft mb-1">Message</div>
              <p className="text-sm text-[#2B2B30] whitespace-pre-wrap bg-[#F4EDDD] border border-[#E2D9C4] rounded-lg p-3">{selected.message || '—'}</p>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider ad-soft">Internal notes</div>
              <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
                className="ad-input" />
              <button onClick={() => { update(selected.id, { notes }); setSelected(null) }}
                className="ad-btn">Save notes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="w-28 shrink-0 ad-soft">{k}</span>
      <span className="min-w-0">{v}</span>
    </div>
  )
}
