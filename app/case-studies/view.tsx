'use client'

import Link from 'next/link'

const ArrowSvg = () => (
  <svg className="arr-svg" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 11 L11 3 M5 3 H11 V9" />
  </svg>
)

const isVideo = (p: string) => /\.(mp4|webm|mov)(\?|$)/i.test(p)

const studies = [
  {
    href: '/projects/web-development',
    accent: '#E07A5F',
    category: 'Web Development',
    title: <>A website that <em>sells</em>, not just sits there</>,
    description:
      'Rebuilding a slow, hard-to-edit site into a fast, measurable ecosystem the team can run themselves.',
    metrics: [{ v: '0.8s', k: 'Load time' }, { v: '+150%', k: 'Conversion goal' }],
  },
  {
    href: '/projects/analytics-tagging',
    accent: '#6B9080',
    category: 'Data & Analytics',
    title: <>Stop guessing. <em>Measure</em> what works</>,
    description:
      'Turning a broken, untrusted analytics stack into an accurate GA4 and server-side tagging foundation.',
    metrics: [{ v: '99.8%', k: 'Data accuracy' }, { v: '12x', k: 'ROI target' }],
  },
  {
    href: '/projects/engineering-drawings',
    accent: '#8B5A8C',
    category: 'Engineering & CAD',
    title: <>Drawings that <em>leave no room to guess</em></>,
    description:
      'Precise CAD/CAM documentation that cuts rework and helps small shops win bigger, precision jobs.',
    metrics: [{ v: '±0.01mm', k: 'Tolerance' }, { v: '-25%', k: 'Material waste' }],
  },
]

export default function CaseStudiesPageView({ bannerImage }: { bannerImage: string }) {
  return (
    <>
      {/* HERO */}
      <section className="svc-hero">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Case Studies</span>
          </div>

          <div className="cs-hero-grid">
            <div data-reveal>
              <span className="svc-tag"><span className="no">CS</span>Case Studies</span>
              <h1>How we&apos;d <span className="it">help you win</span></h1>
              <p className="lede">
                We are a young studio, so instead of borrowed logos we built something more honest:
                worked-through examples of exactly how we approach real problems, end to end. Each one
                shows the thinking, the build, and the outcome you could expect.
              </p>
              <p className="cs-note" style={{ marginTop: 18 }}>Illustrative examples · not delivered client work</p>
              <div className="cta-row" style={{ marginTop: 26 }}>
                <Link href="/contact" className="btn btn-primary">
                  Start your project
                  <ArrowSvg />
                </Link>
                <Link href="/#pricing" className="btn btn-ghost">See pricing</Link>
              </div>
            </div>

            <div data-reveal>
              <div className="cs-frame">
                {isVideo(bannerImage)
                  ? <video src={bannerImage} autoPlay muted loop playsInline aria-hidden="true" />
                  /* eslint-disable-next-line @next/next/no-img-element */
                  : <img src={bannerImage} alt="Marrelay case studies" />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDIES GRID */}
      <section className="sec alt">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2>Worked <span className="it">examples</span></h2>
            <p className="intro">
              Three disciplines, three real problems, one clear method. Open any one to see how we would take it from
              brief to results.
            </p>
          </div>
          <div className="cs-cards" data-reveal-stagger>
            {studies.map((s) => (
              <Link key={s.href} href={s.href} className="cs-card" style={{ ['--accent' as string]: s.accent }}>
                <span className="cat">{s.category}</span>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <div className="metricrow">
                  {s.metrics.map((m) => (
                    <div key={m.k}>
                      <div className="v">{m.v}</div>
                      <div className="k">{m.k}</div>
                    </div>
                  ))}
                </div>
                <span className="go">Read the case study <ArrowSvg /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div data-reveal style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(32px,4.4vw,54px)', lineHeight: 1.03, letterSpacing: '-.02em' }}>
              Your project could be the <span className="it">next one</span>
            </h2>
            <p className="lede" style={{ margin: '16px auto 26px' }}>
              Tell us what you are trying to build or fix. We will show you exactly how we would approach it, with a
              plan and a price, no pressure.
            </p>
            <div className="cta-row" style={{ justifyContent: 'center' }}>
              <Link href="/contact" className="btn btn-primary">
                Book a discovery call
                <ArrowSvg />
              </Link>
              <Link href="/about" className="btn btn-ghost">Meet the studio</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
