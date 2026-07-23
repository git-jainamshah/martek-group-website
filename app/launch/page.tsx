import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import ContactLeadForm from '@/components/ContactLeadForm'

export const metadata: Metadata = {
  title: 'Launch Offer — 30% Off Your First Project · Marrelay',
  description:
    'Our launch offer: a flat 30% off for the first 3 clients. Web, data & analytics, social, SEO & ads, and engineering/CAD — founder-led, fixed-price, Toronto-based. Claim a spot below.',
  alternates: { canonical: '/launch' },
  openGraph: {
    title: 'Launch Offer — 30% Off Your First Project · Marrelay',
    description: 'Flat 30% off for the first 3 clients. Claim a spot — founder-led, fixed-price, Toronto-based.',
    url: '/launch',
    images: [{ url: '/assets/martek-group-header.png', width: 1200, height: 630, alt: 'Marrelay launch offer' }],
  },
  // Paid-social landing — keep it out of the index so it doesn't compete with core pages.
  robots: { index: false, follow: true },
}

const PRODUCTS = [
  {
    tag: 'Web',
    color: 'var(--terra)',
    title: 'Web development',
    blurb: 'Fast, custom sites and web apps in React & Next.js — you own the code.',
    points: ['Marketing sites & landing pages', 'Custom web apps & dashboards', 'E-commerce & headless CMS'],
  },
  {
    tag: 'Data',
    color: '#3D7D6E',
    title: 'Data & analytics',
    blurb: 'Clean tracking and dashboards so you can actually see what’s working.',
    points: ['GA4 & server-side tagging', 'Executive dashboards', 'Reporting & attribution'],
  },
  {
    tag: 'Social',
    color: '#C58A2E',
    title: 'Social media',
    blurb: 'Content and community management that keeps your brand consistent.',
    points: ['Content calendars', 'Creative & short-form video', 'Community management'],
  },
  {
    tag: 'SEO & Ads',
    color: '#5A6BC0',
    title: 'SEO & paid ads',
    blurb: 'Get found and convert — technical SEO plus Google & Meta ad management.',
    points: ['Technical SEO audits', 'Google & Meta ads', 'Landing-page optimisation'],
  },
  {
    tag: 'CAD',
    color: '#8A6FB0',
    title: 'Engineering & CAD',
    blurb: 'Precision drafting and 3D modelling for industrial and civil projects.',
    points: ['CAD / CAM drafting', '3D parametric modelling', 'Technical specifications'],
  },
]

export default function LaunchPage() {
  return (
    <>
      {/* HERO / OFFER */}
      <section className="contact-hero" style={{ paddingTop: 44 }}>
        <div className="wrap">
          <div className="head" data-reveal>
            <div className="trust-strip" style={{ paddingTop: 0, marginBottom: 12 }}>
              <span
                style={{
                  fontFamily: 'var(--mono)', fontSize: 11.5, letterSpacing: '.14em', textTransform: 'uppercase',
                  color: 'var(--paper)', background: 'var(--brand)', padding: '6px 12px', borderRadius: 999,
                }}
              >
                Launch offer · limited to 3 clients
              </span>
            </div>
            <h1>
              Get <span className="hl">30% off</span> your
              <br />
              first project with us.
            </h1>
            <p className="lede">
              We’re opening the doors — and the first <b style={{ color: 'var(--ink)' }}>3 clients</b> get a flat{' '}
              <b style={{ color: 'var(--ink)' }}>30% off</b> any project, across every service we offer. Founder-led,
              fixed-price, and Toronto-based. Once the 3 spots are gone, they’re gone.
            </p>
            <div className="trust-strip">
              <span className="stars">✦</span>
              <span className="t">Fixed-price quotes</span>
              <span className="t">· you own everything</span>
              <span className="t">· replies in &lt;2 hrs</span>
            </div>
            <div style={{ marginTop: 26, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href="#form"
                className="form-submit"
                style={{ width: 'auto', display: 'inline-flex', textDecoration: 'none' }}
              >
                Claim my 30% off
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 11 L11 3 M5 3 H11 V9" />
                </svg>
              </a>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-mut)' }}>
                No commitment — just a quick chat.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW THE OFFER WORKS */}
      <div className="wrap" style={{ marginTop: 40 }}>
        <div
          data-reveal
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}
        >
          {[
            { n: '30%', t: 'Flat discount', d: 'A straight 30% off your project total — no tiers, no fine print.' },
            { n: '3', t: 'Clients only', d: 'The offer is capped at the first three clients who book with us.' },
            { n: 'All', t: 'Services eligible', d: 'Web, data, social, SEO & ads, or engineering/CAD — your pick.' },
          ].map((c) => (
            <div key={c.t} className="aside-card" style={{ marginBottom: 0 }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 44, lineHeight: 1, color: 'var(--brand-ink)' }}>
                {c.n}
              </div>
              <div style={{ fontWeight: 600, marginTop: 10, fontSize: 15 }}>{c.t}</div>
              <p style={{ marginTop: 6, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS / WHAT WE SELL */}
      <div className="wrap" style={{ marginTop: 56 }}>
        <div className="head" data-reveal style={{ maxWidth: 640 }}>
          <div className="kicker">What you can put the 30% toward</div>
          <h2
            style={{
              fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(30px,4vw,46px)', lineHeight: 1.02,
              letterSpacing: '-.02em', marginTop: 8,
            }}
          >
            Everything we build.
          </h2>
        </div>

        <div
          data-reveal
          style={{
            marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18,
          }}
        >
          {PRODUCTS.map((p) => (
            <div
              key={p.title}
              className="aside-card"
              style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}
            >
              <span
                style={{
                  alignSelf: 'flex-start', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.12em',
                  textTransform: 'uppercase', color: 'var(--paper)', background: p.color, padding: '5px 11px',
                  borderRadius: 999,
                }}
              >
                {p.tag}
              </span>
              <h3 style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontWeight: 400, fontSize: 25, marginTop: 14 }}>
                {p.title}
              </h3>
              <p style={{ marginTop: 8, fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>{p.blurb}</p>
              <ul style={{ marginTop: 14, listStyle: 'none', padding: 0, display: 'grid', gap: 9 }}>
                {p.points.map((pt) => (
                  <li
                    key={pt}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--ink-mut)' }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: p.color, flexShrink: 0 }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div className="wrap" style={{ marginTop: 60 }}>
        <div className="head" data-reveal style={{ maxWidth: 640 }}>
          <div className="kicker">Claim your spot</div>
          <h2
            style={{
              fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(30px,4vw,46px)', lineHeight: 1.02,
              letterSpacing: '-.02em', marginTop: 8,
            }}
          >
            Tell us about the project.
          </h2>
          <p className="lede" style={{ marginTop: 14 }}>
            Fill this in and we’ll reply within a few hours. Mention that you came from the launch offer and we’ll lock in
            your 30% — while spots last.
          </p>
        </div>

        <div className="lead-wrap" id="form" data-reveal style={{ marginTop: 22, maxWidth: 760 }}>
          <Suspense fallback={null}>
            <ContactLeadForm />
          </Suspense>
        </div>

        <p style={{ margin: '18px 0 60px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-mut)' }}>
          Prefer email? <Link href="/contact" style={{ textDecoration: 'underline' }}>Reach us here</Link>. Offer valid
          for the first three new clients only.
        </p>
      </div>
    </>
  )
}
