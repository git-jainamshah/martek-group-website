'use client'

import CaseStudyPage, { CaseStudyData } from '@/components/case-studies/CaseStudyPage'

const data: CaseStudyData = {
  slug: 'engineering-drawings',
  accentClass: 'accent-eng',
  contactQuery: 'engineering',
  category: 'Engineering & CAD',
  crumb: 'Engineering Drawings',
  h1: <>Shop-floor drawings that <span className="it">leave no room to guess</span></>,
  summary:
    'A hypothetical small-scale manufacturer was losing time and material to vague sketches and rework. Here is how we would deliver precise CAD/CAM drawings that let them quote faster, build cleaner, and compete with much larger shops.',
  heroStats: [
    { v: '±0.01mm', k: 'Tolerance target' },
    { v: '3x', k: 'Faster to production' },
    { v: '-25%', k: 'Material waste goal' },
  ],
  challengeKicker: 'The challenge',
  challenge: [
    'Parts were being made from hand sketches and verbal instructions. Tolerances lived in someone’s head, revisions were scribbled on printouts, and every ambiguous dimension turned into scrap, rework, or a frustrated customer.',
    'They wanted to take on bigger, more precise jobs but could not produce the professional, unambiguous drawings those clients expect. They needed engineering documentation that a machinist could build from without a single phone call.',
  ],
  approachIntro:
    'We turn intent into precise, manufacturable documentation, with tolerances and revisions handled the way a serious shop expects.',
  approach: [
    { title: 'Requirements & intent', text: 'We capture function, fit, and constraints so the model is built around how the part actually has to perform.', time: 'Step 1' },
    { title: 'CAD modelling', text: 'Parametric 3D models that are easy to revise, with a clean feature tree instead of a fragile one-off file.', time: 'Step 2' },
    { title: 'Drawings & tolerancing', text: 'Fully dimensioned drawings with GD&T, so tolerances are explicit and nothing is left to interpretation.', time: 'Step 3' },
    { title: 'CAM & handover', text: 'Toolpaths and manufacturing-ready files, with a revision system so the shop always builds the right version.', time: 'Step 4' },
  ],
  buildIntro: 'Documentation precise enough for professional manufacturing, and organised enough to reuse on the next job.',
  build: [
    { title: 'Parametric 3D models', text: 'Clean, editable CAD models that flex when the design changes instead of forcing a rebuild from scratch.', tags: ['SolidWorks', 'Fusion 360'] },
    { title: 'GD&T drawings', text: 'Geometric dimensioning and tolerancing so fit and function are guaranteed, not hoped for.', tags: ['GD&T', 'ISO'] },
    { title: 'CAM & toolpaths', text: 'Manufacturing-ready CAM output that minimises material waste and machine time on the floor.', tags: ['CAM', 'Toolpaths'] },
    { title: 'Revision control', text: 'A clear revision and release system so the shop never machines an out-of-date drawing.', tags: ['Rev control', 'Release'] },
    { title: 'Design for manufacture', text: 'DFM review to flag features that are expensive or risky to make before a single chip is cut.', tags: ['DFM', 'Cost'] },
    { title: 'Quote-ready packages', text: 'Complete drawing packages that let you quote bigger, more demanding jobs with confidence.', tags: ['Docs', 'Quoting'] },
  ],
  outcomeTagline: 'What good looks like',
  outcomeH3: <>CAD/CAM <em>precision</em>, shop-floor ready</>,
  outcomeText:
    'With unambiguous drawings, the shop cuts rework to near zero, moves through production noticeably faster, and wins the kind of precision work that used to go to larger competitors.',
  outcomeMetrics: [
    { v: '0', sup: '%', k: 'Defect rate post-design' },
    { v: '3x', k: 'Faster production' },
    { v: '-25', sup: '%', k: 'Material waste' },
  ],
  quote: 'Precise enough to build from, with zero phone calls.',
  quoteAttribution: 'Marrelay · Engineering & CAD',
  ctaH2: <>Have a part that needs <span className="it">real drawings?</span></>,
  ctaText: 'Send us a sketch, a sample, or an idea. We will turn it into precise, manufacturable CAD/CAM documentation your shop can build from.',
  seoName: 'Engineering & CAD Case Study — CAD/CAM for Small-Scale Manufacturing',
  seoDescription: 'How Marrelay turns vague sketches into precise, GD&T-toleranced CAD/CAM drawings that cut rework and help small manufacturers win bigger, precision work.',
}

export default function EngineeringDrawingsPageView({ bannerVideo }: { bannerVideo: string }) {
  return <CaseStudyPage data={data} media={bannerVideo} />
}
