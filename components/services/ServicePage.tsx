import { ReactNode } from 'react'
import Link from 'next/link'
import AccentSetter from '@/components/AccentSetter'
import ViewItem from '@/analytics/ViewItem'
import FaqList, { FaqItem } from './FaqList'

const ArrowSvg = () => (
  <svg className="arr-svg" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 11 L11 3 M5 3 H11 V9" />
  </svg>
)

export interface Deliverable {
  icon: ReactNode
  title: ReactNode
  text: string
  tags: string[]
}

export interface FlowStep {
  title: ReactNode
  text: string
  time: string
}

export interface PriceCard {
  variant: 'c-starter' | 'c-growth' | 'c-scale'
  featured?: boolean
  tag?: string
  name: string
  h3: ReactNode
  desc: string
  price: string
  priceNote: string
  billing: string
  items: string[]
  ctaLabel: string
}

export interface ServiceData {
  accentClass: string
  contactQuery: string
  crumb: string
  tagNo: string
  tagLabel: string
  h1: ReactNode
  lede: ReactNode
  miniStats: { v: ReactNode; k: string }[]
  stage: ReactNode
  includedIntro: string
  deliverables: Deliverable[]
  flowTitle: ReactNode
  flowIntro: string
  flow: FlowStep[]
  workIntro?: string
  caseStudy?: {
    placeholder: string
    tagline: ReactNode
    h3: ReactNode
    text: string
    metrics: { v: ReactNode; k: string }[]
    author: { av: string; name: string; role: string }
  }
  /** plain-text FAQ answers reused for FAQPage JSON-LD */
  faqPlain?: { q: string; a: string }[]
  pricingTitle: ReactNode
  pricingIntro: string
  cards: PriceCard[]
  faqKicker: string
  faqTitle: ReactNode
  faqs: FaqItem[]
  ctaH2: ReactNode
  ctaText: string
  signoff: string
}

const SERVICE_SLUG: Record<string, string> = {
  web: 'web-development', data: 'data-analytics', social: 'social', seo: 'seo-ads', engineering: 'engineering',
}
const SITE = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.marrelay.com'

