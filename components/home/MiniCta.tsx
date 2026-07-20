/* eslint-disable @next/next/no-img-element */
import { Suspense } from 'react'
import Link from 'next/link'
import LeadForm from './LeadForm'

const Tick = () => (
  <span className="tk">
    <svg viewBox="0 0 12 12" fill="none" stroke="var(--paper)" strokeWidth="2">
      <path d="M2 6 L5 9 L10 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

export default function MiniCta({ imageSrc = '/assets/contact-us-form.jpg' }: { imageSrc?: string } = {}) {
  return (
    <section className="mini-cta" id="start">
      <div className="wrap">
        <div className="mini-grid">
          <div className="pitch" data-reveal>
            <span className="kicker">Book a discovery call</span>
            <h2 style={{ marginTop: 14 }}>
              Let&apos;s start with a <span className="hl">30-min</span> <span className="it">chat</span>.
            </h2>
            <p>
              No pitch, no obligation. Tell us the basics here and we&apos;ll reply within a few hours to find a time.
              Prefer the full brief?{' '}
              <Link
                href="/contact"
                style={{ textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'var(--terra)' }}
              >
                Use the detailed form →
              </Link>
            </p>
            <ul className="assure">
              <li>
                <Tick /> A real human replies, usually within 2 hours
              </li>
              <li>
                <Tick /> We&apos;ll tell you honestly if we&apos;re the wrong fit
              </li>
              <li>
                <Tick /> Your details stay private, never sold or spammed
              </li>
            </ul>
            <div className="media-frame" style={{ marginTop: 28, aspectRatio: '5/3', maxWidth: 380 }}>
              <span className="img-slot" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                <img src={imageSrc} alt="The Marrelay studio" />
              </span>
            </div>
          </div>

          <div className="lead-wrap" data-reveal>
            <Suspense fallback={null}>
              <LeadForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
