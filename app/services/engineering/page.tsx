import type { Metadata } from 'next'
import ServicePage, { ServiceData } from '@/components/services/ServicePage'
import { mergePackages } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Engineering & CAD Drafting in Toronto',
  description:
    'Toronto CAD drafting and engineering. Mechanical drafting, blueprints, and 3D modelling for founders, fabricators, and contractors who need it precise, and on time.',
  alternates: { canonical: '/services/engineering' },
  openGraph: { url: '/services/engineering' },
}

const stage = (
  <div className="hero-stage" style={{ background: 'var(--accent-soft)' }}>
    <div className="scene-bp">
      <div className="grid-lines"></div>
      <div className="iso">
        <svg viewBox="0 0 200 150" fill="none">
          <g stroke="var(--ink)" strokeWidth="2" className="spin">
            <path d="M60 70 L100 48 L140 70 L100 92 Z" fill="var(--accent-soft)" />
            <path d="M60 70 L60 104 L100 126 L100 92 Z" fill="var(--paper)" />
            <path d="M140 70 L140 104 L100 126 L100 92 Z" fill="var(--paper-2)" />
            <circle cx="100" cy="70" r="7" fill="var(--paper)" />
          </g>
          <path className="dimpath" d="M60 116 L100 138" />
          <path className="dimpath" d="M100 138 L140 116" />
          <text x="74" y="134" fontFamily="var(--mono)" fontSize="9" fill="var(--accent)">
            42.0
          </text>
        </svg>
      </div>
      <div className="tb">
        <span>MARTEK · PART-014</span>
        <span>REV B · SCALE 1:2</span>
      </div>
    </div>
    <div className="badge badge-rev float-c">
      <span className="d" style={{ background: 'var(--accent)' }}></span>REV B approved
    </div>
    <div className="badge badge-tol float-b">tol ±0.1mm</div>
  </div>
)

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 28 28" fill="none" stroke="var(--ink)" strokeWidth="1.8">
    {children}
  </svg>
)

