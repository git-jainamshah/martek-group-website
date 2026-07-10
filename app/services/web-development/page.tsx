import type { Metadata } from 'next'
import ServicePage, { ServiceData } from '@/components/services/ServicePage'

export const metadata: Metadata = {
  title: 'Web Development · Martek Group',
  description:
    'Marketing sites, product UIs, and stores, designed and coded by the same small team. Fast, accessible, and easy for you to update.',
  alternates: { canonical: '/services/web-development' },
  openGraph: { url: '/services/web-development' },
}

const stage = (
  <div className="hero-stage">
    <div className="dotgrid"></div>
    <div className="float-card scene-browser float-a" style={{ ['--rot' as string]: '-3deg' }}>
      <div className="bar2">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="body2">
        <div className="ln s"></div>
        <div className="ln m"></div>
        <div className="ln m" style={{ width: '60%' }}></div>
        <div className="ln btn2"></div>
      </div>
    </div>
    <div className="float-card scene-code float-b" style={{ ['--rot' as string]: '4deg' }}>
      <div>
        <span className="c1">export</span> <span className="c2">function</span> Hero() {'{'}
      </div>
      <div>
        &nbsp;&nbsp;<span className="c1">return</span> <span className="c3">&lt;section/&gt;</span>
      </div>
      <div>
        {'}'}
        <span className="cur"></span>
      </div>
    </div>
    <div className="badge badge-ship float-c">
      <span className="d" style={{ background: 'var(--accent)' }}></span>deploy ✓ live
    </div>
    <div className="badge badge-lh float-b">Lighthouse 99</div>
  </div>
)

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 28 28" fill="none" stroke="var(--ink)" strokeWidth="1.8">
    {children}
  </svg>
)

