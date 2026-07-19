'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, BarChart3, Megaphone } from 'lucide-react'
import LeadFilters from '@/components/admin/LeadFilters'
import { useLeads, LeadDrawer, extraOf, STATUSES, STATUS_COLORS, Lead } from '@/components/admin/leads-shared'

export default function LeadsPage() {
  const { filters, setFilters, leads, loading, load, qs } = useLeads()
  const [selected, setSelected] = useState<Lead | null>(null)

  async function setStatus(id: number, status: string) {
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    })
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div className="ad-kicker">Growth</div>
          <h1>Leads</h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 6 }}>
            {leads.length} lead{leads.length === 1 ? '' : 's'} matching. Stored permanently.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/admin/leads/dashboard" className="ad-btn-ghost"><BarChart3 size={14} /> Dashboard</Link>
          <Link href="/admin/leads/marketing" className="ad-btn-ghost"><Megaphone size={14} /> Marketing view</Link>
          {(['csv', 'xls', 'pdf'] as const).map((f) => (
            <a key={f} href={`/api/admin/leads/export?format=${f}&${qs()}`} className="ad-btn-ghost">
              <Download size={14} /> {f.toUpperCase()}
            </a>
          ))}
        </div>
      </div>

      <LeadFilters value={filters} onChange={setFilters} />

      <div className="ad-table-wrap" style={{ overflowX: 'auto', marginTop: 16 }}>
        <table className="ad-table" style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th>Lead</th><th>Services</th><th>Budget</th><th>Channel</th><th>Form</th><th>Received</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const ex = extraOf(l)
              return (
                <tr key={l.id} className="clickable" onClick={() => setSelected(l)}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{l.name || '—'}</div>
                    <div className="ad-soft" style={{ fontSize: 12 }}>{l.email}{l.company ? ` · ${l.company}` : ''}</div>
                  </td>
                  <td className="ad-mut" style={{ fontSize: 12.5 }}>{Array.isArray(ex.services) ? ex.services.join(', ') : '—'}</td>
                  <td className="ad-mut" style={{ fontSize: 12.5 }}>{ex.budget || '—'}</td>
                  <td style={{ fontSize: 12 }}>{l.session_channel_group ? <span className="ad-badge grey">{l.session_channel_group}</span> : '—'}</td>
                  <td className="ad-mut" style={{ fontSize: 12.5 }}>{l.form_type}</td>
                  <td className="ad-soft" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{l.created_at}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}
                      className={STATUS_COLORS[l.status] || 'ad-badge grey'} style={{ border: 0, cursor: 'pointer' }}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              )
            })}
            {leads.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 36 }} className="ad-soft">No leads match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <LeadDrawer lead={selected} onClose={() => setSelected(null)} onSaved={load} />}
    </div>
  )
}
