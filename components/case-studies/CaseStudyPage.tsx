import { ReactNode } from 'react'
import Link from 'next/link'
import AccentSetter from '@/components/AccentSetter'

const ArrowSvg = () => (
  <svg className="arr-svg" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 11 L11 3 M5 3 H11 V9" />
  </svg>
)

const isVideo = (p: string) => /\.(mp4|webm|mov)(\?|$)/i.test(p)

export interface CaseStudyData {
  slug: string
  accentClass: string
  contactQuery: string
  category: string
  crumb: string
  h1: ReactNode
  summary: string
  heroStats: { v: ReactNode; k: string }[]
  challengeKicker: string
  challenge: string[]
  approachIntro: string
  approach: { title: string; text: string; time: string }[]
  buildIntro: string
  build: { title: string; text: string; tags: string[] }[]
  outcomeTagline: string
  outcomeH3: ReactNode
  outcomeText: string
  outcomeMetrics: { v: ReactNode; sup?: string; k: string }[]
  quote: string
  quoteAttribution: string
  ctaH2: ReactNode
  ctaText: string
  /** page-specific interactive demo */
  interactive?: ReactNode
  interactiveTitle?: ReactNode
  /** for SEO JSON-LD + meta */
  seoName: string
  seoDescription: string
}

const Deliv = ({ d }: { d: CaseStudyData['build'][number] }) => (
  <div className="deliv" data-reveal>
    <h4>{d.title}</h4>
    <p>{d.text}</p>
    <div className="tagrow">
      {d.tags.map((t) => <span key={t}>{t}</span>)}
    </div>
  </div>
)

const SITE = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.marrelay.com'

export default function CaseStudyPage({ data, media }: { data: CaseStudyData; media: string }) {
  const contactHref = `/contact?service=${data.contactQuery}`
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE}/case-studies` },
      { '@type': 'ListItem', position: 3, name: data.category, item: `${SITE}/projects/${data.slug}` },
    ],
  }
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.seoName,
    about: data.category,
    creator: { '@type': 'Organization', name: 'Marrelay' },
    description: data.seoDescription,
    keywords: `${data.category}, case study, ${data.contactQuery} agency`,
    // Honest signal: these are illustrative examples, not delivered client work.
    disambiguatingDescription: 'Illustrative example engagement created to show how Marrelay approaches this kind of work.',
  }

  return (
    <>
      <AccentSetter accentClass={data.accentClass} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO */}
      <section className="svc-hero">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/case-studies">Case Studies</Link>
            <span className="sep">/</span>
            <span className="here">{data.crumb}</span>
          </div>

          <div className="cs-hero-grid">
            <div data-reveal>
              <span className="svc-tag">
                <span className="no">CS</span>
                {data.category} · Hypothetical
              </span>
              <h1>{data.h1}</h1>
              <p className="lede">{data.summary}</p>
              <p className="cs-note" style={{ marginTop: 16 }}>An imagined scenario · not a past project or a promise of results</p>
              <div className="cta-row" style={{ marginTop: 24 }}>
                <Link href={contactHref} className="btn btn-primary">
                  Start a project like this
                  <ArrowSvg />
                </Link>
                <Link href="/case-studies" className="btn btn-ghost">All case studies</Link>
              </div>
              <div className="cs-stats">
                {data.heroStats.map((s, i) => (
                  <div className="ms" key={i}>
                    <div className="v">{s.v}</div>
                    <div className="k">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal>
              <div className="cs-frame">
                {isVideo(media)
                  ? <video src={media} autoPlay muted loop playsInline aria-hidden="true" />
                  /* eslint-disable-next-line @next/next/no-img-element */
                  : <img src={media} alt={`${data.category} case study`} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE CHALLENGE */}
      <section className="sec">
        <div className="wrap">
          <div className="cs-lead" data-reveal>
            <div className="k">{data.challengeKicker}</div>
            <div>
              {data.challenge.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SKETCH */}
      {data.interactive && (
        <section className="sec alt">
          <div className="wrap">
            <div className="sec-head" data-reveal>
              <h2>{data.interactiveTitle ?? <>A quick <span className="it">interactive sketch</span></>}</h2>
              <p className="intro">Have a play. It&apos;s a rough, made-up illustration of the kind of thing we&apos;d explore with you, not a real deliverable or a fixed method.</p>
            </div>
            <div data-reveal>{data.interactive}</div>
          </div>
        </section>
      )}

      {/* OUR APPROACH */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2>Our <span className="it">approach</span></h2>
            <p className="intro">{data.approachIntro}</p>
          </div>
          <div className="flow" data-reveal-stagger>
            {data.approach.map((s, i) => (
              <div className="fstep" key={i}>
                <div className="fn">{i + 1}</div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
                <div className="ft">{s.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE'D BUILD */}
      <section className="sec alt">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2>What we&apos;d <span className="it">build</span></h2>
            <p className="intro">{data.buildIntro}</p>
          </div>
          <div className="deliverables">
            {data.build.map((d) => <Deliv key={d.title} d={d} />)}
          </div>
        </div>
      </section>

      {/* THE OUTCOME */}
      <section className="sec">
        <div className="wrap">
          <div className="casestudy" data-reveal>
            <div className="cs-media">
              <div className="img-slot">
                {isVideo(media)
                  ? <video src={media} autoPlay muted loop playsInline aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  /* eslint-disable-next-line @next/next/no-img-element */
                  : <img src={media} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
            </div>
            <div className="cs-body">
              <div className="tagline">{data.outcomeTagline}</div>
              <h3>{data.outcomeH3}</h3>
              <p>{data.outcomeText}</p>
              <div className="cs-metrics">
                {data.outcomeMetrics.map((m, i) => (
                  <div className="m" key={i}>
                    <div className="v">{m.v}{m.sup && <sup>{m.sup}</sup>}</div>
                    <div className="k">{m.k}</div>
                  </div>
                ))}
              </div>
              <div className="cs-author">
                <div className="av">M</div>
                <div className="meta">
                  <b>{data.quote}</b>
                  <span>{data.quoteAttribution}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="cs-note" style={{ marginTop: 20 }}>Made-up example figures · the kind of outcome we&apos;d aim for, not a promise or a real result</p>
        </div>
      </section>

      {/* CTA */}
      <section className="sec">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div data-reveal style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(32px,4.4vw,54px)', lineHeight: 1.03, letterSpacing: '-.02em' }}>
              {data.ctaH2}
            </h2>
            <p className="lede" style={{ margin: '16px auto 26px' }}>{data.ctaText}</p>
            <div className="cta-row" style={{ justifyContent: 'center' }}>
              <Link href={contactHref} className="btn btn-primary">
                Book a discovery call
                <ArrowSvg />
              </Link>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