const data: ServiceData = {
  accentClass: 'accent-eng',
  contactQuery: 'engineering',
  crumb: 'Engineering & CAD',
  tagNo: '05',
  tagLabel: 'Engineering & CAD',
  h1: (
    <>
      Drawings &amp; <span className="it">drafts</span>
      <br />
      done <span className="hl">right</span>.
    </>
  ),
  lede: (
    <>
      Before we wrote a line of code, we drew. <b>Mechanical drafting, blueprints, and 3D modelling</b> for hardware
      founders, fabricators, and contractors who need it precise, and on time.
    </>
  ),
  miniStats: [
    { v: '4yr', k: 'drafting experience' },
    {
      v: (
        <>
          ±0.1<sup style={{ fontSize: '.5em', color: 'var(--accent)' }}>mm</sup>
        </>
      ),
      k: 'tolerance you set',
    },
    { v: 'DWG', k: '+ STEP, PDF, STL' },
  ],
  stage,
  includedIntro:
    "From a napkin sketch to a fabrication-ready drawing set. Send us what you have, even if it's a photo and a measurement.",
  deliverables: [
    {
      icon: (
        <Icon>
          <rect x="4" y="4" width="20" height="20" rx="2" />
          <path d="M4 10 H24 M10 10 V24" strokeWidth="1.2" />
          <path d="M14 14 L20 20" strokeLinecap="round" />
        </Icon>
      ),
      title: '2D drafting',
      text: 'Clean, dimensioned production drawings to your standard, ready for the shop floor.',
      tags: ['AutoCAD', 'DWG', 'PDF'],
    },
    {
      icon: (
        <Icon>
          <path d="M14 3 L24 8.5 V19.5 L14 25 L4 19.5 V8.5 Z" />
          <path d="M4 8.5 L14 14 L24 8.5 M14 14 V25" strokeWidth="1.3" />
        </Icon>
      ),
      title: '3D modelling',
      text: 'Parametric solid models for parts and assemblies, built to be edited, not just admired.',
      tags: ['SolidWorks', 'Fusion 360', 'STEP'],
    },
    {
      icon: (
        <Icon>
          <rect x="5" y="3" width="18" height="22" rx="2" />
          <path d="M9 8 H19 M9 12 H19 M9 16 H19 M9 20 H15" strokeWidth="1.2" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Technical documentation',
      text: 'BOMs, assembly instructions, and spec sheets that leave no room for guesswork.',
      tags: ['BOM', 'Spec sheets'],
    },
    {
      icon: (
        <Icon>
          <path d="M6 22 L6 6 L14 6 M6 14 L12 14" strokeLinecap="round" />
          <circle cx="19" cy="17" r="5" />
          <path d="M19 12 V7 M22.5 13.5 L26 10" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Blueprint & layout',
      text: 'Architectural and site layouts, floor plans, and as-built drawings for contractors.',
      tags: ['Floor plans', 'As-builts'],
    },
    {
      icon: (
        <Icon>
          <path d="M4 18 L4 24 L10 24 M4 24 L11 17" strokeLinecap="round" />
          <path d="M24 10 L24 4 L18 4 M24 4 L17 11" strokeLinecap="round" />
          <circle cx="14" cy="14" r="3" />
        </Icon>
      ),
      title: 'Reverse engineering',
      text: 'Turn an existing part or scan into a clean, editable model and drawing set.',
      tags: ['Scan-to-CAD', 'Measurement'],
    },
    {
      icon: (
        <Icon>
          <rect x="6" y="9" width="16" height="14" rx="2" />
          <path d="M10 9 V6 A4 4 0 0 1 18 6 V9" />
          <path d="M14 14 V18" strokeLinecap="round" />
        </Icon>
      ),
      title: 'Design for manufacture',
      text: "We sanity-check parts for cost, tolerance, and how they'll actually be made.",
      tags: ['DFM review', 'Tolerancing'],
    },
  ],
  flowTitle: (
    <>
      How a draft <span className="it">works</span>
    </>
  ),
  flowIntro:
    'A tight loop with clear revisions. You approve at each gate, and every change is logged on the title block.',
  flow: [
    { title: 'Brief', text: 'Send sketches, photos, references, or an existing file. We confirm scope & standards.', time: 'DAYS 1–2' },
    { title: 'Concept', text: 'A first model or draft for direction, before we invest in full detailing.', time: 'WEEK 1' },
    { title: 'Detail & revise', text: 'Full dimensioning and clean-up, with clearly tracked revisions you sign off.', time: 'WEEK 1–2' },
    { title: 'Deliver', text: 'Final files in every format you need, DWG, STEP, PDF, STL, plus the source.', time: 'ON APPROVAL' },
  ],
  pricingTitle: (
    <>
      Engineering <span className="it">pricing</span>
    </>
  ),
  pricingIntro:
    "Small jobs are priced per drawing; bigger programmes run on a monthly retainer. We'll quote your exact scope on the call.",
  cards: [
    {
      variant: 'c-starter',
      name: 'Per drawing',
      h3: (
        <>
          One <span className="it">part</span>
        </>
      ),
      desc: 'A single dimensioned drawing or model from your sketch or sample.',
      price: '$180',
      priceNote: 'from',
      billing: '2–4 day turnaround',
      items: ['1 production drawing or model', 'Your standard & title block', '2 revision rounds', 'DWG, STEP & PDF export'],
      ctaLabel: 'Send a drawing →',
    },
    {
      variant: 'c-growth',
      featured: true,
      tag: 'Best value',
      name: 'Project',
      h3: (
        <>
          A full <span className="it">set</span>
        </>
      ),
      desc: 'A complete assembly: models, drawings, BOM, and documentation.',
      price: '$2,800',
      priceNote: 'from',
      billing: '1–2 week delivery',
      items: [
        'Full assembly modelling',
        'Complete drawing set + BOM',
        'DFM review',
        'All source & export files',
        'Revision tracking',
      ],
      ctaLabel: 'Scope a project →',
    },
    {
      variant: 'c-scale',
      name: 'Retainer',
      h3: (
        <>
          Ongoing <span className="it">drafting</span>
        </>
      ),
      desc: 'A steady drafting partner for fabricators and product teams.',
      price: '$2,400',
      priceNote: '/mo',
      billing: 'Monthly, flexible',
      items: ['40 hours / month of CAD', 'Priority turnaround', 'Consistent standards & archive', 'Scale up or down monthly'],
      ctaLabel: 'Talk retainer →',
    },
  ],
  faqKicker: 'FAQ · Engineering',
  faqTitle: (
    <>
      CAD <span className="serif-it" style={{ fontStyle: 'italic' }}>questions</span>.
    </>
  ),
  faqs: [
    {
      q: 'What software and file formats do you deliver in?',
      a: "We work mainly in AutoCAD, SolidWorks, and Fusion 360, and deliver DWG, STEP, IGES, PDF, and STL, plus the editable source file. Tell us your downstream tool and we'll match it.",
    },
    {
      q: 'I only have a rough sketch. Is that enough to start?',
      a: "Usually, yes. A sketch with a few key measurements, or a photo of an existing part, is plenty to begin. We'll ask questions and confirm the critical dimensions before detailing.",
    },
    {
      q: 'Will you follow our drafting standards?',
      a: "Always. Send your title block and standard (ISO, ANSI, or in-house) and we'll match it exactly so the drawings drop straight into your workflow.",
    },
    {
      q: 'Is my design kept confidential?',
      a: 'Yes. We sign an NDA before you share anything sensitive, and your files and IP remain entirely yours. We never reuse client designs.',
    },
  ],
  ctaH2: (
    <>
      Let&apos;s draw
      <br />
      it <span className="stamp">up</span>.
    </>
  ),
  ctaText:
    "Send a sketch, a photo, or an existing file and tell us the deadline. We'll reply within a few hours with a quote.",
  signoff: 'engineering & CAD, since day one.',
}

export default async function EngineeringPage() {
  return <ServicePage data={{ ...data, cards: await mergePackages('engineering', data.cards) }} />
}
