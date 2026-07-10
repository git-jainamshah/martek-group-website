import type { Metadata } from 'next'
import ServicePage, { ServiceData } from '@/components/services/ServicePage'

export const metadata: Metadata = {
  title: 'SEO & Ads · Martek Group',
  description:
    'Technical SEO, content, and paid search & social that compound. Qualified leads at a falling cost, with the math shown weekly.',
  alternates: { canonical: '/services/seo-ads' },
  openGraph: { url: '/services/seo-ads' },
}

const stage = (
  <div className="hero-stage">
    <div className="dotgrid"></div>
    <div className="float-card scene-serp float-a" style={{ ['--rot' as string]: '-2deg' }}>
      <div className="sbar">
        <span className="mg"></span>
        <small>best vegan dog food</small>
      </div>
      <div className="res top">
        <span className="rk">#1</span>
        <div className="l1"></div>
        <div className="l2"></div>
        <div className="l3"></div>
      </div>
      <div className="res">
        <div className="l1" style={{ background: 'var(--ink-mut)' }}></div>
        <div className="l2"></div>
      </div>
      <div className="res">
        <div className="l1" style={{ background: 'var(--ink-mut)' }}></div>
        <div className="l2"></div>
      </div>
    </div>
    <div className="float-card scene-cpc float-b" style={{ ['--rot' as string]: '5deg' }}>
      <b>COST / LEAD</b>
      <div className="dn">
        $4.10 <small>▼ from $9.80</small>
      </div>
    </div>
    <div className="badge badge-clicks float-c">
      <span className="d" style={{ background: 'var(--accent)' }}></span>+12k clicks
    </div>
    <div className="badge badge-rank float-b">page 1 ✓</div>
  </div>
)

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 28 28" fill="none" stroke="var(--ink)" strokeWidth="1.8">
    {children}
  </svg>
)

