'use client'

import { useCallback, useEffect, useState } from 'react'
import { X, Trash2, CheckSquare } from 'lucide-react'
import LeadFilters, { LeadFilterState, EMPTY_FILTERS, filtersToQs } from '@/components/admin/LeadFilters'
import { fmtDateTime, fmtDate, fmtRelative } from '@/lib/admin/dates'
import LeadActivityThread from './LeadActivityThread'

export type Lead = Record<string, any>

export const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost']
export const STATUS_LABELS: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified', won: 'Won', lost: 'Lost',
}
export const SERVICE_LABELS: Record<string, string> = {
  web: 'Web Development', data: 'Data & Analytics', social: 'Social', seo: 'SEO & Ads', engineering: 'Engineering',
}
export const FORM_LABELS: Record<string, string> = {
  contact: 'Contact Form', 'promo-banner': 'Promo Banner', offline: 'Offline Lead', pitch: 'Pitch', other: 'Other',
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
  const [role, setRole] = useState('')
  const [canEdit, setCanEdit] = useState(false)
  const qs = useCallback(() => filtersToQs(filters), [filters])
  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/leads?${qs()}`).then((r) => r.json()).then((d) => setLeads(d.leads || [])).finally(() => setLoading(false))
  }, [qs])
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])
  useEffect(() => {
    fetch('/api/admin/me').then((r) => r.json()).then((d) => {
      setRole(d.user?.role || '')
      setCanEdit(!!d.canEditLeads)
    }).catch(() => {})
  }, [])
  return { filters, setFilters, leads, loading, load, qs, role, canEdit }
}

type LeadNote = { id: number; author_name: string; author_email: string; body: string; created_at: string }

export function LeadDrawer({ lead, onClose, onSaved, canEdit = true }: { lead: Lead; onClose: () => void; onSaved: () => void; canEdit?: boolean }) {
  const ex = extraOf(lead)
  const [teammates, setTeammates] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/admin/teammates', { cache: 'no-store' })
      .then((r) => r.json()).then((d) => setTeammates(d.users || [])).catch(() => {})
  }, [])


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
          <Row k="Phone" v={lead.phone ? <a href={`tel:${lead.phone}`} style={{ textDecoration: 'underline', color: 'var(--brand-ink)' }}>{lead.phone}</a> : undefined} />
          <Row k="Company" v={lead.company} />
          <Row k="Company URL" v={ex.companyUrl && <a href={ex.companyUrl} target="_blank" style={{ textDecoration: 'underline', color: 'var(--brand-ink)' }}>{ex.companyUrl}</a>} />
          <Row k="Location" v={[ex.companyProvince, ex.companyCountry].filter(Boolean).join(', ')} />
          <Row k="Remote" v={ex.companyRemote} />
          <Row k="Received" v={`${fmtDateTime(lead.created_at)} (${fmtRelative(lead.created_at)})`} />
          <Row k="Consent" v={lead.consent ? `Yes${lead.consent_at ? ' - ' + fmtDate(lead.consent_at) : ''}` : 'No'} />
          <Row k="Form" v={FORM_LABELS[lead.form_type] ?? lead.form_type} />
          <Row k="Page" v={lead.source_page} />
          <Row k="Services" v={serviceNames(ex.services)} />
          <Row k="Budget" v={ex.budget} />
          <Row k="Timeline" v={ex.timeline} />
          <Row k="Heard via" v={[ex.referral, ex.referralDetail].filter(Boolean).join(' - ')} />
          {lead.contact_method && <Row k="Contact method" v={lead.contact_method} />}
          {lead.added_by && <Row k="Added by" v={lead.added_by} />}
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

        <div className="ad-kicker" style={{ margin: '18px 0 8px' }}>Status</div>
        {canEdit ? (
          <select className="ad-input" style={{ width: 180 }} value={lead.status} onChange={(e) => save({ status: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        ) : (
          <span className={STATUS_COLORS[lead.status] || 'ad-badge grey'}>{STATUS_LABELS[lead.status] ?? lead.status}</span>
        )}

        <div className="ad-kicker" style={{ margin: '18px 0 8px' }}>Owner</div>
        {canEdit ? (
          <select className="ad-input ad-select-sm" value={lead.owner_user_id ?? 'none'}
            onChange={(e) => save({ ownerUserId: e.target.value === 'none' ? null : Number(e.target.value) })}>
            <option value="none">Unassigned</option>
            {teammates.map((t: any) => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
          </select>
        ) : (
          <div style={{ fontSize: 13 }}>{lead.owner_name || <span className="ad-soft">Unassigned</span>}</div>
        )}

        <LeadActivityThread leadId={lead.id} canEdit={canEdit} intakeNote={lead.notes} />
      </div>
    </div>
  )
}



/* ------------------------------------------------------------------ */
/* Bulk selection + delete (shared by Leads, Marketing, Delete Folder) */
/* ------------------------------------------------------------------ */

export function useSelection() {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const toggle = (id: number) =>
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
  const selectAll = (ids: number[]) => setSelected(new Set(ids))
  const clear = () => setSelected(new Set())
  return { selected, toggle, selectAll, clear }
}

/**
 * Selection bar + confirmation for bulk delete (soft delete into the
 * Delete Folder). Renders nothing when no rows are selected.
 */
export function BulkDeleteBar({
  visibleIds, selected, selectAll, clear, onDone,
}: {
  visibleIds: number[]
  selected: Set<number>
  selectAll: (ids: number[]) => void
  clear: () => void
  onDone: (msg: string) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  if (selected.size === 0) return null

  async function doDelete() {
    setBusy(true)
    const res = await fetch('/api/admin/leads/bulk', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', ids: [...selected] }),
    })
    const d = await res.json()
    setBusy(false)
    setConfirming(false)
    clear()
    onDone(res.ok
      ? `${d.count} record${d.count === 1 ? '' : 's'} deleted and moved to the Delete Folder. Recoverable for 60 days.`
      : d.error || 'Delete failed.')
  }

  return (
    <>
      <div className="ad-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', marginTop: 12, flexWrap: 'wrap' }}>
        <b style={{ fontSize: 13.5 }}>{selected.size} selected</b>
        {selected.size < visibleIds.length && (
          <button className="ad-btn-ghost" style={{ padding: '6px 12px', fontSize: 12.5 }} onClick={() => selectAll(visibleIds)}>
            <CheckSquare size={13} /> Select all {visibleIds.length} in this view
          </button>
        )}
        <button className="ad-btn-ghost" style={{ padding: '6px 12px', fontSize: 12.5 }} onClick={clear}>Clear selection</button>
        <button className="ad-btn-danger" style={{ padding: '8px 16px', fontSize: 12.5, marginLeft: 'auto' }} onClick={() => setConfirming(true)}>
          <Trash2 size={13} style={{ marginRight: 6, verticalAlign: -2 }} />Delete selected
        </button>
      </div>

      {confirming && (
        <div className="ad-overlay" onClick={() => !busy && setConfirming(false)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete {selected.size} record{selected.size === 1 ? '' : 's'}?</h3>
            <p className="ad-mut" style={{ fontSize: 13.5, margin: '8px 0 18px' }}>
              They will move to the Delete Folder, where you can recover them for 60 days.
              After that they are removed permanently.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button disabled={busy} className="ad-btn-ghost" onClick={() => setConfirming(false)}>No, keep them</button>
              <button disabled={busy} className="ad-btn-danger" onClick={doDelete}>
                {busy ? 'Deleting…' : `Yes, delete ${selected.size}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Header + row checkbox helpers */
export function SelectHeaderCell({ visibleIds, selected, selectAll, clear, show = true }: {
  visibleIds: number[]; selected: Set<number>; selectAll: (ids: number[]) => void; clear: () => void; show?: boolean
}) {
  const all = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id))
  if (!show) return null
  return (
    <th style={{ width: 36 }}>
      <input type="checkbox" checked={all} aria-label="Select all"
        onChange={() => (all ? clear() : selectAll(visibleIds))}
        style={{ width: 15, height: 15, accentColor: 'var(--brand)', cursor: 'pointer' }} />
    </th>
  )
}

export function SelectRowCell({ id, selected, toggle, show = true }: { id: number; selected: Set<number>; toggle: (id: number) => void; show?: boolean }) {
  if (!show) return null
  return (
    <td onClick={(e) => e.stopPropagation()} style={{ width: 36 }}>
      <input type="checkbox" checked={selected.has(id)} aria-label="Select record"
        onChange={() => toggle(id)}
        style={{ width: 15, height: 15, accentColor: 'var(--brand)', cursor: 'pointer' }} />
    </td>
  )
}
