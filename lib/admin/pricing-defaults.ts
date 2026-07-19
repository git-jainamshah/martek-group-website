/**
 * Snapshot of the site's current hardcoded pricing — used to seed the DB
 * the first time the admin panel runs. After that, the DB is the source of truth.
 */
export type PackageDefault = {
  name: string
  price: string
  priceNote?: string
  billing?: string
  description?: string
  tag?: string
  featured?: boolean
  items?: string[]
  ctaLabel?: string
}

export const PAGE_LABELS: Record<string, string> = {
  home: 'Home — Pricing section',
  'pricing-page': 'Pricing page — Packages',
  'web-development': 'Services — Web Development',
  'data-analytics': 'Services — Data & Analytics',
  social: 'Services — Social',
  'seo-ads': 'Services — SEO & Ads',
  engineering: 'Services — Engineering & CAD',
}

export const PRICING_DEFAULTS: Record<string, PackageDefault[]> = {
  home: [
    {
      name: 'Sprint', price: '$2,400', priceNote: 'flat', billing: '14-day delivery',
      description: 'A landing page, an audit, a campaign. Fixed price, fixed scope, fixed timeline.',
      items: ['1 deliverable, scoped up front', 'Daily Slack updates', '2 rounds of feedback', '14-day post-launch fixes'],
      ctaLabel: 'Start a sprint →',
    },
    {
      name: 'Build', price: '$8,400', priceNote: 'from', billing: '4–6 week delivery', featured: true, tag: 'Best value',
      description: 'Site + brand + analytics + launch: your full launch kit, end to end.',
      items: ['Brand & site, end to end', 'Analytics & tracking set up', 'Launch campaign included', 'Weekly Friday demos', '30-day post-launch support'],
      ctaLabel: 'Book a build →',
    },
    {
      name: 'Retainer', price: '$3,800', priceNote: '/mo', billing: '3-month minimum',
      description: 'A small slice of a full team, every month. Design, dev, growth, on tap.',
      items: ['40 hours / month, any service', 'Slack channel, your own PM', 'Weekly priorities call', 'Pause or cancel anytime'],
      ctaLabel: 'Talk retainer →',
    },
  ],
  'pricing-page': [
    {
      name: 'Starter', price: '$499', priceNote: 'one-time',
      description: 'Perfect for small businesses getting started',
      items: ['5-Page Responsive Website', 'Basic SEO Setup', 'Social Media Setup', 'Contact Form Integration', '1 Month Support'],
      ctaLabel: 'Get Started',
    },
    {
      name: 'Professional', price: '$1,299', priceNote: 'one-time', featured: true, tag: 'Most Popular',
      description: 'Ideal for growing businesses',
      items: ['10-Page Custom Website', 'Advanced SEO Optimization', 'Google Analytics Setup', 'Email Marketing Integration', '3 Months Support'],
      ctaLabel: 'Get Started',
    },
    {
      name: 'Enterprise', price: 'Custom', priceNote: 'quote',
      description: 'Tailored solutions for large businesses',
      items: ['Unlimited Pages & Features', 'Digital Marketing Strategy', 'Dedicated Account Manager', '24/7 Support', 'Custom Integrations'],
      ctaLabel: 'Get Quote',
    },
  ],
  'web-development': [
    {
      name: 'Landing sprint', price: '$2,400', priceNote: 'flat', billing: '14-day delivery',
      description: 'A high-converting landing or campaign page, designed & built.',
      items: ['1 page, fully responsive', 'Copy polish + basic SEO', 'CMS-editable hero & sections', '2 rounds of revisions'],
      ctaLabel: 'Start a sprint →',
    },
    {
      name: 'Full site', price: '$8,400', priceNote: 'from', billing: '4–6 week delivery', featured: true, tag: 'Best value',
      description: 'A complete marketing site or product front-end, brand to launch.',
      items: ['5–10 pages or app screens', 'Brand & design system', 'CMS + content migration', 'Performance & a11y pass', '30-day post-launch support'],
      ctaLabel: 'Book a build →',
    },
    {
      name: 'Ongoing', price: '$3,800', priceNote: '/mo', billing: '3-month minimum',
      description: 'We keep building after launch, new pages, tests, and fixes monthly.',
      items: ['40 hours / month of web work', 'New pages & A/B tests', 'Priority bug fixes', 'Pause or cancel anytime'],
      ctaLabel: 'Talk retainer →',
    },
  ],
  'data-analytics': [
    {
      name: 'Audit', price: '$1,800', priceNote: 'flat', billing: '1-week turnaround',
      description: 'A full review of your tracking & funnel, with a prioritized fix list.',
      items: ['Tracking & tagging review', 'Funnel drop-off analysis', 'Prioritized fix list', '60-min walkthrough call'],
      ctaLabel: 'Start an audit →',
    },
    {
      name: 'Setup', price: '$5,200', priceNote: 'from', billing: '2–3 week delivery', featured: true, tag: 'Best value',
      description: 'Tracking, a dashboard, and a working weekly report, done right.',
      items: ['Event tracking & tagging plan', 'Custom dashboard build', 'First month of weekly reports', 'Team training session', '30-day support'],
      ctaLabel: 'Book a setup →',
    },
    {
      name: 'Weekly', price: '$2,600', priceNote: '/mo', billing: '3-month minimum',
      description: 'We run your analytics rhythm so you can run your company.',
      items: ['Weekly 1-page readout', 'Dashboard upkeep', 'Experiment design & analysis', 'Pause or cancel anytime'],
      ctaLabel: 'Talk retainer →',
    },
  ],
  social: [
    {
      name: 'Kickstart', price: '$1,900', priceNote: 'flat', billing: '1–2 week delivery',
      description: 'Strategy, voice, and a 30-day content calendar you can run yourself.',
      items: ['Voice & tone guide', 'Content pillars', '30-day calendar + 6 templates', 'Handover walkthrough'],
      ctaLabel: 'Get kickstarted →',
    },
    {
      name: 'Manage', price: '$3,200', priceNote: '/mo', billing: '2-month minimum', featured: true, tag: 'Best value',
      description: 'Your full social channel, handled, content, posting, and community.',
      items: ['12+ posts / month', 'Daily community management', 'Monthly creative drop', 'Monthly performance report', '1 channel (add more anytime)'],
      ctaLabel: 'Let us run it →',
    },
    {
      name: 'Amplify', price: '$5,400', priceNote: '/mo', billing: '3-month minimum',
      description: 'Everything in Manage, plus creator partnerships and launch campaigns.',
      items: ['Everything in Manage', 'Creator sourcing & deals', '2 channels', 'Quarterly launch campaign'],
      ctaLabel: 'Talk amplify →',
    },
  ],
  'seo-ads': [
    {
      name: 'Audit', price: '$2,200', priceNote: 'flat', billing: '1-week turnaround',
      description: 'A full SEO + ads audit with a prioritized 90-day growth roadmap.',
      items: ['Technical SEO audit', 'Ad account teardown', 'Keyword & competitor map', '90-day roadmap + call'],
      ctaLabel: 'Start an audit →',
    },
    {
      name: 'Growth', price: '$4,200', priceNote: '/mo', billing: '3-month minimum', featured: true, tag: 'Best value',
      description: 'Ongoing SEO and paid management with weekly optimization.',
      items: ['Technical SEO + content', 'Google & Meta ad management', 'Weekly optimization', 'Landing page A/B tests', 'Weekly reporting'],
      ctaLabel: 'Book growth →',
    },
    {
      name: 'Scale', price: '$7,500', priceNote: '/mo', billing: '3-month minimum',
      description: 'Multi-channel paid + aggressive content for teams ready to grow fast.',
      items: ['Everything in Growth', '3+ paid channels', '8 content pieces / month', 'Dedicated strategist'],
      ctaLabel: 'Talk scale →',
    },
  ],
  engineering: [
    {
      name: 'Per drawing', price: '$180', priceNote: 'from', billing: '2–4 day turnaround',
      description: 'A single dimensioned drawing or model from your sketch or sample.',
      items: ['1 production drawing or model', 'Your standard & title block', '2 revision rounds', 'DWG, STEP & PDF export'],
      ctaLabel: 'Send a drawing →',
    },
    {
      name: 'Project', price: '$2,800', priceNote: 'from', billing: '1–2 week delivery', featured: true, tag: 'Best value',
      description: 'A complete assembly: models, drawings, BOM, and documentation.',
      items: ['Full assembly modelling', 'Complete drawing set + BOM', 'DFM review', 'All source & export files', 'Revision tracking'],
      ctaLabel: 'Scope a project →',
    },
    {
      name: 'Retainer', price: '$2,400', priceNote: '/mo', billing: 'Monthly, flexible',
      description: 'A steady drafting partner for fabricators and product teams.',
      items: ['40 hours / month of CAD', 'Priority turnaround', 'Consistent standards & archive', 'Scale up or down monthly'],
      ctaLabel: 'Talk retainer →',
    },
  ],
}
