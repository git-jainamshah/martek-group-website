'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { getTrafficData } from '@/analytics/traffic-identification'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneValid = (p: string) => (p.match(/\d/g) ?? []).length >= 7

const SERVICES = [
  { value: 'web', label: 'Web' },
  { value: 'data', label: 'Data' },
  { value: 'social', label: 'Social' },
  { value: 'seo', label: 'SEO & Ads' },
  { value: 'engineering', label: 'Engineering' },
]

export default function LeadForm({ idPrefix = 'hs' }: { idPrefix?: string }) {
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [invalid, setInvalid] = useState<{ name?: boolean; email?: boolean; phone?: boolean; services?: boolean; consent?: boolean }>({})
  const [done, setDone] = useState(false)
  const [consent, setConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // prefill service from ?service= query string (ported from site.js)
  useEffect(() => {
    const svc = searchParams?.get('service')
    if (svc && SERVICES.some((s) => s.value === svc)) {
      setServices((prev) => (prev.includes(svc) ? prev : [...prev, svc]))
    }
  }, [searchParams])

  const toggleService = (value: string) => {
    setServices((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
    setInvalid((prev) => ({ ...prev, services: false }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const bad = {
      name: name.trim() === '',
      email: !EMAIL_RE.test(email.trim()),
      phone: !phoneValid(phone),
      services: services.length === 0,
      consent: !consent,
    }
    setInvalid(bad)
    const form = e.target as HTMLFormElement
    if (bad.name || bad.email || bad.phone || bad.services || bad.consent) {
      const firstBad = form.querySelector('.field.invalid') || form
      const top = firstBad.getBoundingClientRect().top + window.pageYOffset - 140
      window.scrollTo({ top, behavior: 'smooth' })
      return
    }
    setSending(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, message, services, consent,
          formType: 'contact',
          sourcePage: window.location.pathname + window.location.search,
          traffic: getTrafficData(),
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setSubmitError(d.error || 'Something went wrong - please try again.')
        return
      }
      setDone(true)
      const top = form.getBoundingClientRect().top + window.pageYOffset - 120
      window.scrollTo({ top, behavior: 'smooth' })
    } catch {
      setSubmitError('Network hiccup - please try again.')
    } finally {
      setSending(false)
    }
  }

  const firstName = name.trim().split(' ')[0] || 'friend'

  return (
    <form className={`lead-form${done ? ' done' : ''}`} noValidate onSubmit={handleSubmit}>
      <div className="form-body">
        <div className="form-head">
          <h3>
            Start the <span className="it">conversation</span>
          </h3>
          <p>Four quick fields. The rest we&apos;ll cover on the call.</p>
        </div>

        <div className={`field${invalid.name ? ' invalid' : ''}`}>
          <label htmlFor={`${idPrefix}-name`}>
            Name <span className="req">*</span>
          </label>
          <input
            type="text"
            id={`${idPrefix}-name`}
            name="name"
            placeholder="Your name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setInvalid((prev) => ({ ...prev, name: false }))
            }}
          />
          <span className="err">Please tell us your name.</span>
        </div>

        <div className={`field${invalid.email ? ' invalid' : ''}`}>
          <label htmlFor={`${idPrefix}-email`}>
            Email <span className="req">*</span>
          </label>
          <input
            type="email"
            id={`${idPrefix}-email`}
            name="email"
            placeholder="you@company.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setInvalid((prev) => ({ ...prev, email: false }))
            }}
          />
          <span className="err">A valid email helps us reply.</span>
        </div>

        <div className={`field${invalid.phone ? ' invalid' : ''}`}>
          <label htmlFor={`${idPrefix}-phone`}>
            Phone <span className="req">*</span>
          </label>
          <input
            type="tel"
            id={`${idPrefix}-phone`}
            name="phone"
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setInvalid((prev) => ({ ...prev, phone: false }))
            }}
          />
          <span className="err">A phone number helps us reach you.</span>
        </div>

        <div className={`field${invalid.services ? ' invalid' : ''}`}>
          <label>
            What do you need help with? <span className="req">*</span>
          </label>
          <div className="chips">
            {SERVICES.map((s) => (
              <label key={s.value} className={services.includes(s.value) ? 'checked' : undefined} htmlFor={`${idPrefix}-${s.value}`}>
                <input
                  type="checkbox"
                  id={`${idPrefix}-${s.value}`}
                  name="service"
                  value={s.value}
                  checked={services.includes(s.value)}
                  onChange={() => toggleService(s.value)}
                />
                <span className="dot"></span>
                {s.label}
              </label>
            ))}
          </div>
          <span className="err">Pick at least one.</span>
        </div>

        <div className="field">
          <label htmlFor={`${idPrefix}-message`}>
            Anything else?{' '}
            <span style={{ color: 'var(--ink-soft)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </label>
          <textarea
            id={`${idPrefix}-message`}
            name="message"
            rows={3}
            placeholder="A sentence on what you're building & what's stuck."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className={`field${invalid.consent ? ' invalid' : ''}`}>
          <label htmlFor={`${idPrefix}-consent`} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textTransform: 'none', letterSpacing: 0, cursor: 'pointer', fontSize: 13, lineHeight: 1.5 }}>
            <input
              type="checkbox"
              id={`${idPrefix}-consent`}
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked)
                setInvalid((p) => ({ ...p, consent: false }))
              }}
              style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0, accentColor: 'var(--brand)' }}
            />
            <span>
              I consent to sharing my personal details and agree to the{' '}
              <a href="/terms" target="_blank" style={{ textDecoration: 'underline' }}>Terms of Service</a> and{' '}
              <a href="/privacy" target="_blank" style={{ textDecoration: 'underline' }}>Privacy Policy</a>. <span className="req">*</span>
            </span>
          </label>
          <span className="err">Please tick the consent box so we can process your enquiry.</span>
        </div>

        {submitError && <p style={{ color: '#c0392b', fontSize: 14, marginBottom: 12 }}>{submitError}</p>}

        <button type="submit" className="form-submit" disabled={sending}>
          {sending ? 'Sending…' : 'Request my call'}
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11 L11 3 M5 3 H11 V9" />
          </svg>
        </button>
      </div>

      <div className={`form-success${done ? ' show' : ''}`}>
        <div className="tick">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="2.4">
            <path d="M4 12 L10 18 L20 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3>
          Got it, <span className="it">{firstName}</span>.
        </h3>
        <p>
          Your request landed in our inbox. We&apos;ll reply from a real human address within a few hours to lock in a
          time.
        </p>
      </div>
    </form>
  )
}
