import type { Metadata } from 'next'
import ServicePage, { ServiceData } from '@/components/services/ServicePage'
import { mergePackages } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Social · Martek Group',
  description:
    'We run your channels end to end: strategy, content, community, and creator partnerships.',
  alternates: { canonical: '/services/social' },
  openGraph: { url: '/services/social' },
}

const stage = (
  <div className="hero-stage">
    <div className="dotgrid"></div>
    <div className="scene-phone float-a">
      <div className="pbar">
        <span className="av"></span>
        <b>@yourbrand</b>
      </div>
      <div className="post">
        <div className="img">✶</div>
        <div className="meta">
          <span className="heart">♥</span>
          <small>1,204</small>
          <small style={{ marginLeft: 'auto' }}>just now</small>
        </div>
      </div>
      <div className="post" style={{ marginTop: 0 }}>
        <div className="img" style={{ background: 'var(--sage-soft)' }}>✶</div>
      </div>
    </div>
    <div className="bubble b1 float-b">love this</div>
    <div className="bubble b2 float-c">where to buy?</div>
    <div className="bubble b3 float-a">shipped!</div>
    <div className="badge badge-foll float-b">
      <span className="d" style={{ background: 'var(--accent)' }}></span>+318 followers
    </div>
  </div>
)

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 28 28" fill="none" stroke="var(--ink)" strokeWidth="1.8">
    {children}
  </svg>
)

