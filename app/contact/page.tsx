import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import ContactLeadForm from '@/components/ContactLeadForm'

export const metadata: Metadata = {
  title: 'Contact · Martek Group',
  description:
    "Let's book a discovery call. Fill this in and we'll reply within a few hours with a couple of times that work.",
}

export default function ContactPage() {
  return (
    <>
      <section className="contact-hero">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Contact</span>
          </div>
          <div className="head" style={{ paddingTop: 24 }} data-reveal>
            <h1>
              Let&apos;s book a <span className="hl">discovery call</span>.
            </h1>
            <p className="lede">
              Fill this in and we&apos;ll reply within a few hours with a couple of times that work. It takes about two
              minutes, and a real person reads every word.
            </p>
            <div className="trust-strip">
              <span className="stars">★★★★★</span>
              <span className="t">5.0 across 17 founders</span>
              <span className="t">· 0 missed deadlines</span>
              <span className="t">· replies in &lt;2 hrs</span>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="contact-grid">
          {/* ASIDE */}
          <aside data-reveal>
            <div className="aside-card">
              <h4>What happens next</h4>
              <ul className="what-next">
                <li>
                  <span className="n">1</span>
                  <div>
                    <b>We reply, fast</b>
                    <span>A real human emails you back within a few hours (work hours) to find a time.</span>
                  </div>
                </li>
                <li>
                  <span className="n">2</span>
                  <div>
                    <b>30-min discovery call</b>
                    <span>No pitch deck. We learn the goal and tell you honestly if we&apos;re a fit.</span>
                  </div>
                </li>
                <li>
                  <span className="n">3</span>
                  <div>
                    <b>One-page proposal</b>
                    <span>Scope, price, and timeline on a single page within 3 working days.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="aside-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div
                className="media-frame"
                style={{ border: 0, borderRadius: 0, boxShadow: 'none', aspectRatio: '4/3' }}
              >
                <span className="img-slot" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/contact-us-form.jpg" alt="The Martek team on a call" />
                </span>
              </div>
            </div>

            <div className="aside-card">
              <h4>Or reach us directly</h4>
              <div className="contact-lines">
                <a href="mailto:hello@martek.studio">
                  <span className="ic">
                    <svg viewBox="0 0 20 20" fill="none" stroke="var(--ink)" strokeWidth="1.6">
                      <rect x="2" y="4" width="16" height="12" rx="2" />
                      <path d="M3 5 L10 11 L17 5" />
                    </svg>
                  </span>
                  <span>
                    <b>Email</b>hello@martek.studio
                  </span>
                </a>
                <a href="#">
                  <span className="ic">
                    <svg viewBox="0 0 20 20" fill="none" stroke="var(--ink)" strokeWidth="1.6">
                      <rect x="3" y="3" width="14" height="14" rx="3" />
                      <circle cx="10" cy="10" r="3.4" />
                      <circle cx="14.4" cy="5.6" r="1" fill="var(--ink)" stroke="none" />
                    </svg>
                  </span>
                  <span>
                    <b>Instagram</b>@martek.studio
                  </span>
                </a>
                <a href="#">
                  <span className="ic">
                    <svg viewBox="0 0 20 20" fill="none" stroke="var(--ink)" strokeWidth="1.6">
                      <rect x="3" y="3" width="14" height="14" rx="2" />
                      <path
                        d="M6 8.5 V14 M6 5.6 V5.7 M9.5 14 V10.6 Q9.5 8.6 11.4 8.6 T13.4 10.6 V14"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span>
                    <b>LinkedIn</b>/company/martek-studio
                  </span>
                </a>
              </div>
              <p
                style={{
                  marginTop: 14,
                  fontFamily: 'var(--mono)',
                  fontSize: 11.5,
                  color: 'var(--ink-mut)',
                  lineHeight: 1.5,
                }}
              >
                📍 Mumbai · Toronto · Lisbon
                <br />
                Async-first, with live call windows.
              </p>
            </div>
          </aside>

          {/* FORM */}
          <div className="lead-wrap" id="form" data-reveal>
            <Suspense fallback={null}>
              <ContactLeadForm />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
