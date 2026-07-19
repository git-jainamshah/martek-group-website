'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Field } from '@/components/admin/ui'

type Company = {
  name: string; tagline: string
  addressLine1: string; addressLine2: string
  email: string; phone: string
  logoFull: string; logoIcon: string
}

export default function CompanyPage() {
  const [c, setC] = useState<Company | null>(null)
  const [photos, setPhotos] = useState<{ id: number; relPath: string; filename: string }[]>([])
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings?key=company').then((r) => r.json()).then((d) => d.value && setC(d.value))
    fetch('/api/admin/media').then((r) => r.json()).then((d) =>
      setPhotos((d.media || []).filter((m: any) => m.kind === 'photo'))
    )
  }, [])

  async function save() {
    if (!c) return
    setBusy(true)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'company', value: c }),
    })
    setBusy(false)
    setToast(res.ok ? 'Company profile saved — live within a minute.' : 'Save failed.')
    setTimeout(() => setToast(''), 4000)
  }

  if (!c) return <p className="ad-mut" style={{ fontSize: 14 }}>Loading…</p>

  const logoPicker = (field: 'logoFull' | 'logoIcon', label: string, hint: string) => (
    <div>
      <label className="ad-label">{label}</label>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: 14, border: '1px solid var(--rule)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
          {c[field] ? <img src={c[field]} alt={label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : <span className="ad-soft" style={{ fontSize: 11 }}>none</span>}
        </div>
        <div style={{ flex: 1 }}>
          <select className="ad-input" value={c[field]} onChange={(e) => setC({ ...c, [field]: e.target.value })}>
            <option value="">— pick from Storage —</option>
            {photos.map((p) => <option key={p.id} value={p.relPath}>{p.filename}</option>)}
          </select>
          <p className="ad-soft" style={{ fontSize: 12, marginTop: 6 }}>{hint}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="ad-kicker">Settings</div>
          <h1>Company <span className="it">profile</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 8 }}>
            The company details used across the site — footer, navigation, contact info, and search-engine data.
          </p>
        </div>
        <button onClick={save} disabled={busy} className="ad-btn"><Save size={15} /> {busy ? 'Saving…' : 'Save profile'}</button>
      </div>

      {toast && <div className="ad-alert ok" style={{ marginBottom: 16 }}>{toast}</div>}

      <div className="ad-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Field label="Company name">
          <input className="ad-input" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} />
        </Field>
        <Field label="Tagline">
          <input className="ad-input" value={c.tagline} onChange={(e) => setC({ ...c, tagline: e.target.value })} />
        </Field>
        <Field label="Address line 1">
          <input className="ad-input" value={c.addressLine1} onChange={(e) => setC({ ...c, addressLine1: e.target.value })} />
        </Field>
        <Field label="Address line 2">
          <input className="ad-input" value={c.addressLine2} onChange={(e) => setC({ ...c, addressLine2: e.target.value })} />
        </Field>
        <Field label="Contact email">
          <input type="email" className="ad-input" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} />
        </Field>
        <Field label="Contact phone">
          <input className="ad-input" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} placeholder="+1 (___) ___-____" />
        </Field>
        <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {logoPicker('logoFull', 'Full logo', 'Wide logo — used for link previews & sharing.')}
          {logoPicker('logoIcon', 'Icon / mark', 'Square mark — used in the navigation bar and footer.')}
        </div>
      </div>
    </div>
  )
}
