'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

type PromoCfg = {
  enabled: boolean
  template: 'copy' | 'picture' | 'signup'
  title: string
  body: string
  imageUrl: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  delaySeconds: number
  frequency: 'once-per-session' | 'every-visit'
}

const SEEN_KEY = 'martek_promo_seen'

export default function PromoBanner() {
  const [cfg, setCfg] = useState<PromoCfg | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/public/site-config')
      .then((r) => r.json())
      .then((d) => {
        const c: PromoCfg | null = d.promoBanner
        if (!c?.enabled) return
        if (c.frequency === 'once-per-session' && sessionStorage.getItem(SEEN_KEY)) return
        setCfg(c)
        const t = setTimeout(() => {
          setOpen(true)
          sessionStorage.setItem(SEEN_KEY, '1')
        }, Math.max(0, (c.delaySeconds ?? 3) * 1000))
        return () => clearTimeout(t)
      })
      .catch(() => {})
  }, [])

  if (!cfg || !open) return null

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email,
          formType: 'promo-banner', sourcePage: window.location.pathname,
          message: `Signed up via promo banner: ${cfg!.title}`,
        }),
      })
      setSent(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={overlay} onClick={() => setOpen(false)} role="dialog" aria-modal="true">
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setOpen(false)} style={closeBtn} aria-label="Close">
          <X size={18} />
        </button>

        {cfg.template === 'picture' && cfg.imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={cfg.imageUrl} alt={cfg.title} style={{ width: '100%', borderRadius: 12, marginBottom: 16, display: 'block' }} />
        )}

        <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>{cfg.title}</h3>
        {cfg.body && <p style={{ margin: '0 0 18px', fontSize: 14, opacity: 0.75, lineHeight: 1.55 }}>{cfg.body}</p>}

        {cfg.template === 'signup' ? (
          sent ? (
            <p style={{ fontSize: 14, fontWeight: 600 }}>Thanks — you&apos;re on the list. Talk soon!</p>
          ) : (
            <form onSubmit={submitSignup} style={{ display: 'grid', gap: 10 }}>
              <input required placeholder="Your name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input required type="email" placeholder="Email address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              <button disabled={busy} style={primaryBtn}>{busy ? 'Sending…' : cfg.primaryLabel || 'Sign up'}</button>
            </form>
          )
        ) : (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {cfg.primaryLabel && (
              <Link href={cfg.primaryHref || '/contact'} style={primaryBtn} onClick={() => setOpen(false)}>
                {cfg.primaryLabel}
              </Link>
            )}
            {cfg.secondaryLabel && (
              <Link href={cfg.secondaryHref || '/'} style={secondaryBtn} onClick={() => setOpen(false)}>
                {cfg.secondaryLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 9999,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
}
const card: React.CSSProperties = {
  position: 'relative', background: '#fff', color: '#111', borderRadius: 16,
  padding: 28, width: '100%', maxWidth: 440, boxShadow: '0 24px 80px rgba(0,0,0,.35)',
}
const closeBtn: React.CSSProperties = {
  position: 'absolute', top: 12, right: 12, background: 'transparent', border: 0,
  cursor: 'pointer', color: '#666', padding: 6,
}
const inputStyle: React.CSSProperties = {
  border: '1px solid #ddd', borderRadius: 10, padding: '10px 12px', fontSize: 14,
}
const primaryBtn: React.CSSProperties = {
  background: '#111', color: '#fff', borderRadius: 999, padding: '10px 20px',
  fontSize: 14, fontWeight: 700, border: 0, cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
}
const secondaryBtn: React.CSSProperties = {
  background: 'transparent', color: '#111', borderRadius: 999, padding: '10px 20px',
  fontSize: 14, fontWeight: 700, border: '1px solid #ccc', cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
}
