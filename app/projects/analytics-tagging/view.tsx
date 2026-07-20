'use client'

import CaseStudyPage, { CaseStudyData } from '@/components/case-studies/CaseStudyPage'

const data: CaseStudyData = {
  slug: 'analytics-tagging',
  accentClass: 'accent-data',
  contactQuery: 'data',
  category: 'Data & Analytics',
  crumb: 'Analytics & Tagging',
  h1: <>Stop guessing. <span className="it">Measure</span> what actually works</>,
  summary:
    'A hypothetical retail brand was spending on ads but flying blind, with broken tags and numbers no one trusted. Here is how we would rebuild their analytics into a clean, accurate tagging architecture that pays for itself.',
  heroStats: [
    { v: '99.8%', k: 'Data accuracy target' },
    { v: '12x', k: 'First-quarter ROI goal' },
    { v: '4 wks', k: 'Audit to live' },
  ],
  challengeKicker: 'The challenge',
  challenge: [
    'Years of quick fixes had left the analytics stack a mess: duplicate tags, events firing twice, conversions that did not match the payment processor, and a GA4 migration that stalled halfway.',
    'Marketing could not trust a single number, so budget decisions were made on gut feel. They needed one source of truth, accurate enough to move real spend against and simple enough for the whole team to read.',
  ],
  approachIntro:
    'A disciplined audit-first process. We fix the foundation before touching dashboards, so every number downstream is trustworthy.',
  approach: [
    { title: 'Tag audit', text: 'We inventory every tag, trigger, and event, then document what is broken, duplicated, or missing against your goals.', time: 'Week 1' },
    { title: 'Measurement plan', text: 'A single spec that defines every event, parameter, and conversion, agreed with marketing before a line changes.', time: 'Week 1-2' },
    { title: 'Rebuild in GTM/GA4', text: 'Clean server-side and client-side tagging, consent-aware, with QA on every event against the source of truth.', time: 'Week 2-3' },
    { title: 'Dashboards & handover', text: 'Reports the team actually opens, plus a governance doc so the setup stays clean as you grow.', time: 'Week 4' },
  ],
  buildIntro: 'A measurement foundation that is accurate, privacy-compliant, and cheaper to run than the patchwork it replaces.',
  build: [
    { title: 'GA4 done right', text: 'A clean GA4 property with a proper event model, so reports match reality and the migration is finally finished.', tags: ['GA4', 'Event model'] },
    { title: 'Server-side tagging', text: 'Server-side GTM for accuracy and resilience against ad blockers and browser tracking limits.', tags: ['GTM', 'Server-side'] },
    { title: 'Consent & compliance', text: 'Consent Mode and a privacy-first setup so tracking is both accurate and compliant by default.', tags: ['Consent Mode', 'Privacy'] },
    { title: 'Conversion accuracy', text: 'Conversions reconciled against your backend and ad platforms so every channel is measured on the same ruler.', tags: ['Reconciliation', 'Attribution'] },
    { title: 'Trusted dashboards', text: 'Looker Studio or GA4 dashboards built around decisions, not vanity metrics, with clear owners.', tags: ['Looker', 'Reporting'] },
    { title: 'Governance', text: 'Naming conventions and a change process so the stack stays clean instead of drifting back into chaos.', tags: ['Governance', 'Docs'] },
  ],
  outcomeTagline: 'What good looks like',
  outcomeH3: <>A <em>data-driven</em> decision engine</>,
  outcomeText:
    'With accurate tracking, marketing can finally see which channels earn and which drain, shift budget with confidence, and cut wasted SaaS spend. The setup pays for itself many times over in the first quarter.',
  outcomeMetrics: [
    { v: '99.8', sup: '%', k: 'Data accuracy (from 85%)' },
    { v: '40', sup: '%', k: 'SaaS spend saved' },
    { v: '12x', k: 'First-quarter ROI target' },
  ],
  quote: 'One source of truth the whole team trusts.',
  quoteAttribution: 'Marrelay · Data & Analytics',
  ctaH2: <>Want numbers you can <span className="it">actually trust?</span></>,
  ctaText: 'Send us your current setup. We will audit it, tell you what is broken, and show you the path to accurate, decision-ready data.',
  seoName: 'Analytics & Tagging Case Study — Enterprise Retail Measurement',
  seoDescription: 'How Marrelay rebuilds a broken analytics stack into an accurate, consent-compliant GA4 and server-side tagging architecture that marketing can trust.',
}

export default function AnalyticsTaggingPageView({ bannerVideo }: { bannerVideo: string }) {
  return <CaseStudyPage data={data} media={bannerVideo} />
}
