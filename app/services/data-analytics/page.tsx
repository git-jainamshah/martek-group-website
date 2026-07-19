import type { Metadata } from 'next'
import ServicePage, { ServiceData } from '@/components/services/ServicePage'
import { mergePackages } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Data & Analytics · Martek Group',
  description:
    'We tag your product, wire up the tools, and turn the firehose into one weekly page that actually drives decisions.',
  alternates: { canonical: '/services/data-analytics' },
  openGraph: { url: '/services/data-analytics' },
}

const stage = (
  <div className="hero-stage">
    <div className="dotgrid"></div>
    <div className="float-card scene-dash float-a" style={{ ['--rot' as string]: '-2deg' }}>
      <div className="top">
        <b>Weekly · signups</b>
        <span className="pill2">▲ 24%</span>
      </div>
      <div className="bars">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div className="float-card scene-line float-b" style={{ ['--rot' as string]: '4deg' }}>
      <svg viewBox="0 0 200 74" preserveAspectRatio="none">
        <path className="pth" d="M4 64 Q 40 40, 70 48 T 130 24 T 196 10" />
      </svg>
    </div>
    <div className="badge badge-live float-c">
      <span className="d"></span>live data
    </div>
    <div className="badge badge-up float-b">CAC ▼ 31%</div>
  </div>
)

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 28 28" fill="none" stroke="var(--ink)" strokeWidth="1.8">
    {children}
  </svg>
)

