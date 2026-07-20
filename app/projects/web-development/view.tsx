'use client'

import CaseStudyPage, { CaseStudyData } from '@/components/case-studies/CaseStudyPage'

const data: CaseStudyData = {
  slug: 'web-development',
  accentClass: 'accent-web',
  contactQuery: 'web',
  category: 'Web Development',
  crumb: 'Web Development',
  h1: <>A website that <span className="it">sells</span>, not just sits there</>,
  summary:
    'A hypothetical growth-stage brand came to us with a slow, hard-to-edit site that looked fine but converted poorly. Here is exactly how we would rebuild it into a fast, scalable ecosystem their team can run themselves.',
  heroStats: [
    { v: '0.8s', k: 'Target load time' },
    { v: '+150%', k: 'Conversion lift goal' },
    { v: '4 wks', k: 'Design to launch' },
  ],
  challengeKicker: 'The challenge',
  challenge: [
    'The old site was built on a page builder that had grown into a tangle. Every edit needed a developer, pages loaded in four to five seconds, and mobile visitors bounced before the hero even rendered.',
    'Leads trickled in through a single contact form with no tracking, so the team could not tell which pages or campaigns actually drove revenue. They needed a site that was fast, measurable, and easy to update without touching code.',
  ],
  approachIntro:
    'We work in tight, visible loops so you always know what is happening. Discovery to launch runs about four weeks for a site this size.',
  approach: [
    { title: 'Audit & map', text: 'We audit speed, SEO, and the current funnel, then map the pages and journeys that matter to revenue.', time: 'Week 1' },
    { title: 'Design the system', text: 'A reusable design system, not one-off pages, so the site stays consistent and cheap to extend later.', time: 'Week 1-2' },
    { title: 'Build & instrument', text: 'Hand-coded on a modern stack with analytics, tagging, and conversion tracking wired in from day one.', time: 'Week 2-3' },
    { title: 'Launch & hand over', text: 'We ship, load-test, and hand you a CMS plus a short walkthrough so your team can edit confidently.', time: 'Week 4' },
  ],
  buildIntro: 'Everything is engineered to be fast, accessible, and genuinely easy for a non-technical team to run.',
  build: [
    { title: 'Conversion-first pages', text: 'Landing pages and a homepage structured around one clear action, with copy and layout built to move visitors to enquire.', tags: ['UX', 'Copy', 'A/B ready'] },
    { title: 'Editable CMS', text: 'A clean content model so your team updates copy, images, and pages without a developer or fear of breaking layout.', tags: ['CMS', 'No-code edits'] },
    { title: 'Speed & SEO baseline', text: 'Image optimisation, clean markup, structured data, and Core Web Vitals in the green from launch.', tags: ['Core Web Vitals', 'Schema'] },
    { title: 'Analytics & tracking', text: 'GA4, event tracking, and a lead pipeline so every enquiry is attributed to the page and campaign that earned it.', tags: ['GA4', 'Attribution'] },
    { title: 'Scalable foundation', text: 'A component library and hosting that autoscale, so growth and new pages never mean a rebuild.', tags: ['Design system', 'Autoscale'] },
    { title: 'Accessibility', text: 'WCAG-minded contrast, keyboard navigation, and semantic structure so the site works for everyone.', tags: ['WCAG', 'A11y'] },
  ],
  outcomeTagline: 'What good looks like',
  outcomeH3: <>A <em>scalable</em> brand ecosystem</>,
  outcomeText:
    'The rebuilt site loads in under a second, ranks on the pages that matter, and lets the team ship new campaigns in hours instead of weeks. Every lead is tracked end to end, so marketing spend finally has a scoreboard.',
  outcomeMetrics: [
    { v: '0.8', sup: 's', k: 'Load time (from 4.5s)' },
    { v: '+150', sup: '%', k: 'Conversion uplift target' },
    { v: '50k', sup: '+', k: 'Users handled at peak' },
  ],
  quote: 'Built to be handed over, not held hostage.',
  quoteAttribution: 'Marrelay · Web Development',
  ctaH2: <>Ready for a site that <span className="it">earns its keep?</span></>,
  ctaText: 'Tell us what you are building. We will map the fastest path from your current site to one that converts and scales.',
  seoName: 'Web Development Case Study — Scalable Brand Ecosystem',
  seoDescription: 'How Marrelay rebuilds a slow, hard-to-edit website into a fast, measurable, conversion-focused ecosystem the team can run themselves.',
}

export default function WebDevelopmentPageView({ bannerVideo }: { bannerVideo: string }) {
  return <CaseStudyPage data={data} media={bannerVideo} />
}
