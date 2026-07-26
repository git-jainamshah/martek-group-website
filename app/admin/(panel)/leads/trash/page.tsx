'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Trash2, CheckSquare, AlertTriangle } from 'lucide-react'
import { extraOf, serviceNames, useSelection, Lead } from '@/components/admin/leads-shared'
import { fmtDateTime } from '@/lib/admin/dates'

/** Days left before a trashed record is purged (60-day window). */
function daysLeft(deletedAt: string): number {
  const s = String(deletedAt)
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(s)
  const del = new Date((s.includes('T') ? s : s.replace(' ', 'T')) + (hasZone ? '' : 'Z')).getTime()
  return Math.max(0, 60 - Math.floor((Date.now() - del) / 864e5))
}

export default function DeleteFolderPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [confirmDestroy, setConfirmDestroy] = useState(false)
  const [busy, setBusy] = useState(false)
  const sel = useSelection()

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/leads?deleted=1').then((r) => r.json()).then((d) => setLeads(d.leads || [])).finally(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  function flash(kind: 'ok' | 'err', text: string) {
    setMsg({ kind, text })
    setTimeout(() => setMsg(null), 8000)
  }

  async function bulk(action: 'restore' | 'destroy') {
    setBusy(true)
    const res = await fetch('/api/admin/leads/bulk', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ids: [...sel.selected] }),
    })
    const d = await res.json()
    setBusy(false)
    setConfirmDestroy(false)
    sel.clear()
    if (!res.ok) return flash('err', d.error || 'Action failed.')
    flash('ok', action === 'restore'
      ? `${d.count} record${d.count === 1 ? '' : 's'} recovered and back in Leads.`
      : `${d.count} record${d.count === 1 ? '' : 's'} permanently deleted.`)
    load()
  }

  const visibleIds = leads.map((l) => l.id)
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => sel.selected.has(id))

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div>
          <div className="ad-kicker">Growth</div>
          <h1>Delete <span className="it">Folder</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 6, maxWidth: 560 }}>
            Deleted lead records live here for 60 days and can be recovered at any time.
            After 60 days they are removed permanently and automatically.
          </p>
        </div>
        <Link href="/admin/leads" className="ad-btn-ghost"><ArrowLeft size={14} /> Back to Leads</Link>
      </div>

      {msg && <div className={`ad-alert ${msg.kind}`} style={{ marginBottom: 14 }}>{msg.text}</div>}

      {sel.selected.size > 0 && (
        <div className="ad-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', marginBottom: 14, flexWrap: 'wrap' }}>
          <b style={{ fontSize: 13.5 }}>{sel.selected.size} selected</b>
          {sel.selected.size < visibleIds.length && (
            <button className="ad-btn-ghost" style={{ padding: '6px 12px', fontSize: 12.5 }} onClick={() => sel.selectAll(visibleIds)}>
              <CheckSquare size={13} /> Select all {visibleIds.length}
            </button>
          )}
          <button className="ad-btn-ghost" style={{ padding: '6px 12px', fontSize: 12.5 }} onClick={sel.clear}>Clear</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button disabled={busy} className="ad-btn" style={{ padding: '8px 16px', fontSize: 12.5 }} onClick={() => bulk('restore')}>
              <RotateCcw size={13} /> Recover selected
            </button>
            <button disabled={busy} className="ad-btn-danger" style={{ padding: '8px 16px', fontSize: 12.5 }} onClick={() => setConfirmDestroy(true)}>
              <Trash2 size={13} style={{ marginRight: 6, verticalAlign: -2 }} />Delete permanently
            </button>
          </div>
        </div>
      )}

      <div className="ad-table-wrap" style={{ overflowX: 'auto' }}>
        <table className="ad-table" style={{ minWidth: 780 }}>
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input type="checkbox" checked={allSelected} aria-label="Select all"
                  onChange={() => (allSelected ? sel.clear() : sel.selectAll(visibleIds))}
                  style={{ width: 15, height: 15, accentColor: 'var(--brand)', cursor: 'pointer' }} />
              </th>
              <th>Lead</th><th>Services</th><th>Deleted on</th><th>Auto-purge in</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const ex = extraOf(l)
              const left = l.deleted_at ? daysLeft(l.deleted_at) : 60
              return (
                <tr key={l.id}>
                  <td style={{ width: 36 }}>
                    <input type="checkbox" checked={sel.selected.has(l.id)} aria-label="Select record"
                      onChange={() => sel.toggle(l.id)}
                      style={{ width: 15, height: 15, accentColor: 'var(--brand)', cursor: 'pointer' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{l.name || '-'}</div>
                    <div className="ad-soft" style={{ fontSize: 12 }}>{l.public_id || `#${l.id}`} · {l.email}{l.company ? ` · ${l.company}` : ''}</div>
                  </td>
                  <td className="ad-mut" style={{ fontSize: 12.5 }}>{serviceNames(ex.services) || '-'}</td>
                  <td className="ad-soft" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{fmtDateTime(l.deleted_at)}</td>
                  <td>
                    <span className={`ad-badge ${left <= 7 ? 'red' : 'grey'}`}>{left} day{left === 1 ? '' : 's'}</span>
                  </td>
                </tr>
              )
            })}
            {leads.length === 0 && !loading && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 36 }} className="ad-soft">The Delete Folder is empty.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmDestroy && (
        <div className="ad-overlay" onClick={() => !busy && setConfirmDestroy(false)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()} style={{ border: '1px solid #f0a9ad' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <AlertTriangle size={20} style={{ color: 'var(--brand-ink)', flexShrink: 0 }} />
              <h3 style={{ margin: 0, color: 'var(--brand-ink)' }}>Permanently delete {sel.selected.size} record{sel.selected.size === 1 ? '' : 's'}?</h3>
            </div>
            <p style={{ fontSize: 13.5, margin: '4px 0 8px' }}>
              You are attempting to <b>permanently delete</b> {sel.selected.size === 1 ? 'this record' : 'these records'},
              including all marketing and consent data.
            </p>
            <p className="ad-mut" style={{ fontSize: 13.5, marginBottom: 18 }}>
              This cannot be undone. You will <b>never</b> be able to recover {sel.selected.size === 1 ? 'it' : 'them'}.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button disabled={busy} className="ad-btn-ghost" onClick={() => setConfirmDestroy(false)}>Keep {sel.selected.size === 1 ? 'it' : 'them'}</button>
              <button disabled={busy} className="ad-btn-danger" onClick={() => bulk('destroy')}>
                {busy ? 'Deleting…' : 'Delete forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
