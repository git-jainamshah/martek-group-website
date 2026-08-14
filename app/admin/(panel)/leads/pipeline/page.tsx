'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Flame, Snowflake, AlarmClock, UserPlus, Settings2 } from 'lucide-react'
import { shortAge, COLD_AFTER_DAYS, STALE_AFTER_DAYS, HOT_BUDGET } from '@/lib/admin/pipeline'

/**
 * Pipeline: who owns what, what is overdue, and what is going cold.
 *
 * The default view is "needs action, oldest first" rather than newest-first.
 * A list sorted by newest hides exactly the leads this page exists to surface.
 */

type Lead = {
  id: number; publicId: string | null; name: string | null; company: string | null
  email: string | null; status: string; ownerId: number | null; ownerName: string | null
  budgetMax: number | null; timeline: string | null; lastActivityAt: string
  idleDays: number | null; openMentions: number; temperature: 'hot' | 'warm' | 'cold'
  needsAction: boolean
}
type Owner = { id: number; first_name: string; last_name: string; role: string }
type OwnerRow = { ownerId: number | null; ownerName: string; total: number; needsAction: number; hot: number; cold: number; oldestIdleDays: number }

const TEMP_BADGE: Record<string, string> = { hot: 'ad-badge red', warm: 'ad-badge amber', cold: 'ad-badge blue' }
const STATUS_LABELS: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified', won: 'Won', lost: 'Lost',
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [byOwner, setByOwner] = useState<OwnerRow[]>([])
  const [owners, setOwners] = useState<Owner[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [defaultOwnerId, setDefaultOwnerId] = useState<number | null>(null)
  const [canAssign, setCanAssign] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [ownerFilter, setOwnerFilter] = useState<string>('all')
  const [view, setView] = useState<'action' | 'hot' | 'cold' | 'all'>('action')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/leads/pipeline', { cache: 'no-store' })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) return
      setLeads(d.leads || []); setByOwner(d.byOwner || []); setOwners(d.owners || [])
      setSummary(d.summary); setDefaultOwnerId(d.defaultOwnerId ?? null)
      setCanAssign(!!d.canAssign); setIsAdmin(!!d.isAdmin)
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const shown = useMemo(() => {
    let out = leads.filter((l) => l.status !== 'won' && l.status !== 'lost')
    if (ownerFilter !== 'all') {
      out = ownerFilter === 'none'
        ? out.filter((l) => !l.ownerId)
        : out.filter((l) => String(l.ownerId) === ownerFilter)
    }
    if (view === 'action') out = out.filter((l) => l.needsAction)
    if (view === 'hot') out = out.filter((l) => l.temperature === 'hot')
    if (view === 'cold') out = out.filter((l) => l.temperature === 'cold')
    // Oldest first: the whole point is what has been sitting longest.
    return out.sort((a, b) => (b.idleDays ?? 0) - (a.idleDays ?? 0))
  }, [leads, ownerFilter, view])

  async function reassign(leadId: number, ownerUserId: string) {
    const body = { ownerUserId: ownerUserId === 'none' ? null : Number(ownerUserId) }
    setLeads((prev) => prev.map((l) => l.id === leadId
      ? { ...l, ownerId: body.ownerUserId, ownerName: owners.find((o) => o.id === body.ownerUserId)
          ? `${owners.find((o) => o.id === body.ownerUserId)!.first_name} ${owners.find((o) => o.id === body.ownerUserId)!.last_name}` : null }
      : l))
    const r = await fetch(`/api/admin/leads/${leadId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (!r.ok) { setToast('Could not reassign - reloading'); load(); return }
    setToast('Lead reassigned')
    load()
  }

  async function saveDefaultOwner(v: string) {
    const id = v === 'none' ? null : Number(v)
    setDefaultOwnerId(id)
    const r = await fetch('/api/admin/leads/pipeline', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ defaultOwnerId: id }),
    })
    setToast(r.ok ? 'Default assignee saved' : 'Could not save the default assignee')
    if (!r.ok) load()
  }

  const Stat = ({ icon: Icon, label, value, tone, onClick, active }: any) => (
    <button
      onClick={onClick}
      className="ad-card"
      style={{
        padding: '16px 18px', textAlign: 'left', cursor: onClick ? 'pointer' : 'default',
        border: active ? '1.5px solid var(--ink)' : undefined, minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: tone, marginBottom: 6 }}>
        <Icon size={15} />
        <span className="ad-kicker" style={{ color: 'inherit' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 600, lineHeight: 1 }}>{value}</div>
    </button>
  )

  return (
    <div>
      {toast && <div className="ad-toast" role="status"><span className="dot" />{toast}</div>}

      <div style={{ marginBottom: 20 }}>
        <div className="ad-kicker">Growth</div>
        <h1>Leads <span className="it">Pipeline</span></h1>
        <p className="ad-mut" style={{ fontSize: 14, marginTop: 6, maxWidth: 640 }}>
          Who owns what, what is overdue, and what is going cold. Sorted by how long
          each lead has been sitting - longest first.
        </p>
      </div>

      {isAdmin && (
        <div className="ad-card" style={{ padding: '14px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Settings2 size={15} className="ad-mut" />
          <span style={{ fontSize: 13 }}>New leads are assigned to</span>
          <select className="ad-input ad-select-sm" value={defaultOwnerId ?? 'none'} onChange={(e) => saveDefaultOwner(e.target.value)}>
            <option value="none">Nobody (leave unassigned)</option>
            {owners.map((o) => <option key={o.id} value={o.id}>{o.first_name} {o.last_name}</option>)}
          </select>
          <span className="ad-soft" style={{ fontSize: 11.5 }}>
            Applies to new leads only. Existing leads keep their current owner.
          </span>
        </div>
      )}

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 18 }}>
          <Stat icon={AlarmClock} label="Needs action" value={summary.needsAction} tone="#b3541e"
            onClick={() => setView('action')} active={view === 'action'} />
          <Stat icon={Flame} label="Hot" value={summary.hot} tone="var(--brand-ink)"
            onClick={() => setView('hot')} active={view === 'hot'} />
          <Stat icon={Snowflake} label="Cold" value={summary.cold} tone="#4a6fa5"
            onClick={() => setView('cold')} active={view === 'cold'} />
          <Stat icon={UserPlus} label="Unassigned" value={summary.unassigned} tone="var(--ink-mut)"
            onClick={() => { setOwnerFilter('none'); setView('all') }} active={ownerFilter === 'none'} />
          <Stat icon={Users} label="All open" value={summary.open} tone="var(--ink-mut)"
            onClick={() => setView('all')} active={view === 'all'} />
        </div>
      )}

      {byOwner.length > 0 && (
        <div className="ad-card" style={{ padding: 0, marginBottom: 18, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--rule)' }}>
            <b style={{ fontSize: 13.5 }}>By owner</b>
          </div>
          <table className="w-full" style={{ width: '100%', fontSize: 13 }}>
            <thead>
              <tr className="ad-soft" style={{ textAlign: 'left', fontSize: 11 }}>
                <th style={{ padding: '9px 18px' }}>OWNER</th>
                <th style={{ padding: '9px 10px' }}>OPEN</th>
                <th style={{ padding: '9px 10px' }}>NEEDS ACTION</th>
                <th style={{ padding: '9px 10px' }}>HOT</th>
                <th style={{ padding: '9px 10px' }}>COLD</th>
                <th style={{ padding: '9px 18px' }}>OLDEST</th>
              </tr>
            </thead>
            <tbody>
              {byOwner.map((o) => (
                <tr key={String(o.ownerId ?? 'none')} style={{ borderTop: '1px solid var(--rule)', cursor: 'pointer' }}
                  onClick={() => { setOwnerFilter(o.ownerId ? String(o.ownerId) : 'none'); setView('all') }}>
                  <td style={{ padding: '10px 18px', fontWeight: 600 }}>{o.ownerName}</td>
                  <td style={{ padding: '10px 10px' }}>{o.total}</td>
                  <td style={{ padding: '10px 10px', color: o.needsAction ? '#b3541e' : undefined, fontWeight: o.needsAction ? 700 : 400 }}>
                    {o.needsAction}
                  </td>
                  <td style={{ padding: '10px 10px' }}>{o.hot}</td>
                  <td style={{ padding: '10px 10px' }}>{o.cold}</td>
                  <td style={{ padding: '10px 18px' }} className="ad-soft">{o.oldestIdleDays}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <span className="ad-kicker">Filter by owner</span>
        <select className="ad-input ad-select-sm" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
          <option value="all">Everyone</option>
          <option value="none">Unassigned</option>
          {owners.map((o) => <option key={o.id} value={o.id}>{o.first_name} {o.last_name}</option>)}
        </select>
        <span className="ad-soft" style={{ fontSize: 12, marginLeft: 'auto' }}>
          {shown.length} shown · cold after {COLD_AFTER_DAYS}d idle · nudge after {STALE_AFTER_DAYS}d · hot at ${(HOT_BUDGET / 1000)}k+
        </span>
      </div>

      <div className="ad-table-wrap">
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead>
            <tr className="ad-soft" style={{ textAlign: 'left', fontSize: 11, borderBottom: '1px solid var(--rule)' }}>
              <th style={{ padding: '10px 14px' }}>LEAD</th>
              <th style={{ padding: '10px 10px' }}>OWNER</th>
              <th style={{ padding: '10px 10px' }}>STATUS</th>
              <th style={{ padding: '10px 10px' }}>TEMP</th>
              <th style={{ padding: '10px 10px' }}>IDLE</th>
              <th style={{ padding: '10px 14px' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} style={{ padding: 18 }} className="ad-soft">Loading…</td></tr>}
            {!loading && shown.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 18 }} className="ad-soft">
                Nothing here. {view === 'action' ? 'No leads need action right now.' : 'Try a different filter.'}
              </td></tr>
            )}
            {shown.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid var(--rule)' }}>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontWeight: 600 }}>{l.name || l.publicId}</div>
                  <div className="ad-soft" style={{ fontSize: 11.5 }}>
                    {[l.company, l.email].filter(Boolean).join(' · ')}
                  </div>
                  {l.openMentions > 0 && (
                    <span className="ad-badge amber" style={{ marginTop: 4, display: 'inline-block' }}>
                      {l.openMentions} open {l.openMentions === 1 ? 'tag' : 'tags'}
                    </span>
                  )}
                </td>
                <td style={{ padding: '10px 10px' }}>
                  {canAssign ? (
                    <select className="ad-input ad-select-sm" value={l.ownerId ?? 'none'}
                      onChange={(e) => reassign(l.id, e.target.value)}>
                      <option value="none">Unassigned</option>
                      {owners.map((o) => <option key={o.id} value={o.id}>{o.first_name} {o.last_name}</option>)}
                    </select>
                  ) : (l.ownerName || <span className="ad-soft">Unassigned</span>)}
                </td>
                <td style={{ padding: '10px 10px' }}>{STATUS_LABELS[l.status] ?? l.status}</td>
                <td style={{ padding: '10px 10px' }}>
                  <span className={TEMP_BADGE[l.temperature]}>{l.temperature}</span>
                </td>
                <td style={{ padding: '10px 10px', fontWeight: l.needsAction ? 700 : 400, color: l.needsAction ? '#b3541e' : undefined }}>
                  {shortAge(l.lastActivityAt)}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                  <button className="ad-btn-ghost" onClick={() => router.push(`/admin/leads?lead=${l.id}`)}>Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
