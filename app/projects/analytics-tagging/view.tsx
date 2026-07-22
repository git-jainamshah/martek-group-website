'use client'

import CaseStudyPage, { CaseStudyData } from '@/components/case-studies/CaseStudyPage'
import DataDashboard from '@/components/case-studies/DataDashboard'

const data: CaseStudyData = {
  slug: 'analytics-tagging',
  accentClass: 'accent-data',
  contactQuery: 'data',
  category: 'Data & Analytics',
  crumb: 'Analytics & Tagging',
  h1: <>Stop guessing. <span className="it">Measure</span> what actually works</>,
  summary:
    'Imagine a retail brand spending on ads but flying blind, with broken tags and numbers no one trusts. This is how we would think about rebuilding their analytics into a clean, accurate tagging setup, shown as an example of our approach rather than a promise.',
  heroStats: [
    { v: 'Trustworthy', k: 'Numbers you can use' },
    { v: 'One', k: 'Source of truth' },
    { v: '~4 wks', k: 'Audit to live' },
  ],
  challengeKicker: 'The scenario',
  challenge: [
    'A common picture: years of quick fixes have left the analytics stack a mess. Duplicate tags, events firing twice, conversions that do not match the payment processor, and a GA4 migration that stalled halfway.',
    'Marketing cannot trust a single number, so budget decisions get made on gut feel. If this were the brief, our aim would be one source of truth, accurate enough to move real spend against and simple enough for the whole team to read.',
  ],
  interactiveTitle: <>Explore a sample <span className="it">dashboard</span></>,
  approachIntro:
    'We would take an audit-first approach, fixing the foundation before touching dashboards, so every number downstream is trustworthy.',
  approach: [
    { title: 'Tag audit', text: 'We would inventory every tag, trigger, and event, then document what is broken, duplicated, or missing.', time: 'Week 1' },
    { title: 'Measurement plan', text: 'A single spec defining every event, parameter, and conversion, agreed with marketing before anything changes.', time: 'Week 1-2' },
    { title: 'Rebuild in GTM/GA4', text: 'Clean server-side and client-side tagging, consent-aware, with QA on every event against the source of truth.', time: 'Week 2-3' },
    { title: 'Dashboards & handover', text: 'Reports the team actually opens, plus a short governance doc so the setup stays clean as you grow.', time: 'Week 4' },
  ],
  buildIntro: 'The kind of measurement foundation we would aim to leave you with: accurate, privacy-compliant, and cheaper to run than the patchwork it replaces.',
  build: [
    { title: 'GA4 done right', text: 'A clean GA4 property with a proper event model, so reports match reality and the migration is finally finished.', tags: ['GA4', 'Event model'] },
    { title: 'Server-side tagging', text: 'Server-side GTM for accuracy and resilience against ad blockers and browser tracking limits.', tags: ['GTM', 'Server-side'] },
    { title: 'Consent & compliance', text: 'Consent Mode and a privacy-first setup so tracking is both accurate and compliant by default.', tags: ['Consent Mode', 'Privacy'] },
    { title: 'Conversion accuracy', text: 'Conversions reconciled against your backend and ad platforms so every channel is measured on the same ruler.', tags: ['Reconciliation'] },
    { title: 'Trusted dashboards', text: 'Looker Studio or GA4 dashboards built around decisions, not vanity metrics, with clear owners.', tags: ['Looker', 'Reporting'] },
    { title: 'Governance', text: 'Naming conventions and a change process so the stack stays clean instead of drifting back into chaos.', tags: ['Governance', 'Docs'] },
  ],
  outcomeTagline: 'What we’d aim for (example)',
  outcomeH3: <>A <em>clearer</em> picture to decide with</>,
  outcomeText:
    'In a scenario like this, the goal would be simple: marketing can finally see which channels earn and which just spend, shift budget with more confidence, and stop paying for tools and clicks that never mattered. Direction, not a guaranteed number.',
  outcomeMetrics: [
    { v: 'Clear', k: 'Which channels earn' },
    { v: 'Less', k: 'Wasted ad spend' },
    { v: 'Faster', k: 'Confident decisions' },
  ],
  quote: 'One source of truth the whole team trusts.',
  quoteAttribution: 'Marrelay · Data & Analytics',
  ctaH2: <>Want numbers you can <span className="it">actually trust?</span></>,
  ctaText: 'Send us your current setup. We will take a realistic look, tell you what is likely broken, and sketch a path to decision-ready data.',
  seoName: 'Analytics & Tagging Case Study - Clearer Measurement (Illustrative)',
  seoDescription: 'An illustrative example of how Marrelay would rebuild a broken analytics stack into an accurate, consent-compliant GA4 and server-side tagging setup marketing can trust.',
}

export default function AnalyticsTaggingPageView({ bannerVideo }: { bannerVideo: string }) {
  return <CaseStudyPage data={{ ...data, interactive: <DataDashboard /> }} media={bannerVideo} />
}
