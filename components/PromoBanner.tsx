'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { getTrafficData } from '@/analytics/traffic-identification'
import { trackFormView, trackFormStart, trackLead } from '@/analytics/events'

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

const SEEN_KEY = 'marrelay_promo_seen'

export default function PromoBanner() {
  const [cfg, setCfg] = useState<PromoCfg | null>(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [sent, setSent] = useState(false)
  const [consent, setConsent] = useState(false)
  const [consentErr, setConsentErr] = useState(false)
  const [phoneErr, setPhoneErr] = useState(false)
  const [busy, setBusy] = useState(false)
  const startedRef = useRef(false)
  const onFirstInteract = () => {
    if (startedRef.current) return
    startedRef.current = true
    trackFormStart({ formId: 'promo-signup', formType: 'promo-banner' })
  }

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
          if (c.template === 'signup') trackFormView({ formId: 'promo-signup', formType: 'promo-banner', location: 'promo' })
        }, Math.max(0, (c.delaySeconds ?? 3) * 1000))
        return () => clearTimeout(t)
      })
      .catch(() => {})
  }, [])

  if (!cfg || !open) return null

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault()
    if ((form.phone.match(/\d/g) ?? []).length < 7) {
      setPhoneErr(true)
      return
    }
    if (!consent) {
      setConsentErr(true)
      return
    }
    setBusy(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          formType: 'promo-banner', sourcePage: window.location.pathname,
          consent: true,
          message: `Signed up via promo banner: ${cfg!.title}`,
          traffic: getTrafficData(),
        }),
      })
      await trackLead({ name: form.name, email: form.email, phone: form.phone, formType: 'promo-banner', consent: true })
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
            <p style={{ fontSize: 14, fontWeight: 600 }}>Thanks - you&apos;re on the list. Talk soon!</p>
          ) : (
            <form onSubmit={submitSignup} onFocusCapture={onFirstInteract} style={{ display: 'grid', gap: 10 }}>
              <input required placeholder="Your name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input required type="email" placeholder="Email address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              <input required type="tel" placeholder="Phone number" value={form.phone}
                onChange={(e) => { setForm({ ...form, phone: e.target.value }); setPhoneErr(false) }} style={inputStyle} />
              {phoneErr && (
                <p style={{ color: '#c0392b', fontSize: 12.5, margin: 0 }}>Please enter a valid phone number.</p>
              )}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, lineHeight: 1.45, color: '#444', cursor: 'pointer' }}>
                <input type="checkbox" checked={consent}
                  onChange={(e) => { setConsent(e.target.checked); setConsentErr(false) }}
                  style={{ marginTop: 2, width: 15, height: 15, flexShrink: 0 }} />
                <span>
                  I consent to sharing my personal details and agree to the{' '}
                  <a href="/terms" target="_blank" style={{ textDecoration: 'underline' }}>Terms</a> and{' '}
                  <a href="/privacy" target="_blank" style={{ textDecoration: 'underline' }}>Privacy Policy</a>.
                </span>
              </label>
              {consentErr && (
                <p style={{ color: '#c0392b', fontSize: 12.5, margin: 0 }}>Please tick the consent box to sign up.</p>
              )}
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
