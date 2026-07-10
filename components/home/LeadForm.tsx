'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  const [services, setServices] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [invalid, setInvalid] = useState<{ name?: boolean; email?: boolean; services?: boolean }>({})
  const [done, setDone] = useState(false)

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const bad = {
      name: name.trim() === '',
      email: !EMAIL_RE.test(email.trim()),
      services: services.length === 0,
    }
    setInvalid(bad)
    if (bad.name || bad.email || bad.services) {
      const firstBad = (e.target as HTMLFormElement).querySelector('.field.invalid') || (e.target as HTMLFormElement)
      const top = firstBad.getBoundingClientRect().top + window.pageYOffset - 140
      window.scrollTo({ top, behavior: 'smooth' })
      return
    }
    setDone(true)
    const form = e.target as HTMLFormElement
    const top = form.getBoundingClientRect().top + window.pageYOffset - 120
    window.scrollTo({ top, behavior: 'smooth' })
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
            Work email <span className="req">*</span>
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

        <button type="submit" className="form-submit">
          Request my call
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 11 L11 3 M5 3 H11 V9" />
          </svg>
        </button>
        <p className="form-foot">
          <span className="lock">🔒</span> No spam, ever. We reply personally within a few hours.
        </p>
      </div>

      <div className={`form-success${done ? ' show' : ''}`}>
        <div className="tick">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="2.4">
            <path d="M4 12 L10 18 L20 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3>
          Got it, <span className="it">{firstName}</span> ✦
        </h3>
        <p>
          Your request landed in our inbox. We&apos;ll reply from a real human address within a few hours to lock in a
          time.
        </p>
        <div className="next">
          <span>⏱ Typical reply: under 2 hours (work hours)</span>
          <span>📍 Toronto, Canada</span>
        </div>
      </div>
    </form>
  )
}