const data: ServiceData = {
  accentClass: 'accent-web',
  contactQuery: 'web',
  crumb: 'Web development',
  tagNo: '01',
  tagLabel: 'Web development',
  h1: (
    <>
      Websites that <span className="hl">earn</span>
      <br />
      their <span className="it">pixels</span>.
    </>
  ),
  lede: (
    <>
      Marketing sites, product UIs, and stores, <b>designed and coded by the same small team</b>, so nothing gets lost
      in a handoff. Fast, accessible, and easy for you to update.
    </>
  ),
  miniStats: [
    { v: '14d', k: 'landing-page sprint' },
    {
      v: (
        <>
          98<sup style={{ fontSize: '.5em', color: 'var(--accent)' }}>+</sup>
        </>
      ),
      k: 'Lighthouse score we build to',
    },
    { v: '100%', k: 'you own the code' },
  ],
  stage,
  includedIntro:
    "Every web project is scoped to what you actually need, but here's the toolkit we pull from. Pick the pieces, or hand us the whole thing.",
  deliverables: [
    {
      icon: (
        <Icon>
          <rect x="3" y="5" width="22" height="16" rx="2" />
          <path d="M3 9 H25" />
          <circle cx="6.5" cy="7" r=".6" fill="var(--ink)" />
        </Icon>
      ),
      title: 'Marketing & landing sites',
      text: 'Fast, conversion-focused pages that load instantly and read beautifully on any screen.',
      tags: ['Webflow', 'Next.js', 'Astro'],
    },
    {
      icon: (
        <Icon>
          <rect x="4" y="4" width="20" height="20" rx="3" />
          <path d="M9 14 H19 M9 18 H15" strokeLinecap="round" />
          <rect x="9" y="8" width="10" height="3" rx="1.5" fill="var(--accent)" stroke="none" />
        </Icon>
      ),
      title: 'Product UIs & dashboards',
      text: 'App front-ends and internal tools built in React, pixel-tight and genuinely usable.',
      tags: ['React', 'TypeScript', 'Tailwind'],
    },
    {
      icon: (
        <Icon>
          <path d="M5 8 H23 L21 20 H7 Z" />
          <circle cx="10" cy="24" r="1.4" />
          <circle cx="18" cy="24" r="1.4" />
          <path d="M5 8 L4 4 H2" strokeLinecap="round" />
        </Icon>
      ),
      title: 'E-commerce',
      text: "Storefronts that sell, built on Shopify or headless, with checkout that doesn't leak buyers.",
      tags: ['Shopify', 'Headless', 'Stripe'],
    },
    {
      icon: (
        <Icon>
          <circle cx="14" cy="14" r="10" />
          <path d="M14 4 Q20 14 14 24 Q8 14 14 4 M4 14 H24" />
        </Icon>
      ),
      title: 'Brand & UI design',
      text: 'Logo, type, color, and a tidy component system in Figma, design that survives contact with code.',
      tags: ['Figma', 'Design system'],
    },
    {
      icon: (
        <Icon>
          <path d="M14 3 L24 8 V15 Q24 22 14 25 Q4 22 4 15 V8 Z" />
          <path d="M10 14 L13 17 L18 11" strokeLinecap="round" strokeLinejoin="round" />
        </Icon>
      ),
      title: 'Performance & a11y',
      text: 'Core Web Vitals in the green and WCAG-AA accessibility, baked in, not bolted on later.',
      tags: ['Core Web Vitals', 'WCAG-AA'],
    },
    {
      icon: (
        <Icon>
          <path d="M6 22 V10 L14 4 L22 10 V22 Z" />
          <path d="M11 22 V15 H17 V22" />
        </Icon>
      ),
      title: 'CMS & handover',
      text: 'You edit your own content without calling us. Clean CMS, a Loom walkthrough, and the keys.',
      tags: ['Sanity', 'Contentful', 'Docs'],
    },
  ],
  flowTitle: (
    <>
      How a build <span className="it">works</span>
    </>
  ),
  flowIntro:
    "Four phases, weekly demos, no black box. You'll always know exactly where your project stands.",
  flow: [
    { title: 'Discover', text: 'We map goals, audience, and references, then agree on scope & success metrics.', time: 'WEEK 1' },
    { title: 'Design', text: 'Wireframes to high-fidelity in Figma. You react early, before a line of code.', time: 'WEEK 1–2' },
    { title: 'Build', text: 'We code in 1-week sprints with a live staging link and a Friday demo each week.', time: 'WEEK 2–5' },
    { title: 'Ship', text: 'QA, performance pass, launch, and a handover walkthrough. Then 30 days of free fixes.', time: 'WEEK 5–6' },
  ],
  pricingTitle: (
    <>
      Web <span className="it">pricing</span>
    </>
  ),
  pricingIntro:
    'Transparent starting points. Every project gets a fixed, one-page quote before any money changes hands.',
  cards: [
    {
      variant: 'c-starter',
      name: 'Landing sprint',
      h3: (
        <>
          One <span className="it">page</span>, fast
        </>
      ),
      desc: 'A high-converting landing or campaign page, designed & built.',
      price: '$2,400',
      priceNote: 'flat',
      billing: '14-day delivery',
      items: ['1 page, fully responsive', 'Copy polish + basic SEO', 'CMS-editable hero & sections', '2 rounds of revisions'],
      ctaLabel: 'Start a sprint →',
    },
    {
      variant: 'c-growth',
      featured: true,
      tag: 'Best value',
      name: 'Full site',
      h3: (
        <>
          The <span className="it">whole</span> site
        </>
      ),
      desc: 'A complete marketing site or product front-end, brand to launch.',
      price: '$8,400',
      priceNote: 'from',
      billing: '4–6 week delivery',
      items: [
        '5–10 pages or app screens',
        'Brand & design system',
        'CMS + content migration',
        'Performance & a11y pass',
        '30-day post-launch support',
      ],
      ctaLabel: 'Book a build →',
    },
    {
      variant: 'c-scale',
      name: 'Ongoing',
      h3: (
        <>
          Care &amp; <span className="it">iterate</span>
        </>
      ),
      desc: 'We keep building after launch, new pages, tests, and fixes monthly.',
      price: '$3,800',
      priceNote: '/mo',
      billing: '3-month minimum',
      items: ['40 hours / month of web work', 'New pages & A/B tests', 'Priority bug fixes', 'Pause or cancel anytime'],
      ctaLabel: 'Talk retainer →',
    },
  ],
  faqKicker: 'FAQ · Web',
  faqTitle: (
    <>
      Web <span className="serif-it" style={{ fontStyle: 'italic' }}>questions</span>.
    </>
  ),
  faqs: [
    {
      q: 'What do you build sites in?',
      a: 'Depends on the job. Marketing sites usually run on Webflow or Next.js; product UIs on React + TypeScript; stores on Shopify or headless commerce. We recommend the lightest tool that lets you update things without us.',
    },
    {
      q: 'Do I own the code and design?',
      a: 'Completely. You get the repository, the Figma file, and the CMS keys on launch day. No lock-in, no licensing games.',
    },
    {
      q: 'Can you work from our existing brand?',
      a: "Yes, we'll work within your brand guidelines, or build a light system if you don't have one yet. Either way we'll keep it consistent.",
    },
    {
      q: 'What if I need changes after launch?',
      a: 'Every full build includes 30 days of free fixes. After that, you can move to a small monthly retainer, or just email us per-task. No pressure either way.',
    },
  ],
  ctaH2: (
    <>
      Let&apos;s build
      <br />
      your <span className="stamp">website</span>.
    </>
  ),
  ctaText: 'Tell us what you\'re building and what "done" looks like. We\'ll reply within a few hours with next steps.',
  signoff: 'web development for startups.',
}

export default function WebDevelopmentPage() {
  return <ServicePage data={data} />
}
