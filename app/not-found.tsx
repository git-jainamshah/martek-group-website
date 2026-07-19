import Link from 'next/link'

export default function NotFound() {
  return (
    <section style={{ minHeight: '82vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 24px 80px', background: 'var(--paper)', textAlign: 'center' }}>
      <div style={{ maxWidth: 640 }}>
        <span className="kicker">Error 404</span>

        <div aria-hidden="true" style={{ fontFamily: 'var(--display)', fontSize: 'clamp(110px, 22vw, 200px)', lineHeight: 1, color: 'var(--ink)', marginTop: 18, letterSpacing: '-0.04em' }}>
          4<span style={{ color: 'var(--brand)', fontStyle: 'italic' }}>0</span>4
        </div>

        <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--ink)', margin: '18px 0 12px', letterSpacing: '-0.01em' }}>
          Well, this page took a <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontWeight: 400, color: 'var(--brand-ink)' }}>coffee break</span>.
        </h1>

        <p style={{ color: 'var(--ink-mut)', fontSize: 17, lineHeight: 1.65, margin: '0 auto 12px', maxWidth: 460 }}>
          It either moved, never existed, or is off somewhere shipping big things.
          Either way, the rest of the studio is very much open.
        </p>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 34 }}>
          Fixed-price quotes · weekly demos · zero dead ends (usually)
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/contact" className="btn btn-ghost">Tell us what broke</Link>
        </div>
      </div>
    </section>
  )
}