const data: ServiceData = {
  accentClass: 'accent-social',
  contactQuery: 'social',
  crumb: 'Social',
  tagNo: '04',
  tagLabel: 'Social',
  h1: (
    <>
      A <span className="hl">voice</span> people
      <br />
      actually <span className="it">follow</span>.
    </>
  ),
  lede: (
    <>
      Tiny brands don&apos;t need more posts, they need a point of view. We run your channels end to end:{' '}
      <b>strategy, content, community, and creator partnerships</b>.
    </>
  ),
  miniStats: [
    { v: '12+', k: 'posts a month' },
    { v: '<1h', k: 'reply time, work hours' },
    { v: 'DMs', k: 'turned into customers' },
  ],
  stage,
  includedIntro: "We don't just schedule posts, we run the whole channel like it's our own brand. Pick what you need.",
  deliverables: [
    {
      icon: (
        <Icon>
          <circle cx="14" cy="14" r="10" />
          <path d="M14 4 V14 L21 18" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Content strategy',
      text: 'A clear voice, content pillars, and a calendar, so every post ladders up to something.',
      tags: ['Voice & tone', 'Calendar'],
    },
    {
      icon: (
        <Icon>
          <rect x="5" y="3" width="14" height="22" rx="3" />
          <circle cx="12" cy="20" r="1.2" fill="var(--ink)" stroke="none" />
          <rect x="22" y="9" width="2" height="8" rx="1" fill="var(--accent)" stroke="none" />
        </Icon>
      ),
      title: 'Content production',
      text: "Monthly creative drops, graphics, short video, and carousels you'll actually want to post.",
      tags: ['Reels', 'Carousels', 'Graphics'],
    },
    {
      icon: (
        <Icon>
          <path d="M5 7 H23 V18 H13 L8 22 V18 H5 Z" />
          <path d="M9 12 H19 M9 15 H15" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Community management',
      text: 'We reply to comments and DMs in your voice, fast, turning lurkers into loyal customers.',
      tags: ['Replies', 'DMs', 'Moderation'],
    },
    {
      icon: (
        <Icon>
          <circle cx="10" cy="10" r="4" />
          <circle cx="19" cy="13" r="3" />
          <path d="M3 23 Q3 16 10 16 Q14 16 16 19 M16 19 Q17 17 19 17 Q25 17 25 23" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Creator & influencer deals',
      text: 'We find, vet, and brief the right creators, and handle the awkward money conversations.',
      tags: ['Outreach', 'Briefs', 'UGC'],
    },
    {
      icon: (
        <Icon>
          <path d="M4 22 V6 M4 22 H24 M9 18 V12 M14 18 V8 M19 18 V14" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Reporting',
      text: 'A monthly readout that ties posts to followers, saves, and, where it counts, sales.',
      tags: ['Monthly report', 'Insights'],
    },
    {
      icon: (
        <Icon>
          <path d="M14 3 L17 11 L25 11 L18.5 16 L21 24 L14 19 L7 24 L9.5 16 L3 11 L11 11 Z" strokeLinejoin="round" />
        </Icon>
      ),
      title: 'Launch moments',
      text: 'Product drops, giveaways, and campaigns that create a spike, and capture it for later.',
      tags: ['Campaigns', 'Giveaways'],
    },
  ],
  flowTitle: (
    <>
      How we <span className="it">run it</span>
    </>
  ),
  flowIntro:
    'We start with a voice and a plan, then settle into a calm monthly rhythm. You approve, we handle the rest.',
  flow: [
    { title: 'Listen', text: 'We study your brand, audience, and best-performing posts to find the real voice.', time: 'WEEK 1' },
    { title: 'Plan', text: 'Content pillars and a month-one calendar you sign off on before anything goes live.', time: 'WEEK 1–2' },
    { title: 'Create & post', text: 'We produce, schedule, and publish, then reply to your community in real time.', time: 'ONGOING' },
    { title: 'Review', text: "A monthly readout and a plan for next month, tuned to what's actually working.", time: 'MONTHLY' },
  ],
  pricingTitle: (
    <>
      Social <span className="it">pricing</span>
    </>
  ),
  pricingIntro: 'Pick the level of support you need. Most brands start with Manage and add campaigns as they grow.',
  cards: [
    {
      variant: 'c-starter',
      name: 'Kickstart',
      h3: (
        <>
          Voice &amp; <span className="it">plan</span>
        </>
      ),
      desc: 'Strategy, voice, and a 30-day content calendar you can run yourself.',
      price: '$1,900',
      priceNote: 'flat',
      billing: '1–2 week delivery',
      items: ['Voice & tone guide', 'Content pillars', '30-day calendar + 6 templates', 'Handover walkthrough'],
      ctaLabel: 'Get kickstarted →',
    },
    {
      variant: 'c-growth',
      featured: true,
      tag: 'Best value',
      name: 'Manage',
      h3: (
        <>
          We <span className="it">run</span> it
        </>
      ),
      desc: 'Your full social channel, handled, content, posting, and community.',
      price: '$3,200',
      priceNote: '/mo',
      billing: '2-month minimum',
      items: [
        '12+ posts / month',
        'Daily community management',
        'Monthly creative drop',
        'Monthly performance report',
        '1 channel (add more anytime)',
      ],
      ctaLabel: 'Let us run it →',
    },
    {
      variant: 'c-scale',
      name: 'Amplify',
      h3: (
        <>
          Manage <span className="it">+ creators</span>
        </>
      ),
      desc: 'Everything in Manage, plus creator partnerships and launch campaigns.',
      price: '$5,400',
      priceNote: '/mo',
      billing: '3-month minimum',
      items: ['Everything in Manage', 'Creator sourcing & deals', '2 channels', 'Quarterly launch campaign'],
      ctaLabel: 'Talk amplify →',
    },
  ],
  faqKicker: 'FAQ · Social',
  faqTitle: (
    <>
      Social <span className="serif-it" style={{ fontStyle: 'italic' }}>questions</span>.
    </>
  ),
  faqs: [
    {
      q: 'Which platforms do you cover?',
      a: 'Instagram, TikTok, LinkedIn, and X are our most common. We focus on the one or two where your audience actually is, rather than spreading thin across all of them.',
    },
    {
      q: 'Do you create the content or just schedule it?',
      a: "We create it, graphics, short video, and copy. If you have a product or founder happy to film quick clips, we'll turn that raw footage into a month of content.",
    },
    {
      q: 'Will it sound like us, not like an agency?',
      a: "That's the whole point. We build a voice guide with you first and check in often early on, so replies and posts feel like they came from your team.",
    },
    {
      q: 'How quickly do you reply to our community?',
      a: 'Within an hour during work hours on Manage and Amplify plans. Fast replies are where small brands win, so we treat the inbox as a priority, not an afterthought.',
    },
  ],
  ctaH2: (
    <>
      Let&apos;s give you
      <br />a <span className="stamp">voice</span>.
    </>
  ),
  ctaText: "Tell us about your brand and where you want to show up. We'll reply within a few hours with a starting plan.",
  signoff: 'social for startups.',
}

export default async function SocialPage() {
  return <ServicePage data={{ ...data, cards: await mergePackages('social', data.cards) }} />
}