const data: ServiceData = {
  accentClass: 'accent-data',
  contactQuery: 'data',
  crumb: 'Data & analytics',
  tagNo: '02',
  tagLabel: 'Data & analytics',
  h1: (
    <>
      Dashboards that <span className="it">someone</span> <span className="hl">reads</span>.
    </>
  ),
  lede: (
    <>
      We tag your product, wire up the tools, and turn the firehose into <b>one weekly page</b> that actually drives
      decisions, not another chart nobody opens.
    </>
  ),
  miniStats: [
    { v: '2wk', k: 'to first dashboard' },
    {
      v: (
        <>
          1<sup style={{ fontSize: '.5em', color: 'var(--accent)' }}>pg</sup>
        </>
      ),
      k: 'weekly report',
    },
    { v: 'GA4', k: '+ Mixpanel, Looker' },
  ],
  stage,
  includedIntro:
    'From a blank Google Analytics property to a board-ready report. We meet you wherever your data mess currently lives.',
  deliverables: [
    {
      icon: (
        <Icon>
          <path d="M4 6 H24 M4 6 L7 22 H21 L24 6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 11 V17 M17 11 V17" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Tracking & tagging',
      text: 'Event tracking that actually maps to your funnel, set up cleanly in GA4, GTM, or your tool of choice.',
      tags: ['GA4', 'GTM', 'Segment'],
    },
    {
      icon: (
        <Icon>
          <rect x="4" y="4" width="20" height="20" rx="3" />
          <path d="M8 18 V13 M14 18 V9 M20 18 V15" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Dashboards',
      text: 'One source of truth your whole team can read, built in Looker Studio, Metabase, or Mixpanel.',
      tags: ['Looker', 'Metabase', 'Mixpanel'],
    },
    {
      icon: (
        <Icon>
          <rect x="5" y="3" width="18" height="22" rx="2" />
          <path d="M9 9 H19 M9 13 H19 M9 17 H15" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Weekly 1-pagers',
      text: "A plain-English summary every Monday: what moved, why, and what we'd try next.",
      tags: ['Notion', 'Slack digest'],
    },
    {
      icon: (
        <Icon>
          <path d="M5 20 Q14 4 23 20" />
          <circle cx="9" cy="15" r="1.6" fill="var(--accent)" stroke="none" />
          <circle cx="19" cy="15" r="1.6" fill="var(--accent)" stroke="none" />
        </Icon>
      ),
      title: 'Funnel & cohort analysis',
      text: 'Where people drop, who sticks, and which cohort is quietly your best. We find the leaks.',
      tags: ['Funnels', 'Retention'],
    },
    {
      icon: (
        <Icon>
          <ellipse cx="14" cy="7" rx="9" ry="3.4" />
          <path d="M5 7 V21 Q5 24 14 24 Q23 24 23 21 V7 M5 14 Q5 17 14 17 Q23 17 23 14" />
        </Icon>
      ),
      title: 'Data plumbing',
      text: 'Pipelines and warehouses when you outgrow spreadsheets, modeled cleanly in SQL.',
      tags: ['BigQuery', 'dbt', 'SQL'],
    },
    {
      icon: (
        <Icon>
          <circle cx="14" cy="14" r="10" />
          <path d="M14 8 V14 L18 17" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Experiment readouts',
      text: "A/B test design and honest readouts, so you ship what works, not what's loudest.",
      tags: ['A/B testing', 'Stat sig'],
    },
  ],
  flowTitle: (
    <>
      How we <span className="it">set it up</span>
    </>
  ),
  flowIntro: 'Two weeks to trustworthy numbers, then a steady weekly rhythm you can build a company around.',
  flow: [
    { title: 'Audit', text: 'We map what you track today, find the gaps, and agree on the metrics that matter.', time: 'DAYS 1–3' },
    { title: 'Instrument', text: 'Clean event tracking and a tidy tagging plan, wired into your tools.', time: 'WEEK 1' },
    { title: 'Build dashboard', text: 'Your single source of truth, reviewed with you until the numbers are trusted.', time: 'WEEK 2' },
    { title: 'Weekly rhythm', text: 'Every Monday: a 1-page readout and a recommendation. Optional retainer.', time: 'ONGOING' },
  ],
  pricingTitle: (
    <>
      Data <span className="it">pricing</span>
    </>
  ),
  pricingIntro: 'Start with a clean setup, then keep us on for the weekly rhythm, or take it in-house. Your call.',
  cards: [
    {
      variant: 'c-starter',
      name: 'Audit',
      h3: (
        <>
          Find the <span className="it">leaks</span>
        </>
      ),
      desc: 'A full review of your tracking & funnel, with a prioritized fix list.',
      price: '$1,800',
      priceNote: 'flat',
      billing: '1-week turnaround',
      items: ['Tracking & tagging review', 'Funnel drop-off analysis', 'Prioritized fix list', '60-min walkthrough call'],
      ctaLabel: 'Start an audit →',
    },
    {
      variant: 'c-growth',
      featured: true,
      tag: 'Best value',
      name: 'Setup',
      h3: (
        <>
          The <span className="it">full</span> stack
        </>
      ),
      desc: 'Tracking, a dashboard, and a working weekly report, done right.',
      price: '$5,200',
      priceNote: 'from',
      billing: '2–3 week delivery',
      items: [
        'Event tracking & tagging plan',
        'Custom dashboard build',
        'First month of weekly reports',
        'Team training session',
        '30-day support',
      ],
      ctaLabel: 'Book a setup →',
    },
    {
      variant: 'c-scale',
      name: 'Weekly',
      h3: (
        <>
          On <span className="it">retainer</span>
        </>
      ),
      desc: 'We run your analytics rhythm so you can run your company.',
      price: '$2,600',
      priceNote: '/mo',
      billing: '3-month minimum',
      items: ['Weekly 1-page readout', 'Dashboard upkeep', 'Experiment design & analysis', 'Pause or cancel anytime'],
      ctaLabel: 'Talk retainer →',
    },
  ],
  faqKicker: 'FAQ · Data',
  faqTitle: (
    <>
      Data <span className="serif-it" style={{ fontStyle: 'italic' }}>questions</span>.
    </>
  ),
  faqs: [
    {
      q: 'Which analytics tools do you work with?',
      a: "GA4 and Google Tag Manager for most, plus Mixpanel or PostHog for product analytics, and Looker Studio or Metabase for dashboards. If you're already invested in a stack, we'll work within it.",
    },
    {
      q: 'Our tracking is a mess. Is that a problem?',
      a: "That's the normal starting point, not a dealbreaker. The audit exists exactly for this, we untangle what's there before building anything new.",
    },
    {
      q: 'Is our data kept private?',
      a: 'Yes. We work in your accounts with least-privilege access, sign an NDA on day one, and never share or resell anything.',
    },
    {
      q: 'Can you train our team to run it?',
      a: "Absolutely, the setup package includes a training session and documentation so you're not dependent on us. Most teams can run it themselves after a month or two.",
    },
  ],
  ctaH2: (
    <>
      Let&apos;s make
      <br />
      your data <span className="stamp">clear</span>.
    </>
  ),
  ctaText: "Tell us what you wish you knew about your product. We'll reply within a few hours with where to start.",
  signoff: 'analytics for startups.',
}

export default function DataAnalyticsPage() {
  return <ServicePage data={{ ...data, cards: mergePackages('data-analytics', data.cards) }} />
}
