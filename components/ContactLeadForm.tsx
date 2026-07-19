'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { getTrafficData } from '@/analytics/traffic-identification'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SERVICES = [
  { value: 'web', label: 'Web development' },
  { value: 'data', label: 'Data & analytics' },
  { value: 'social', label: 'Social' },
  { value: 'seo', label: 'SEO & ads' },
  { value: 'engineering', label: 'Engineering / CAD' },
]

const BUDGETS = [
  { value: '<5k', label: '< $5k' },
  { value: '5-15k', label: '$5–15k' },
  { value: '15-40k', label: '$15–40k' },
  { value: '40k+', label: '$40k+' },
  { value: 'unsure', label: 'Not sure yet' },
]

const TIMELINES = [
  { value: 'asap', label: 'ASAP' },
  { value: '1mo', label: 'Within a month' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'exploring', label: 'Just exploring' },
]

export default function ContactLeadForm() {
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [message, setMessage] = useState('')
  const [referral, setReferral] = useState('')
  const [invalid, setInvalid] = useState<{ name?: boolean; email?: boolean; services?: boolean; message?: boolean; consent?: boolean }>({})
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [website, setWebsite] = useState('') // honeypot - humans never see or fill this
  const [consent, setConsent] = useState(false)
  const [referralDetail, setReferralDetail] = useState('')

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
      services: services.length === 0,
      message: message.trim() === '',
      consent: !consent,
    }
    setInvalid(bad)
    const form = e.target as HTMLFormElement
    if (bad.name || bad.email || bad.services || bad.message || bad.consent) {
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
          name, email, company, message,
          services, budget, timeline, referral, referralDetail, website,
          consent,
          formType: 'contact',
          sourcePage: window.location.pathname + window.location.search,
          traffic: getTrafficData(),
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setSubmitError(d.error || 'Something went wrong - please try again or email us directly.')
        return
      }
      setDone(true)
      const top = form.getBoundingClientRect().top + window.pageYOffset - 120
      window.scrollTo({ top, behavior: 'smooth' })
    } catch {
      setSubmitError('Network hiccup - please try again or email us directly.')
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
            Tell us about the <span className="it">project</span>
          </h3>
          <p>The more you share, the sharper our first reply. Only the starred fields are required.</p>
        </div>

        <div className="form-row">
          <div className={`field${invalid.name ? ' invalid' : ''}`}>
            <label htmlFor="c-name">
              Name <span className="req">*</span>
            </label>
            <input
              type="text"
              id="c-name"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setInvalid((p) => ({ ...p, name: false }))
              }}
            />
            <span className="err">Please tell us your name.</span>
          </div>
          <div className={`field${invalid.email ? ' invalid' : ''}`}>
            <label htmlFor="c-email">
              Work email <span className="req">*</span>
            </label>
            <input
              type="email"
              id="c-email"
              name="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setInvalid((p) => ({ ...p, email: false }))
              }}
            />
            <span className="err">A valid email helps us reply.</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="c-company">
            Company <span style={{ color: 'var(--ink-soft)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </label>
          <input
            type="text"
            id="c-company"
            name="company"
            placeholder="Your company, Inc."
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className={`field${invalid.services ? ' invalid' : ''}`}>
          <label>
            Which service(s) are you interested in? <span className="req">*</span>
          </label>
          <div className="chips">
            {SERVICES.map((s) => (
              <label key={s.value} className={services.includes(s.value) ? 'checked' : undefined} htmlFor={`c-${s.value}`}>
                <input
                  type="checkbox"
                  id={`c-${s.value}`}
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
          <span className="err">Pick at least one service.</span>
        </div>

        <div className="form-row">
          <div className="field">
            <label>Budget range</label>
            <div className="chips">
              {BUDGETS.map((b) => (
                <label key={b.value} className={budget === b.value ? 'checked' : undefined} htmlFor={`b-${b.value}`}>
                  <input
                    type="radio"
                    id={`b-${b.value}`}
                    name="budget"
                    value={b.value}
                    checked={budget === b.value}
                    onChange={() => setBudget(b.value)}
                  />
                  <span className="dot"></span>
                  {b.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="field">
          <label>Timeline</label>
          <div className="chips">
            {TIMELINES.map((t) => (
              <label key={t.value} className={timeline === t.value ? 'checked' : undefined} htmlFor={`t-${t.value}`}>
                <input
                  type="radio"
                  id={`t-${t.value}`}
                  name="timeline"
                  value={t.value}
                  checked={timeline === t.value}
                  onChange={() => setTimeline(t.value)}
                />
                <span className="dot"></span>
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div className={`field${invalid.message ? ' invalid' : ''}`}>
          <label htmlFor="c-message">
            Project description <span className="req">*</span>
          </label>
          <textarea
            id="c-message"
            name="message"
            rows={5}
            placeholder="What are you building? What's working, what's stuck, and what does 'done' look like? A scrappy paragraph is perfect."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              setInvalid((p) => ({ ...p, message: false }))
            }}
          />
          <span className="err">A sentence or two gets us started.</span>
        </div>

        <div className="field">
          <label htmlFor="c-referral">How did you hear about us?</label>
          <select id="c-referral" name="referral" value={referral} onChange={(e) => setReferral(e.target.value)}>
            <option value="">Select one…</option>
            <option value="referral">A friend / referral</option>
            <option value="google">Google search</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="twitter">X / Twitter</option>
            <option value="event">An event or meetup</option>
            <option value="other">Other</option>
          </select>
          {referral === 'referral' && (
            <div style={{ marginTop: 10 }}>
              <label htmlFor="c-referral-detail">Who referred you?</label>
              <input
                type="text"
                id="c-referral-detail"
                name="referralDetail"
                placeholder="Their name or company, so we can thank them"
                value={referralDetail}
                onChange={(e) => setReferralDetail(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* honeypot - hidden from humans, catches bots */}
        <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
          <label htmlFor="c-website">Website</label>
          <input type="text" id="c-website" name="website" tabIndex={-1} autoComplete="off"
            value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div className={`field${invalid.consent ? ' invalid' : ''}`} style={{ marginTop: 4 }}>
          <label htmlFor="c-consent" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textTransform: 'none', letterSpacing: 0, cursor: 'pointer', fontSize: 13.5, lineHeight: 1.5 }}>
            <input
              type="checkbox"
              id="c-consent"
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

        {submitError && (
          <p style={{ color: '#c0392b', fontSize: 14, marginBottom: 12 }}>{submitError}</p>
        )}

        <button type="submit" className="form-submit" disabled={sending}>
          {sending ? 'Sending…' : 'Request my discovery call'}
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
          Thanks, <span className="it">{firstName}</span>, got it.
        </h3>
        <p>
          Your project brief just landed in our inbox. A real human will reply within a few hours (work hours) with a
          couple of times for the call.
        </p>
        <div className="next">
          <span>Typical reply: under 2 hours</span>
          <span>Check your inbox, and your spam, just in case</span>
          <span>Toronto, Canada</span>
        </div>
      </div>
    </form>
  )
}
