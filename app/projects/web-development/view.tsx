'use client'

import CaseStudyPage, { CaseStudyData } from '@/components/case-studies/CaseStudyPage'
import WebBeforeAfter from '@/components/case-studies/WebBeforeAfter'

const data: CaseStudyData = {
  slug: 'web-development',
  accentClass: 'accent-web',
  contactQuery: 'web',
  category: 'Web Development',
  crumb: 'Web Development',
  h1: <>A website that <span className="it">sells</span>, not just sits there</>,
  summary:
    'Imagine a growth-stage brand with a good-looking but slow, hard-to-edit site that quietly loses leads. This is how we would think about rebuilding it into a fast, measurable site their own team can run. It is an example of our approach, not a fixed recipe.',
  heroStats: [
    { v: '≈1.8s', k: 'Load time we’d target' },
    { v: 'Fewer', k: 'Drop-offs on mobile' },
    { v: '~4 wks', k: 'Design to launch' },
  ],
  challengeKicker: 'The scenario',
  challenge: [
    'Picture the setup we often hear about: a site built on a page builder that has grown into a tangle. Every edit needs a developer, pages take four to five seconds to load, and mobile visitors leave before the hero even renders.',
    'Leads come through a single contact form with no tracking, so no one can tell which pages or campaigns actually drive revenue. If this were the brief, our goal would be a site that is fast, measurable, and easy to update without touching code.',
  ],
  interactiveTitle: <>See the <span className="it">before &amp; after</span></>,
  approachIntro:
    'We would work in tight, visible loops so you always know what is happening. For a site this size, discovery to launch would usually run about four weeks.',
  approach: [
    { title: 'Audit & map', text: 'We would audit speed, SEO, and the current funnel, then map the pages and journeys that matter to revenue.', time: 'Week 1' },
    { title: 'Design the system', text: 'A reusable design system, not one-off pages, so the site stays consistent and cheap to extend later.', time: 'Week 1-2' },
    { title: 'Build & instrument', text: 'Hand-coded on a modern stack, with analytics and conversion tracking wired in from day one.', time: 'Week 2-3' },
    { title: 'Launch & hand over', text: 'We would ship, load-test, and hand you a CMS plus a short walkthrough so your team can edit confidently.', time: 'Week 4' },
  ],
  buildIntro: 'The kind of things we would aim to deliver, all engineered to be fast, accessible, and genuinely easy for a non-technical team to run.',
  build: [
    { title: 'Conversion-first pages', text: 'Pages structured around one clear action, with copy and layout designed to move visitors to enquire.', tags: ['UX', 'Copy'] },
    { title: 'Editable CMS', text: 'A clean content model so your team updates copy, images, and pages without a developer or fear of breaking layout.', tags: ['CMS', 'No-code edits'] },
    { title: 'Speed & SEO baseline', text: 'Image optimisation, clean markup, structured data, and Core Web Vitals in good shape from launch.', tags: ['Core Web Vitals', 'Schema'] },
    { title: 'Analytics & tracking', text: 'GA4, event tracking, and a lead pipeline so enquiries are attributed to the page and campaign that earned them.', tags: ['GA4', 'Attribution'] },
    { title: 'Scalable foundation', text: 'A component library and hosting that scale, so new pages and growth do not mean a rebuild.', tags: ['Design system'] },
    { title: 'Accessibility', text: 'WCAG-minded contrast, keyboard navigation, and semantic structure so the site works for everyone.', tags: ['WCAG', 'A11y'] },
  ],
  outcomeTagline: 'What we’d aim for (example)',
  outcomeH3: <>A <em>faster</em>, measurable site</>,
  outcomeText:
    'In a scenario like this, we would be aiming for pages that load quickly, rank for the terms that matter, and let the team ship campaigns in hours instead of weeks, with every enquiry tracked end to end. These are goals to work toward, not guarantees.',
  outcomeMetrics: [
    { v: '≈1.8', sup: 's', k: 'Load-time target' },
    { v: 'More', k: 'Qualified enquiries' },
    { v: 'Easier', k: 'For your team to run' },
  ],
  quote: 'Built to be handed over, not held hostage.',
  quoteAttribution: 'Marrelay · Web Development',
  ctaH2: <>Curious what this could look like for <span className="it">your site?</span></>,
  ctaText: 'Tell us what you are building. We will sketch a realistic, no-pressure path from your current site to one that converts and scales.',
  seoName: 'Web Development Case Study — A Faster, Measurable Site (Illustrative)',
  seoDescription: 'An illustrative example of how Marrelay would rebuild a slow, hard-to-edit website into a fast, measurable, conversion-focused site a team can run themselves.',
}

export default function WebDevelopmentPageView({ bannerVideo }: { bannerVideo: string }) {
  return <CaseStudyPage data={{ ...data, interactive: <WebBeforeAfter /> }} media={bannerVideo} />
}
