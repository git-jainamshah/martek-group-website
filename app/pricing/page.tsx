import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PricingSection from '@/components/home/PricingSection'
import { SITE_URL } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Fixed-price packages for web development, data & analytics, social, SEO & ads, and engineering. Pick a starting point and get a 1-page proposal in 3 working days. No sales calls.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Marrelay - Pricing',
    description:
      'Fixed-price packages for web development, data & analytics, social, SEO & ads, and engineering. No sales calls required.',
    url: '/pricing',
  },
}

/**
 * The one and only pricing page.
 *
 * This used to be duplicated: a styled section at /#pricing on the homepage and
 * an older, differently-designed page here. Both are now this single URL, so
 * every internal link, the sitemap and search engines point at one destination.
 */

const FAQS = [
  {
    q: 'Can I customise a package?',
    a: 'Yes. Every package is a starting point, not a box. Tell us what the project actually needs and we will scope it and send a fixed price for that scope.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Major credit cards and bank transfers. Larger projects are split into milestone payments so you are never paying far ahead of delivered work.',
  },
  {
    q: 'Do you offer ongoing support?',
    a: 'Every package includes a post-launch support window. After that, monthly maintenance and retainer plans are available if you want us to stay on.',
  },
  {
    q: 'How long do projects typically take?',
    a: 'Landing-page sprints run 14 days. Most full sites go live in 4 to 6 weeks. You get a dated timeline with your quote before any money changes hands.',
  },
]

export default function PricingPage() {
  // FAQPage structured data - lets the questions appear directly in search results.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: `${SITE_URL}/pricing` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Exactly the view that used to live at /#pricing, now with an h1. */}
      <PricingSection as="h1" />

      <section className="sec alt">
        <div className="wrap">
          <div className="price-head" data-reveal>
            <div>
              <span className="kicker">Questions</span>
              <h2 style={{ marginTop: 14 }}>
                Before you <span className="it">ask</span>.
              </h2>
            </div>
            <div className="note">
              Nothing here is a trick question. If something is still unclear, ask us directly and we will answer
              plainly.
            </div>
          </div>

          {/* Own class names: .faq-grid / .faq-item belong to the interactive
              accordion elsewhere and expect a different DOM shape. */}
          <div className="pfaq-grid" data-reveal-stagger>
            {FAQS.map((f) => (
              <div key={f.q} className="pfaq-item">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }} data-reveal>
            <Link href="/contact" className="btn btn-ghost">
              Still have questions? Talk to us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
