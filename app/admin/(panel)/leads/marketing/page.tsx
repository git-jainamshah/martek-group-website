'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Download, ArrowLeft, BarChart3 } from 'lucide-react'
import LeadFilters from '@/components/admin/LeadFilters'
import { useLeads, LeadDrawer, Lead } from '@/components/admin/leads-shared'

const clickBadges = (l: Lead) => {
  const map: [string, string][] = [
    ['gclid', 'Google'], ['fbclid', 'Meta'], ['li_fat_id', 'LinkedIn'], ['ttclid', 'TikTok'],
    ['epik', 'Pinterest'], ['msclkid', 'Microsoft'], ['twclid', 'X'],
  ]
  const out = map.filter(([k]) => l[k]).map(([, label]) => label)
  if (l.other_click_ids) out.push('Other')
  return out
}

export default function LeadsMarketingPage() {
  const { filters, setFilters, leads, loading, load, qs } = useLeads()
  const [selected, setSelected] = useState<Lead | null>(null)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div className="ad-kicker">Growth</div>
          <h1>Leads — <span className="it">marketing</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 6, maxWidth: 560 }}>
            The same leads with their full acquisition story: channels, sources, campaigns, click IDs, and analytics identifiers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link href="/admin/leads" className="ad-btn-ghost"><ArrowLeft size={14} /> Simple view</Link>
          <Link href="/admin/leads/dashboard" className="ad-btn-ghost"><BarChart3 size={14} /> Dashboard</Link>
          {(['csv', 'xls', 'pdf'] as const).map((f) => (
            <a key={f} href={`/api/admin/leads/export?format=${f}&view=marketing&${qs()}`} className="ad-btn-ghost">
              <Download size={14} /> {f.toUpperCase()}
            </a>
          ))}
        </div>
      </div>

      <LeadFilters value={filters} onChange={setFilters} />

      <div className="ad-table-wrap" style={{ overflowX: 'auto', marginTop: 16 }}>
        <table className="ad-table" style={{ minWidth: 1180 }}>
          <thead>
            <tr>
              <th>Lead</th><th>Channel</th><th>Session source / medium</th><th>Campaign</th>
              <th>First touch</th><th>Click IDs</th><th>Landing page</th><th>Referrer</th><th>GA4 client</th><th>Received</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="clickable" onClick={() => setSelected(l)}>
                <td>
                  <div style={{ fontWeight: 600 }}>{l.name || '—'}</div>
                  <div className="ad-soft" style={{ fontSize: 12 }}>{l.email}</div>
                </td>
                <td>{l.session_channel_group ? <span className="ad-badge blue">{l.session_channel_group}</span> : '—'}</td>
                <td className="ad-mut" style={{ fontSize: 12.5 }}>{l.session_source ? `${l.session_source} / ${l.session_medium}` : '—'}</td>
                <td className="ad-mut" style={{ fontSize: 12.5 }}>{l.session_campaign || '—'}</td>
                <td className="ad-mut" style={{ fontSize: 12 }}>
                  {l.first_channel_group ? <>{l.first_channel_group}<div className="ad-soft" style={{ fontSize: 11 }}>{l.first_source} / {l.first_medium}</div></> : '—'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {clickBadges(l).map((b) => <span key={b} className="ad-chip" style={{ fontSize: 11 }}>{b}</span>)}
                    {clickBadges(l).length === 0 && <span className="ad-soft">—</span>}
                  </div>
                </td>
                <td className="ad-mut" style={{ fontSize: 12, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.landing_page}>{l.landing_page || '—'}</td>
                <td className="ad-mut" style={{ fontSize: 12, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.referrer_url}>{l.referrer_url || '—'}</td>
                <td className="ad-soft" style={{ fontSize: 11.5 }}>{l.ga_client_id || '—'}</td>
                <td className="ad-soft" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{l.created_at}</td>
              </tr>
            ))}
            {leads.length === 0 && !loading && (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: 36 }} className="ad-soft">No leads match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <LeadDrawer lead={selected} onClose={() => setSelected(null)} onSaved={load} />}
    </div>
  )
}
