'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import { fmtRelative } from '@/lib/admin/dates'

/**
 * Notification bell + "waiting on you" queue.
 *
 * Polls rather than holding a socket open: this is an internal panel used by a
 * handful of people, and a 60s poll costs one cheap indexed query per user.
 * A websocket would be more machinery than the problem deserves.
 */

type Item = {
  id: number
  kind: string
  lead_id: number | null
  preview: string | null
  created_at: string
  read_at: string | null
  lead_name: string | null
  lead_public_id: string | null
  actor_first: string | null
  actor_last: string | null
}
type Waiting = { lead_id: number; since: string; lead_name: string; lead_public_id: string }

export default function NotificationBell({ collapsed = false }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [waiting, setWaiting] = useState<Waiting[]>([])
  const [unread, setUnread] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/notifications', { cache: 'no-store' })
      if (!r.ok) return
      const d = await r.json()
      setItems(d.items || []); setWaiting(d.waiting || []); setUnread(d.unread || 0)
    } catch { /* a failed poll is not worth surfacing */ }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 60_000)
    return () => clearInterval(t)
  }, [load])

  // Close on outside click and on Escape, so the popover never traps focus.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  async function markAll() {
    setUnread(0)
    setItems((prev) => prev.map((i) => ({ ...i, read_at: i.read_at ?? new Date().toISOString() })))
    await fetch('/api/admin/notifications', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ all: true }),
    }).catch(() => {})
  }

  async function openItem(n: Item) {
    if (!n.read_at) {
      setUnread((u) => Math.max(0, u - 1))
      fetch('/api/admin/notifications', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id }),
      }).catch(() => {})
    }
    setOpen(false)
    // Deep-link straight to the lead so the tag is one click from the work.
    if (n.lead_id) router.push(`/admin/leads?lead=${n.lead_id}`)
  }

  return (
    /* Rendered as a nav row rather than squeezed into the sidebar header:
       at 264px the header could not fit the logo, the wordmark, this button
       and the collapse toggle without truncating the brand. */
    <div className="ad-bell" ref={wrapRef}>
      <button
        className="ad-nav-item ad-bell-row" onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        title={collapsed ? 'Notifications' : undefined}
      >
        <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
          <Bell />
          {unread > 0 && <span className="ad-bell-count">{unread > 9 ? '9+' : unread}</span>}
        </span>
        {!collapsed && <span>Notifications</span>}
        {!collapsed && unread > 0 && <span className="ad-bell-pill">{unread}</span>}
      </button>

      {open && (
        <div className="ad-bell-pop" role="dialog" aria-label="Notifications">
          <div className="ad-bell-head">
            <b>Notifications</b>
            {unread > 0 && <button className="ad-link-btn" style={{ marginTop: 0 }} onClick={markAll}>Mark all read</button>}
          </div>

          {waiting.length > 0 && (
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--rule)', background: '#fdf3e3' }}>
              <div className="ad-soft" style={{ fontSize: 11, marginBottom: 6, color: '#7a5a1c' }}>
                WAITING ON YOU ({waiting.length})
              </div>
              {waiting.slice(0, 4).map((w) => (
                <button
                  key={w.lead_id} className="ad-link-btn"
                  style={{ display: 'block', marginTop: 3, color: '#7a5a1c' }}
                  onClick={() => { setOpen(false); router.push(`/admin/leads?lead=${w.lead_id}`) }}
                >
                  {w.lead_name || w.lead_public_id} · tagged {fmtRelative(w.since)}
                </button>
              ))}
            </div>
          )}

          <div className="ad-bell-list">
            {items.length === 0 && (
              <div style={{ padding: '18px 14px', fontSize: 12.5 }} className="ad-soft">
                Nothing yet. You will be notified when someone tags you on a lead.
              </div>
            )}
            {items.map((n) => (
              <button key={n.id} className={`ad-bell-item${n.read_at ? '' : ' unread'}`} onClick={() => openItem(n)}>
                <div>
                  <b>{[n.actor_first, n.actor_last].filter(Boolean).join(' ') || 'Someone'}</b>
                  {n.kind === 'reply' ? ' replied on ' : ' tagged you on '}
                  <b>{n.lead_name || n.lead_public_id || 'a lead'}</b>
                </div>
                {n.preview && (
                  <div className="ad-soft" style={{ marginTop: 3, fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.preview}
                  </div>
                )}
                <div className="ad-soft" style={{ marginTop: 3, fontSize: 11 }}>{fmtRelative(n.created_at)}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
