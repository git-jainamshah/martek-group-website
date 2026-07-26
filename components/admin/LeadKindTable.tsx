'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  LeadDrawer, extraOf, STATUSES, STATUS_COLORS, STATUS_LABELS, serviceNames,
  Lead, useSelection, BulkDeleteBar, SelectHeaderCell, SelectRowCell,
} from '@/components/admin/leads-shared'
import { fmtDateTime } from '@/lib/admin/dates'

/**
 * Management table for one kind of lead (offline or pitch). Lists the records
 * with inline status editing, a click-through detail drawer, and bulk delete.
 * Refreshes when `reloadKey` changes (e.g. after a new lead is added).
 */
export default function LeadKindTable({ kind, reloadKey = 0 }: { kind: 'offline' | 'pitch'; reloadKey?: number }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [canEdit, setCanEdit] = useState(false)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [bulkMsg, setBulkMsg] = useState('')
  const sel = useSelection()

  const load = useCallback(() => {
    setLoading(true)
    const p = new URLSearchParams({ formType: kind })
    if (statusFilter) p.set('status', statusFilter)
    fetch(`/api/admin/leads?${p}`).then((r) => r.json()).then((d) => setLeads(d.leads || [])).finally(() => setLoading(false))
  }, [kind, statusFilter])

  useEffect(() => { load() }, [load, reloadKey])
  useEffect(() => {
    fetch('/api/admin/me').then((r) => r.json()).then((d) => setCanEdit(!!d.canEditLeads)).catch(() => {})
  }, [])

  async function setStatus(id: number, status: string) {
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    })
    load()
  }

  const counts = STATUSES.reduce((m, s) => { m[s] = leads.filter((l) => l.status === s).length; return m }, {} as Record<string, number>)
  const label = kind === 'pitch' ? 'pitch' : 'offline lead'

  return (
    <div>
      {/* Status summary */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <button className={statusFilter === '' ? 'ad-btn' : 'ad-btn-ghost'} style={{ padding: '6px 12px', fontSize: 12.5 }}
          onClick={() => setStatusFilter('')}>All ({leads.length === 0 && loading ? '…' : Object.values(counts).reduce((a, b) => a + b, 0)})</button>
        {STATUSES.map((s) => (
          <button key={s} className={statusFilter === s ? 'ad-btn' : 'ad-btn-ghost'} style={{ padding: '6px 12px', fontSize: 12.5 }}
            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}>
            {STATUS_LABELS[s]} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {bulkMsg && <div className="ad-alert ok" style={{ marginBottom: 12 }}>{bulkMsg}</div>}
      {canEdit && <BulkDeleteBar visibleIds={leads.map((l) => l.id)} selected={sel.selected} selectAll={sel.selectAll} clear={sel.clear}
        onDone={(m) => { setBulkMsg(m); setTimeout(() => setBulkMsg(''), 8000); load() }} />}

      <div className="ad-table-wrap" style={{ overflowX: 'auto', marginTop: 12 }}>
        <table className="ad-table" style={{ minWidth: 880 }}>
          <thead>
            <tr>
              <SelectHeaderCell show={canEdit} visibleIds={leads.map((l) => l.id)} selected={sel.selected} selectAll={sel.selectAll} clear={sel.clear} />
              <th>Lead</th><th>{kind === 'pitch' ? 'Pitched Via' : 'Reached Via'}</th><th>Services</th><th>Budget</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const ex = extraOf(l)
              return (
                <tr key={l.id} className="clickable" onClick={() => setSelected(l)}>
                  <SelectRowCell show={canEdit} id={l.id} selected={sel.selected} toggle={sel.toggle} />
                  <td>
                    <div style={{ fontWeight: 600 }}>{l.name || '-'}</div>
                    <div className="ad-soft" style={{ fontSize: 12 }}>{l.public_id || `#${l.id}`}{l.company ? ` · ${l.company}` : ''}{l.email ? ` · ${l.email}` : ''}</div>
                  </td>
                  <td className="ad-mut" style={{ fontSize: 12.5 }}>{l.contact_method || '-'}</td>
                  <td className="ad-mut" style={{ fontSize: 12.5 }}>{serviceNames(ex.services) || '-'}</td>
                  <td className="ad-mut" style={{ fontSize: 12.5 }}>{ex.budget || '-'}</td>
                  <td className="ad-soft" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{fmtDateTime(l.created_at)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {canEdit ? (
                      <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}
                        className={STATUS_COLORS[l.status] || 'ad-badge grey'} style={{ border: 0, cursor: 'pointer' }}>
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    ) : (
                      <span className={STATUS_COLORS[l.status] || 'ad-badge grey'}>{STATUS_LABELS[l.status] ?? l.status}</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {leads.length === 0 && !loading && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 36 }} className="ad-soft">
                No {label}s{statusFilter ? ` with status "${STATUS_LABELS[statusFilter]}"` : ' yet'}.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <LeadDrawer lead={selected} canEdit={canEdit} onClose={() => setSelected(null)} onSaved={load} />}
    </div>
  )
}