const data: ServiceData = {
  accentClass: 'accent-seo',
  contactQuery: 'seo',
  crumb: 'SEO & ads',
  tagNo: '03',
  tagLabel: 'SEO & ads',
  h1: (
    <>
      Be the <span className="hl">first</span>
      <br />
      result, not the <span className="it">loudest</span>.
    </>
  ),
  lede: (
    <>
      Technical SEO, content, and paid search &amp; social that compound. We chase{' '}
      <b>qualified leads at a falling cost</b>, and show you the math every single week.
    </>
  ),
  miniStats: [
    { v: '#1', k: 'ranking targets' },
    {
      v: (
        <>
          −30<sup style={{ fontSize: '.5em', color: 'var(--accent)' }}>%</sup>
        </>
      ),
      k: 'the CPA drop we chase',
    },
    { v: 'wk', k: 'reporting cadence' },
  ],
  stage,
  includedIntro:
    'Organic and paid pull in the same direction here. We build the foundation, then buy growth where the math works.',
  deliverables: [
    {
      icon: (
        <Icon>
          <path d="M6 22 V8 L14 4 L22 8 V22 Z" />
          <path d="M10 22 V14 H18 V22" />
          <path d="M4 8 H24" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Technical SEO',
      text: 'Site speed, crawlability, schema, and the boring fixes that quietly unlock rankings.',
      tags: ['Core Web Vitals', 'Schema'],
    },
    {
      icon: (
        <Icon>
          <rect x="5" y="3" width="18" height="22" rx="2" />
          <path d="M9 9 H19 M9 13 H19 M9 17 H14" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Content & keywords',
      text: 'Search-intent research and articles that rank, and read like a human wrote them.',
      tags: ['Keyword research', 'Articles'],
    },
    {
      icon: (
        <Icon>
          <circle cx="12" cy="12" r="8" />
          <path d="M18 18 L24 24" strokeLinecap="round" />
          <path d="M12 9 V12 L14 14" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Paid search',
      text: 'Google & Bing campaigns built around intent, tight match types, ruthless negatives.',
      tags: ['Google Ads', 'Bing', 'Shopping'],
    },
    {
      icon: (
        <Icon>
          <rect x="4" y="6" width="20" height="16" rx="3" />
          <path d="M11 11 L17 14 L11 17 Z" fill="var(--accent)" stroke="none" />
        </Icon>
      ),
      title: 'Paid social',
      text: 'Meta, TikTok, and LinkedIn ads with creative testing baked into every campaign.',
      tags: ['Meta', 'TikTok', 'LinkedIn'],
    },
    {
      icon: (
        <Icon>
          <path d="M4 18 L11 11 L16 16 L24 7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 7 H24 V13" strokeLinecap="round" strokeLinejoin="round" />
        </Icon>
      ),
      title: 'Conversion optimization',
      text: 'Landing pages and funnels tuned so the clicks you pay for actually convert.',
      tags: ['Landing pages', 'A/B tests'],
    },
    {
      icon: (
        <Icon>
          <path d="M14 4 V2 M14 4 A6 6 0 0 1 20 10 V15 L22 19 H6 L8 15 V10 A6 6 0 0 1 14 4 Z" />
          <path d="M11 19 A3 3 0 0 0 17 19" />
        </Icon>
      ),
      title: 'Weekly reporting',
      text: 'Spend, rankings, leads, and CPA in one clear weekly note, no vanity metrics.',
      tags: ['CPA', 'ROAS', 'Rankings'],
    },
  ],
  flowTitle: (
    <>
      How we <span className="it">grow it</span>
    </>
  ),
  flowIntro:
    'We earn trust with a quick win, fix the foundation, then scale spend only where the numbers hold up.',
  flow: [
    { title: 'Audit', text: 'Where you rank, what you spend, and where the obvious money is leaking out.', time: 'WEEK 1' },
    { title: 'Fix & launch', text: 'Technical fixes, first content, and a lean starter campaign to gather signal.', time: 'WEEK 2–3' },
    { title: 'Optimize', text: 'Weekly tuning, keywords, creative, bids, driving CPA down and quality up.', time: 'ONGOING' },
    { title: 'Scale', text: "Once the math works, we pour fuel on what's winning and cut what isn't.", time: 'MONTH 2+' },
  ],
  pricingTitle: (
    <>
      SEO &amp; ads <span className="it">pricing</span>
    </>
  ),
  pricingIntro: 'Ad spend is billed separately and paid directly to the platforms, our fee is just our work.',
  cards: [
    {
      variant: 'c-starter',
      name: 'Audit',
      h3: (
        <>
          The <span className="it">game plan</span>
        </>
      ),
      desc: 'A full SEO + ads audit with a prioritized 90-day growth roadmap.',
      price: '$2,200',
      priceNote: 'flat',
      billing: '1-week turnaround',
      items: ['Technical SEO audit', 'Ad account teardown', 'Keyword & competitor map', '90-day roadmap + call'],
      ctaLabel: 'Start an audit →',
    },
    {
      variant: 'c-growth',
      featured: true,
      tag: 'Best value',
      name: 'Growth',
      h3: (
        <>
          Run it <span className="it">with us</span>
        </>
      ),
      desc: 'Ongoing SEO and paid management with weekly optimization.',
      price: '$4,200',
      priceNote: '/mo',
      billing: '3-month minimum',
      items: [
        'Technical SEO + content',
        'Google & Meta ad management',
        'Weekly optimization',
        'Landing page A/B tests',
        'Weekly reporting',
      ],
      ctaLabel: 'Book growth →',
    },
    {
      variant: 'c-scale',
      name: 'Scale',
      h3: (
        <>
          Full <span className="it">throttle</span>
        </>
      ),
      desc: 'Multi-channel paid + aggressive content for teams ready to grow fast.',
      price: '$7,500',
      priceNote: '/mo',
      billing: '3-month minimum',
      items: ['Everything in Growth', '3+ paid channels', '8 content pieces / month', 'Dedicated strategist'],
      ctaLabel: 'Talk scale →',
    },
  ],
  faqKicker: 'FAQ · SEO & Ads',
  faqTitle: (
    <>
      Growth <span className="serif-it" style={{ fontStyle: 'italic' }}>questions</span>.
    </>
  ),
  faqs: [
    {
      q: 'How fast will I see results?',
      a: 'Paid can drive leads in week one. SEO is a compounding game, expect meaningful movement around months 3–6. We pair them so you get quick wins while the organic foundation builds.',
    },
    {
      q: 'Is ad spend included in your fee?',
      a: "No, you pay the platforms directly so you keep full ownership and transparency. Our fee covers strategy, build, and management only. We'll recommend a starting budget on the call.",
    },
    {
      q: 'Do you guarantee #1 rankings?',
      a: "Nobody honest can guarantee a specific rank, Google decides. What we guarantee is a sound technical foundation, intent-led content, and complete transparency on what's moving and why.",
    },
    {
      q: 'Can you work with our existing site?',
      a: "Yes. We'll work with whatever platform you're on. If the site itself is holding rankings back, we'll flag it, and our web team can fix it if you want.",
    },
  ],
  ctaH2: (
    <>
      Let&apos;s get
      <br />
      you <span className="stamp">found</span>.
    </>
  ),
  ctaText:
    "Tell us where you want to rank and who you're trying to reach. We'll reply within a few hours with a starting plan.",
  signoff: 'SEO & ads for startups.',
}

export default function SeoAdsPage() {
  return <ServicePage data={data} />
}
