'use client'

import CaseStudyPage, { CaseStudyData } from '@/components/case-studies/CaseStudyPage'
import CadMotor from '@/components/case-studies/CadMotor'

const data: CaseStudyData = {
  slug: 'engineering-drawings',
  accentClass: 'accent-eng',
  contactQuery: 'engineering',
  category: 'Engineering & CAD',
  crumb: 'Engineering Drawings',
  h1: <>Shop-floor drawings that <span className="it">leave no room to guess</span></>,
  summary:
    'Imagine a small manufacturer losing time and material to vague sketches and rework. This is how we would think about delivering precise CAD/CAM drawings that let them quote faster and build cleaner. It is an example of our approach, not a real job or a promise.',
  heroStats: [
    { v: 'Tighter', k: 'Tolerances, documented' },
    { v: 'Fewer', k: 'Reworks & scrap' },
    { v: 'Bigger', k: 'Jobs you can quote' },
  ],
  challengeKicker: 'The scenario',
  challenge: [
    'A situation we hear about often: parts made from hand sketches and verbal instructions. Tolerances live in someone’s head, revisions are scribbled on printouts, and every ambiguous dimension turns into scrap, rework, or a frustrated customer.',
    'The shop wants bigger, more precise jobs but cannot produce the professional drawings those clients expect. If this were the brief, our aim would be documentation a machinist can build from without a single phone call.',
  ],
  interactiveTitle: <>Explore a <span className="it">sample assembly</span></>,
  approachIntro:
    'We would turn intent into precise, manufacturable documentation, handling tolerances and revisions the way a serious shop expects.',
  approach: [
    { title: 'Requirements & intent', text: 'We would capture function, fit, and constraints so the model is built around how the part actually has to perform.', time: 'Step 1' },
    { title: 'CAD modelling', text: 'Parametric 3D models that are easy to revise, with a clean feature tree instead of a fragile one-off file.', time: 'Step 2' },
    { title: 'Drawings & tolerancing', text: 'Fully dimensioned drawings with GD&T, so tolerances are explicit and nothing is left to interpretation.', time: 'Step 3' },
    { title: 'CAM & handover', text: 'Toolpaths and manufacturing-ready files, with a revision system so the shop always builds the right version.', time: 'Step 4' },
  ],
  buildIntro: 'The kind of documentation we would aim to deliver: precise enough for professional manufacturing, and organised enough to reuse on the next job.',
  build: [
    { title: 'Parametric 3D models', text: 'Clean, editable CAD models that flex when the design changes instead of forcing a rebuild from scratch.', tags: ['SolidWorks', 'Fusion 360'] },
    { title: 'GD&T drawings', text: 'Geometric dimensioning and tolerancing so fit and function are defined, not left to interpretation.', tags: ['GD&T', 'ISO'] },
    { title: 'CAM & toolpaths', text: 'Manufacturing-ready CAM output that helps reduce material waste and machine time on the floor.', tags: ['CAM', 'Toolpaths'] },
    { title: 'Revision control', text: 'A clear revision and release system so the shop never machines an out-of-date drawing.', tags: ['Rev control'] },
    { title: 'Design for manufacture', text: 'DFM review to flag features that are expensive or risky to make before a single chip is cut.', tags: ['DFM', 'Cost'] },
    { title: 'Quote-ready packages', text: 'Complete drawing packages so you can quote bigger, more demanding jobs with confidence.', tags: ['Docs', 'Quoting'] },
  ],
  outcomeTagline: 'What we’d aim for (example)',
  outcomeH3: <>CAD/CAM <em>clarity</em>, shop-floor ready</>,
  outcomeText:
    'In a scenario like this, the goal would be unambiguous drawings that cut rework, keep production moving, and help the shop win the kind of precision work that used to go elsewhere. A direction to aim for, not a guaranteed figure.',
  outcomeMetrics: [
    { v: 'Fewer', k: 'Reworks & scrap' },
    { v: 'Less', k: 'Wasted material' },
    { v: 'Clearer', k: 'Shop-floor drawings' },
  ],
  quote: 'Precise enough to build from, with zero phone calls.',
  quoteAttribution: 'Marrelay · Engineering & CAD',
  ctaH2: <>Have a part that needs <span className="it">real drawings?</span></>,
  ctaText: 'Send us a sketch, a sample, or an idea. We will give you a realistic view of how we would turn it into manufacturable CAD/CAM documentation.',
  seoName: 'Engineering & CAD Case Study - CAD/CAM Drawings (Illustrative)',
  seoDescription: 'An illustrative example of how Marrelay would turn vague sketches into precise, GD&T-toleranced CAD/CAM drawings that reduce rework for small manufacturers.',
}

export default function EngineeringDrawingsPageView({ bannerVideo }: { bannerVideo: string }) {
  return <CaseStudyPage data={{ ...data, interactive: <CadMotor /> }} media={bannerVideo} />
}
