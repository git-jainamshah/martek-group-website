'use client'

import { useEffect, useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import { Toggle } from '@/components/admin/ui'

type Social = { platform: string; label: string; href: string; enabled: boolean }

const KNOWN_PLATFORMS = ['Instagram', 'LinkedIn', 'X', 'Facebook', 'YouTube', 'TikTok', 'Pinterest', 'Threads']

export default function SocialsPage() {
  const [socials, setSocials] = useState<Social[] | null>(null)
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings?key=socials').then((r) => r.json()).then((d) => setSocials(d.value || []))
  }, [])

  async function save() {
    setBusy(true)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'socials', value: socials }),
    })
    setBusy(false)
    setToast(res.ok ? 'Social links saved — live within a minute.' : 'Save failed.')
    setTimeout(() => setToast(''), 4000)
  }

  const set = (i: number, patch: Partial<Social>) =>
    setSocials((s) => (s ? s.map((x, j) => (j === i ? { ...x, ...patch } : x)) : s))

  if (!socials) return <p className="ad-mut" style={{ fontSize: 14 }}>Loading…</p>

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="ad-kicker">Settings</div>
          <h1>Social <span className="it">links</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 8, maxWidth: 520 }}>
            Your handles across platforms. Toggle a platform off and it disappears from the live site
            (header, footer, mobile menu) — toggle on to bring it back.
          </p>
        </div>
        <button onClick={save} disabled={busy} className="ad-btn"><Save size={15} /> {busy ? 'Saving…' : 'Save links'}</button>
      </div>

      {toast && <div className="ad-alert ok" style={{ marginBottom: 16 }}>{toast}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {socials.map((s, i) => (
          <div key={i} className="ad-card" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', opacity: s.enabled ? 1 : 0.55 }}>
            <Toggle checked={s.enabled} onChange={(v) => set(i, { enabled: v })} ariaLabel={`Show ${s.platform} on site`} />
            <div style={{ width: 130 }}>
              <select className="ad-input" value={s.platform} onChange={(e) => set(i, { platform: e.target.value })}>
                {[...new Set([...KNOWN_PLATFORMS, s.platform])].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ width: 180 }}>
              <input className="ad-input" placeholder="@handle" value={s.label} onChange={(e) => set(i, { label: e.target.value })} />
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <input className="ad-input mono" placeholder="https://…" value={s.href} onChange={(e) => set(i, { href: e.target.value })} />
            </div>
            <span className={`ad-badge ${s.enabled ? 'green' : 'grey'}`}>{s.enabled ? 'On site' : 'Hidden'}</span>
            <button className="ad-icon-btn danger" title="Remove"
              onClick={() => setSocials(socials.filter((_, j) => j !== i))}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <button className="ad-btn-ghost" style={{ marginTop: 16 }}
        onClick={() => setSocials([...socials, { platform: 'Instagram', label: '', href: '', enabled: false }])}>
        <Plus size={15} /> Add platform
      </button>
    </div>
  )
}
