import Link from 'next/link'

export default function FinalCta() {
  return (
    <section className="final-cta">
      <div className="dot-bg"></div>
      <div className="wrap final-cta-inner">
        <div className="grid">
          <div data-reveal>
            <span className="kicker" style={{ color: 'var(--paper-3)' }}>
              Let&apos;s start
            </span>
            <h2 style={{ marginTop: 14 }}>
              Have an <span className="it">idea</span>?<br />
              Let&apos;s <span className="stamp">make it</span>
              <br />a thing.
            </h2>
          </div>
          <div className="right" data-reveal>
            <p>
              We reply to every email, usually within a few hours. Tell us what you&apos;re building, what&apos;s
              stuck, and what &quot;done&quot; looks like.
            </p>
            <p>
              <b>No pitch deck needed.</b> A scrappy paragraph &amp; a Loom is plenty.
            </p>
            <div className="cta-row">
              <Link href="/contact" className="btn btn-primary">
                Book a discovery call
                <svg className="arr-svg" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 11 L11 3 M5 3 H11 V9" />
                </svg>
              </Link>
              <a href="mailto:hello@marrelay.com" className="btn btn-ghost">
                hello@marrelay.com
              </a>
            </div>
          </div>
        </div>

        <div className="signoff">
          <span>
            <b>Marrelay</b> · a founder-led digital studio.
          </span>
          <span>Toronto, Canada</span>
        </div>
      </div>
    </section>
  )
}