export default function ServicePage({ data }: { data: ServiceData }) {
  const contactHref = `/contact?service=${data.contactQuery}`
  const slug = SERVICE_SLUG[data.contactQuery] || data.contactQuery

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/services` },
      { '@type': 'ListItem', position: 3, name: data.crumb, item: `${SITE}/services/${slug}` },
    ],
  }

  return (
    <>
      <AccentSetter accentClass={data.accentClass} />
      <ViewItem serviceKey={data.contactQuery} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO */}
      <section className="svc-hero">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/#what">Services</Link>
            <span className="sep">/</span>
            <span className="here">{data.crumb}</span>
          </div>
          <div className="svc-hero-grid" style={{ marginTop: 18 }}>
            <div data-reveal>
              <span className="svc-tag">
                <span className="no">{data.tagNo}</span>
                {data.tagLabel}
              </span>
              <h1>{data.h1}</h1>
              <p className="lede">{data.lede}</p>
              <div className="cta-row">
                <Link href={contactHref} className="btn btn-primary">
                  Book a discovery call
                  <ArrowSvg />
                </Link>
                <a href="#pricing" className="btn btn-ghost">
                  See pricing
                </a>
              </div>
              <div className="mini-stats">
                {data.miniStats.map((s, i) => (
                  <div className="ms" key={i}>
                    <div className="v">{s.v}</div>
                    <div className="k">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal>{data.stage}</div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2>
              What&apos;s <span className="hl">included</span>
            </h2>
            <p className="intro">{data.includedIntro}</p>
          </div>
          <div className="deliverables" data-reveal-stagger>
            {data.deliverables.map((d, i) => (
              <div className="deliv" key={i}>
                <div className="ic">{d.icon}</div>
                <h4>{d.title}</h4>
                <p>{d.text}</p>
                <div className="tagrow">
                  {d.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="sec alt">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2>{data.flowTitle}</h2>
            <p className="intro">{data.flowIntro}</p>
          </div>
          <div className="flow" data-reveal-stagger>
            {data.flow.map((f, i) => (
              <div className="fstep" key={i}>
                <span className="fn">{i + 1}</span>
                <h4>{f.title}</h4>
                <p>{f.text}</p>
                <span className="ft">{f.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDY (optional - shown once real client work exists) */}
      {data.caseStudy && (
        <section className="sec">
          <div className="wrap">
            <div className="sec-head" data-reveal>
              <h2>
                Recent <span className="hl">work</span>
              </h2>
              <p className="intro">{data.workIntro}</p>
            </div>
            <div className="casestudy" data-reveal>
              <div className="cs-media">
                <span className="img-slot">
                  <span className="ph">{data.caseStudy.placeholder}</span>
                </span>
              </div>
              <div className="cs-body">
                <div className="tagline">{data.caseStudy.tagline}</div>
                <h3>{data.caseStudy.h3}</h3>
                <p>{data.caseStudy.text}</p>
                <div className="cs-metrics">
                  {data.caseStudy.metrics.map((m, i) => (
                    <div className="m" key={i}>
                      <div className="v">{m.v}</div>
                      <div className="k">{m.k}</div>
                    </div>
                  ))}
                </div>
                <div className="cs-author">
                  <div className="av">{data.caseStudy.author.av}</div>
                  <div className="meta">
                    <b>{data.caseStudy.author.name}</b>
                    <span>{data.caseStudy.author.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRICING */}
      <section className="sec alt" id="pricing">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2>{data.pricingTitle}</h2>
            <p className="intro">{data.pricingIntro}</p>
          </div>
          <div className="svc-price" data-reveal-stagger>
            {data.cards.map((c, i) => (
              <div className={`card ${c.variant}${c.featured ? ' featured' : ''}`} key={i}>
                {c.tag && <div className="tag">{c.tag}</div>}
                <div className="pname">
                  <span className="dot"></span>
                  <b>{c.name}</b>
                </div>
                <h3>{c.h3}</h3>
                <p className="desc">{c.desc}</p>
                <div className="price-line">
                  {c.price} <small>{c.priceNote}</small>
                </div>
                <div className="billing">{c.billing}</div>
                <ul>
                  {c.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link href={contactHref} className="cta">
                  {c.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec">
        <div className="wrap">
          <div className="faq-grid">
            <div data-reveal>
              <span className="kicker">{data.faqKicker}</span>
              <h2
                style={{
                  fontFamily: 'var(--display)',
                  fontWeight: 400,
                  fontSize: 'clamp(36px,4.4vw,56px)',
                  lineHeight: 1,
                  letterSpacing: '-.02em',
                  marginTop: 14,
                }}
              >
                {data.faqTitle}
              </h2>
              <p className="sub">
                Couldn&apos;t find it?{' '}
                <Link
                  href={contactHref}
                  style={{
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                    textDecorationColor: 'var(--accent)',
                  }}
                >
                  Ask on the call →
                </Link>
              </p>
            </div>
            <FaqList items={data.faqs} />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="dot-bg"></div>
        <div className="wrap final-cta-inner">
          <div className="grid">
            <div data-reveal>
              <span className="kicker" style={{ color: 'var(--paper-3)' }}>
                Ready when you are
              </span>
              <h2 style={{ marginTop: 14 }}>{data.ctaH2}</h2>
            </div>
            <div className="right" data-reveal>
              <p>{data.ctaText}</p>
              <div className="cta-row">
                <Link href={contactHref} className="btn btn-primary">
                  Book a discovery call
                  <ArrowSvg />
                </Link>
                <a href="mailto:hello@marrelay.com" className="btn btn-ghost">
                  hello@marrelay.com
                </a>
              </div>
            </div>
          </div>
          <div className="signoff">
            <span>
              <b>Marrelay</b> · {data.signoff}
            </span>
            <span>Toronto, Canada</span>
          </div>
        </div>
      </section>
    </>
  )
}
