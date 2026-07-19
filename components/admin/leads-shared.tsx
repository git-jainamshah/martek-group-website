'use client'

import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import LeadFilters, { LeadFilterState, EMPTY_FILTERS, filtersToQs } from '@/components/admin/LeadFilters'

export type Lead = Record<string, any>

export const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost']
export const STATUS_LABELS: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified', won: 'Won', lost: 'Lost',
}
export const SERVICE_LABELS: Record<string, string> = {
  web: 'Web Development', data: 'Data & Analytics', social: 'Social', seo: 'SEO & Ads', engineering: 'Engineering',
}
export const FORM_LABELS: Record<string, string> = {
  contact: 'Contact Form', 'promo-banner': 'Promo Banner', other: 'Other',
}
export const serviceNames = (arr: unknown) =>
  Array.isArray(arr) ? arr.map((s) => SERVICE_LABELS[s as string] ?? s).join(', ') : ''
export const STATUS_COLORS: Record<string, string> = {
  new: 'ad-badge blue', contacted: 'ad-badge amber', qualified: 'ad-badge purple',
  won: 'ad-badge green', lost: 'ad-badge grey',
}

export const extraOf = (l: Lead) => { try { return JSON.parse(l.extra || '{}') } catch { return {} } }

export function useLeads() {
  const [filters, setFilters] = useState<LeadFilterState>({ ...EMPTY_FILTERS })
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const qs = useCallback(() => filtersToQs(filters), [filters])
  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/leads?${qs()}`).then((r) => r.json()).then((d) => setLeads(d.leads || [])).finally(() => setLoading(false))
  }, [qs])
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])
  return { filters, setFilters, leads, loading, load, qs }
}

export function LeadDrawer({ lead, onClose, onSaved }: { lead: Lead; onClose: () => void; onSaved: () => void }) {
  const [notes, setNotes] = useState(lead.notes ?? '')
  const ex = extraOf(lead)
  const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
    <div style={{ display: 'flex', gap: 10, fontSize: 13 }}>
      <span className="ad-soft" style={{ width: 118, flexShrink: 0 }}>{k}</span>
      <span style={{ minWidth: 0, wordBreak: 'break-word' }}>{v || '-'}</span>
    </div>
  )
  async function save(patch: any) {
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
    })
    onSaved()
  }
  const clicks = ['gclid', 'fbclid', 'li_fat_id', 'ttclid', 'epik', 'msclkid', 'twclid'].filter((c) => lead[c])
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,30,.4)', zIndex: 60, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 460, background: 'var(--paper)', borderLeft: '1px solid var(--rule)', height: '100%', overflowY: 'auto', padding: 26 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h2 style={{ margin: 0 }}>{lead.name || lead.email}</h2>
            <span className="ad-soft" style={{ fontSize: 12 }}>Lead ID: {lead.public_id || `#${lead.id}`}</span>
          </div>
          <button onClick={onClose} className="ad-icon-btn"><X size={16} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <Row k="Email" v={<a href={`mailto:${lead.email}`} style={{ textDecoration: 'underline', color: 'var(--brand-ink)' }}>{lead.email}</a>} />
          <Row k="Company" v={lead.company} />
          <Row k="Received" v={lead.created_at} />
          <Row k="Consent" v={lead.consent ? `Yes${lead.consent_at ? ' - ' + String(lead.consent_at).slice(0, 10) : ''}` : 'No'} />
          <Row k="Form" v={FORM_LABELS[lead.form_type] ?? lead.form_type} />
          <Row k="Page" v={lead.source_page} />
          <Row k="Services" v={serviceNames(ex.services)} />
          <Row k="Budget" v={ex.budget} />
          <Row k="Timeline" v={ex.timeline} />
          <Row k="Heard via" v={[ex.referral, ex.referralDetail].filter(Boolean).join(' - ')} />
        </div>

        <div className="ad-kicker" style={{ margin: '18px 0 8px' }}>Acquisition</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <Row k="Channel" v={lead.session_channel_group && <span className="ad-badge blue">{lead.session_channel_group}</span>} />
          <Row k="Source / medium" v={lead.session_source && `${lead.session_source} / ${lead.session_medium}`} />
          <Row k="Campaign" v={lead.session_campaign} />
          <Row k="Term / content" v={[lead.session_term, lead.session_content].filter(Boolean).join(' / ')} />
          <Row k="First touch" v={lead.first_source && `${lead.first_source} / ${lead.first_medium} (${lead.first_channel_group})`} />
          <Row k="First campaign" v={[lead.first_campaign, lead.first_term, lead.first_content].filter(Boolean).join(' / ')} />
          <Row k="Referrer" v={lead.referrer_url} />
          <Row k="Landing page" v={lead.landing_page} />
          <Row k="Click IDs" v={clicks.length ? clicks.map((c) => <span key={c} className="ad-chip" style={{ marginRight: 4 }}>{c}</span>) : ''} />
          <Row k="GA4 client" v={lead.ga_client_id} />
        </div>

        <div className="ad-kicker" style={{ margin: '18px 0 8px' }}>Message</div>
        <p style={{ fontSize: 13.5, whiteSpace: 'pre-wrap', background: '#fffdf7', border: '1px solid var(--rule)', borderRadius: 12, padding: 12 }}>{lead.message || '-'}</p>

        <div className="ad-kicker" style={{ margin: '18px 0 8px' }}>Internal notes</div>
        <textarea rows={4} className="ad-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <select className="ad-input" style={{ width: 150 }} value={lead.status} onChange={(e) => save({ status: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button className="ad-btn" onClick={() => { save({ notes }); onClose() }}>Save notes</button>
        </div>
      </div>
    </div>
  )
}

