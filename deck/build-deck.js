/**
 * Marrelay pitch deck builder.
 *
 *   node build-deck.js                    # the full 11-slide pitch
 *   node build-deck.js --deck=startup     # for brand-new businesses
 *   node build-deck.js --deck=web         # web development only
 *   node build-deck.js --deck=library     # EVERY slide, to cherry-pick from
 *   node build-deck.js --deck=web --out="Acme-Proposal.pptx"
 *   node build-deck.js --list             # show all decks and slides
 *
 * Two things are separate on purpose:
 *
 *   THEME   - colours, fonts, company name. Edit to re-skin for another business.
 *   SLIDES  - a library of named slides. DECKS composes them into presets.
 *
 * Add a slide to SLIDES once and it is available to every deck. Page numbers
 * are counted at build time, so reordering or dropping slides never leaves a
 * wrong number behind.
 */
const pptxgen = require('pptxgenjs')

// ════════════════════════════════════════════════════════════════════════════
//  THEME - edit this block to re-skin for a different business
// ════════════════════════════════════════════════════════════════════════════
const THEME = {
  company: 'Marrelay',
  tagline: 'Digital Studio',
  contact: {
    site: 'www.marrelay.com',
    email: 'hello@marrelay.com',
    location: 'Toronto, Canada',
  },

  // ── Colours. Hex WITHOUT '#'. ──────────────────────────────────────────────
  palette: {
    bgLight: 'FBF6EC', bgTint: 'F4EDDD', bgTint2: 'EBE3D0',
    bgDark: '1A1A1E', bgDarkCard: '2B2B30',
    ink: '1A1A1E', inkMut: '6E6A62', inkSoft: 'A39E94',
    onDark: 'FBF6EC', onDarkMut: 'A39E94',
    rule: 'E2D9C4', brand: 'ED1C24', brandSoft: 'FBD9DA',
    s1: 'E07A5F',  // web
    s2: '6B9080',  // data
    s3: 'F2CC8F',  // social
    s4: '8390C8',  // seo/ads
    s5: '8B5A8C',  // engineering
  },

  // ── Fonts. ────────────────────────────────────────────────────────────────
  // Both ship with Office everywhere. Swap to your brand fonts only if the
  // machine presenting has them installed - PowerPoint silently substitutes
  // anything it cannot find.
  fonts: { display: 'Century Schoolbook', body: 'Calibri' },

  /* ── Alternate palettes ─────────────────────────────────────────────────────
     Paste over `palette` above. Keep every key.

     MIDNIGHT (corporate, tech)
       bgLight:'F7F8FA' bgTint:'EDEFF5' bgTint2:'E1E5EF' bgDark:'161B33'
       bgDarkCard:'23294B' ink:'161B33' inkMut:'5A6180' inkSoft:'8B92AD'
       onDark:'F7F8FA' onDarkMut:'9AA1BE' rule:'DDE1EC' brand:'3B5BDB'
       brandSoft:'DBE2FB' s1:'3B5BDB' s2:'0CA678' s3:'F59F00' s4:'7048E8' s5:'E8590C'

     FOREST (trades, manufacturing, sustainability)
       bgLight:'F6F7F2' bgTint:'EBEEE3' bgTint2:'DCE2CE' bgDark:'1B2A1F'
       bgDarkCard:'2A3D2F' ink:'1B2A1F' inkMut:'5C6B5A' inkSoft:'8A9686'
       onDark:'F6F7F2' onDarkMut:'9DAA97' rule:'DDE3D2' brand:'2C5F2D'
       brandSoft:'D7E6D3' s1:'2C5F2D' s2:'97BC62' s3:'D6A419' s4:'46716B' s5:'8A5A2B'

     MONOCHROME (premium, minimal)
       bgLight:'FFFFFF' bgTint:'F4F4F5' bgTint2:'E7E7E9' bgDark:'161616'
       bgDarkCard:'242426' ink:'161616' inkMut:'5C5C60' inkSoft:'92929A'
       onDark:'FFFFFF' onDarkMut:'9A9AA2' rule:'E2E2E5' brand:'E8442E'
       brandSoft:'FBDBD5' s1:'E8442E' s2:'2F2F33' s3:'8A8A92' s4:'4A4A52' s5:'C4C4CA'
  ──────────────────────────────────────────────────────────────────────────── */
}

// ════════════════════════════════════════════════════════════════════════════
//  CONTENT
// ════════════════════════════════════════════════════════════════════════════
const CONTENT = {
  // For businesses that already exist and already have a site
  problem: {
    lede: 'The same three problems, over and over.',
    items: [
      { n: '01', h: 'The site is slow and nobody can edit it',
        b: 'Every copy change becomes a developer ticket. Pages take seconds to load. The people who own the business cannot touch their own website.' },
      { n: '02', h: 'The numbers cannot be trusted',
        b: 'Analytics was set up once, by someone who left. Conversions double-count, campaigns cannot be compared, and nobody quite believes the dashboard.' },
      { n: '03', h: 'Drawings hold up the shop floor',
        b: 'Sketches get re-drawn three times before anyone cuts metal. Rework eats the margin on jobs that were profitable on paper.' },
    ],
  },

  // For businesses that do not exist yet, or have no site at all
  problemNew: {
    lede: 'Starting from nothing is its own problem.',
    items: [
      { n: '01', h: 'Every quote is a different number',
        b: 'One person says $500, the next says $15,000, and neither will tell you what changes between them. You cannot budget against that.' },
      { n: '02', h: 'You do not know what you need on day one',
        b: 'Most of what agencies sell a new business is for a company that already has customers. You need the parts that help you get the first ten.' },
      { n: '03', h: 'You are worried about being stuck',
        b: 'A site you cannot edit, on a platform you do not own, with a person who stops replying. That is the horror story everyone has heard.' },
    ],
  },

  // Honest scoping slide for new businesses - two columns
  dayOne: {
    lede: 'Half of what gets sold to a new business can wait.',
    now: {
      h: 'Worth it on day one',
      items: [
        'A domain and business email that look professional',
        'A fast one-page or small site that explains what you sell',
        'One clear way to contact you, that works on a phone',
        'Basic analytics, so you learn what is actually working',
        'A logo and colours consistent enough to reuse',
      ],
    },
    later: {
      h: 'Can wait until you have customers',
      items: [
        'A blog and a content calendar',
        'A custom CMS with editorial workflows',
        'Marketing automation and email sequences',
        'A full brand guidelines document',
        'Paid ads at any real scale',
      ],
    },
  },

  launchPath: {
    // Deliberately not a restatement of the slide title above it.
    lede: 'Five steps. Nobody disappears between any two of them.',
    steps: [
      { n: '1', h: 'Name & brand',   b: 'Domain, logo, colours and type. Enough identity to look credible, not a 40-page brand book.' },
      { n: '2', h: 'The site',       b: 'A fast site that explains what you sell and makes it obvious how to get in touch.' },
      { n: '3', h: 'Measurement',    b: 'Analytics and conversion tracking from day one, so your first hundred visitors teach you something.' },
      { n: '4', h: 'Launch',         b: 'Live, indexed by Google, on hosting you own, with a walkthrough so you can edit it yourself.' },
      { n: '5', h: 'Iterate',        b: 'Change the page based on what real visitors did, not on what any of us guessed.' },
    ],
  },

  timeline: {
    lede: 'A typical first site, start to live.',
    rows: [
      { w: 'Week 1',    h: 'Discover & brand direction', b: 'Goals, audience, references. Domain secured. First look at logo and colour.' },
      { w: 'Week 2',    h: 'Design',                     b: 'Wireframes then high-fidelity screens. You react before any code exists.' },
      { w: 'Weeks 3-4', h: 'Build',                      b: 'Live staging link from day one, with a demo every Friday.' },
      { w: 'Week 5',    h: 'Launch & handover',          b: 'QA, performance pass, analytics live, and the keys handed to you.' },
    ],
    note: 'Then 30 days of free fixes. Nothing is signed until this is scoped on one page.',
  },

  services: [
    { k: 's1', name: 'Web development',   b: 'Fast, conversion-focused sites and app front-ends you can edit yourself.' },
    { k: 's2', name: 'Data & analytics',  b: 'Tracking, tagging and dashboards you can actually make decisions from.' },
    { k: 's5', name: 'Engineering & CAD', b: 'Precise drawings, models and documentation that cut rework on the floor.' },
    { k: 's3', name: 'Social',            b: 'Content strategy, production and community management.' },
    { k: 's4', name: 'SEO & ads',         b: 'Search and paid campaigns with weekly optimisation and plain reporting.' },
  ],

  deepDives: {
    web: {
      k: 's1', name: 'Web development',
      lede: 'Sites that load instantly, read beautifully, and hand the keys back to you.',
      points: [
        'Fast, conversion-focused pages that work on any screen',
        'App front-ends and internal tools built in React',
        'Core Web Vitals in the green and WCAG-AA accessibility',
        'Logo, type, colour and a component system in Figma',
        'You edit your own content - clean CMS and a walkthrough',
      ],
      stats: [{ v: '98+', k: 'Lighthouse score we build to' }, { v: '100%', k: 'You own the code' }],
    },
    data: {
      k: 's2', name: 'Data & analytics',
      lede: 'A tracking setup you trust, and a weekly rhythm that survives us leaving.',
      points: [
        'Tracking & tagging - GA4, GTM, server-side, consent mode',
        'Funnel and cohort analysis that explains the why',
        'Dashboards built around your decisions, not vanity metrics',
        'Weekly one-pagers your team will actually read',
      ],
      stats: [{ v: 'GA4', k: 'Built correctly, once' }, { v: 'Weekly', k: 'Reporting rhythm' }],
    },
    engineering: {
      k: 's5', name: 'Engineering & CAD',
      lede: 'Documentation precise enough that the shop floor stops guessing.',
      points: [
        'Technical documentation, blueprints and layouts',
        'Reverse engineering from a sketch, part or sample',
        'Design for manufacture - drawings a fabricator can quote',
        'Full assemblies: models, drawings, BOM and revisions',
      ],
      stats: [{ v: '2D + 3D', k: 'Drawings and models' }, { v: 'DWG/STEP/STL', k: 'Formats we deliver' }],
    },
  },

  process: [
    { n: '1', h: 'Discover', b: 'We map goals, audience and references, then agree scope and success metrics before anyone quotes.' },
    { n: '2', h: 'Design',   b: 'Wireframes through to high-fidelity. You react early, before a line of code is written.' },
    { n: '3', h: 'Build',    b: 'One-week sprints with a live staging link and a demo every Friday. No silent months.' },
    { n: '4', h: 'Launch',   b: 'QA, performance pass, launch and a handover walkthrough. Then 30 days of free fixes.' },
  ],

  differentiators: [
    { h: 'Fixed quote before any money moves', b: 'Every project gets a one-page quote with the scope written down. No hourly surprises.' },
    { h: 'You own everything',                 b: 'Code, accounts, analytics properties and design files are yours from day one.' },
    { h: 'You are not locked in',              b: 'We hand over a CMS and a walkthrough so your team can run it without calling us.' },
    { h: 'One studio, three disciplines',      b: 'Web, data and engineering under one roof - no agency ping-pong between vendors.' },
  ],

  about: {
    lede: 'A small studio, deliberately.',
    body: 'Marrelay is a digital studio working with small and mid-size businesses. We build websites and internal tools, set up the analytics that tell you whether they worked, and produce engineering drawings for the shops that make physical things.\n\nSmall enough that you talk to the person doing the work. Structured enough that nothing depends on one person remembering.',
    stats: [
      { v: '3', k: 'Disciplines under one roof' },
      { v: '98+', k: 'Lighthouse score we build to' },
      { v: '30', k: 'Days of free fixes after launch' },
    ],
  },

  objections: {
    lede: 'The questions everyone asks, answered before you ask them.',
    items: [
      { h: 'What if I want to leave?',      b: 'You take everything. The code, the domain, the analytics property and the design files are in your name from day one.' },
      { h: 'Who edits it after launch?',    b: 'You do. We hand over a CMS and a recorded walkthrough. If you would rather we did it, that is a separate, optional arrangement.' },
      { h: 'What if the scope changes?',    b: 'We re-quote in writing before doing the work. You will never see a surprise line item on an invoice.' },
      { h: 'How do I know it is working?',  b: 'Analytics goes in at launch, not months later. You get a plain-language report, not a dashboard nobody opens.' },
    ],
  },

  pricing: [
    { name: 'Starter',      price: '$499',   note: 'one-time', desc: 'For small businesses getting started',
      items: ['Landing or campaign page', 'CMS-editable sections', 'Analytics + conversion tracking', '30 days of free fixes'] },
    { name: 'Professional', price: '$1,299', note: 'one-time', desc: 'For growing businesses', featured: true,
      items: ['Multi-page site or app front-end', 'Full design system in Figma', 'GA4, GTM and dashboard setup', 'Training and handover'] },
    { name: 'Enterprise',   price: 'Custom', note: 'quote',    desc: 'Tailored to larger scopes',
      items: ['Multi-workstream engagement', 'Engineering / CAD packages', 'Ongoing analytics retainer', 'Dedicated senior contact'] },
  ],

  next: [
    { h: 'A 30-minute call',  b: 'You walk us through the problem. We ask the awkward questions.' },
    { h: 'A one-page quote',  b: 'Fixed scope, fixed price, in writing, within a few working days.' },
    { h: 'First sprint',      b: 'Work starts with a staging link you can watch from day one.' },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
//  DECK PRESETS - compose slides from the SLIDES library below
// ════════════════════════════════════════════════════════════════════════════
const DECKS = {
  full: {
    label: 'The complete studio pitch',
    title: 'Websites, data, and drawings\nthat actually ship.',
    subtitle: 'A studio for small and mid-size businesses that need the work done properly, once.',
    slides: ['cover', 'problem', 'services', 'serviceWeb', 'serviceData', 'serviceEng',
             'process', 'whyUs', 'pricing', 'next', 'close'],
  },
  startup: {
    label: 'For brand-new businesses with no site yet',
    title: 'You have a business.\nLet us get it online.',
    subtitle: 'A first website, built fast, that you own and can edit yourself.',
    slides: ['cover', 'problemNew', 'dayOne', 'launchPath', 'serviceWeb',
             'timeline', 'pricing', 'whyUs', 'objections', 'next', 'close'],
  },
  web: {
    label: 'Web development only',
    title: 'A site that loads instantly\nand earns its keep.',
    subtitle: 'Fast, conversion-focused websites and app front-ends you can run yourself.',
    slides: ['cover', 'problem', 'serviceWeb', 'process', 'whyUs', 'pricing', 'next', 'close'],
  },
  data: {
    label: 'Data & analytics only',
    title: 'Numbers you can\nactually act on.',
    subtitle: 'Tracking, tagging and reporting set up properly - once, by people who will explain it.',
    slides: ['cover', 'problem', 'serviceData', 'process', 'whyUs', 'objections', 'next', 'close'],
  },
  engineering: {
    label: 'Engineering & CAD only',
    title: 'Drawings the shop floor\ndoes not have to guess at.',
    subtitle: 'Precise CAD documentation that cuts rework and helps smaller shops quote bigger jobs.',
    slides: ['cover', 'problem', 'serviceEng', 'process', 'whyUs', 'next', 'close'],
  },
  library: {
    label: 'EVERY slide - duplicate and delete to build your own',
    title: 'Slide library.\nTake what you need.',
    subtitle: 'Every reusable slide in one file. Delete what does not apply and reorder the rest.',
    slides: ['cover', 'about', 'problem', 'problemNew', 'dayOne', 'launchPath', 'services',
             'serviceWeb', 'serviceData', 'serviceEng', 'process', 'timeline', 'whyUs',
             'objections', 'pricing', 'next', 'close'],
  },
}

// ════════════════════════════════════════════════════════════════════════════
//  Layout helpers - you should not need to edit below this line to re-skin
// ════════════════════════════════════════════════════════════════════════════
const C = THEME.palette
const F = THEME.fonts
const W = 13.333
const H = 7.5
const M = 0.75

let pres
let page = 0        // counted at build time, so composition never breaks numbering
let deckCfg

const softShadow = () => ({ type: 'outer', color: '000000', blur: 14, offset: 3, angle: 90, opacity: 0.10 })

function dot(slide, x, y, color, size = 0.17) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: size, h: size, fill: { color }, line: { color, width: 0 } })
}

function heading(slide, eyebrow, title, opts = {}) {
  const onDark = opts.onDark
  slide.addText(eyebrow.toUpperCase(), {
    x: M, y: 0.52, w: 8, h: 0.28, margin: 0,
    fontFace: F.body, fontSize: 11, bold: true, charSpacing: 2.2,
    color: onDark ? C.onDarkMut : C.brand,
  })
  slide.addText(title, {
    x: M, y: 0.86, w: opts.titleW || 11, h: 0.92, margin: 0, valign: 'top',
    fontFace: F.display, fontSize: opts.size || 38, bold: true,
    color: onDark ? C.onDark : C.ink, lineSpacing: 40,
  })
}

function subhead(slide, text, w = 9) {
  slide.addText(text, {
    x: M, y: 1.78, w, h: 0.32, margin: 0, valign: 'top',
    fontFace: F.body, fontSize: 14, color: C.inkMut,
  })
}

/**
 * `page` is set from the slide's position in the deck before each slide is
 * built, so the printed number always matches the physical slide. Counting
 * inside footer() instead would drift, because the cover and closing slides
 * are deliberately unnumbered.
 */
function footer(slide) {
  slide.addText(THEME.company, {
    x: M, y: H - 0.62, w: 3, h: 0.26, margin: 0,
    fontFace: F.body, fontSize: 9.5, color: C.inkSoft, charSpacing: 1.4,
  })
  slide.addText(String(page), {
    x: W - M - 1, y: H - 0.62, w: 1, h: 0.26, margin: 0, align: 'right',
    fontFace: F.body, fontSize: 9.5, color: C.inkSoft,
  })
}

function lightSlide() {
  const s = pres.addSlide()
  s.background = { color: C.bgLight }
  return s
}

/** Numbered card used by several slides. */
function numberCard(s, { x, y, w, h, n, title, body, dark = false, numColor }) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: dark ? C.ink : C.bgTint },
    line: { color: dark ? C.ink : C.rule, width: 1 }, shadow: softShadow(),
  })
  s.addText(n, {
    x: x + 0.42, y: y + 0.36, w: 1.4, h: 0.5, margin: 0, valign: 'top',
    fontFace: F.display, fontSize: 28, bold: true, color: numColor || C.brand,
  })
  s.addText(title, {
    x: x + 0.42, y: y + 0.92, w: w - 0.84, h: 0.78, margin: 0, valign: 'top',
    fontFace: F.display, fontSize: 17, bold: true, color: dark ? C.onDark : C.ink, lineSpacing: 22,
  })
  s.addText(body, {
    x: x + 0.42, y: y + 1.86, w: w - 0.84, h: h - 2.16, margin: 0, valign: 'top',
    fontFace: F.body, fontSize: 12, color: dark ? C.onDarkMut : C.inkMut, lineSpacing: 18,
  })
}

/** Three numbered cards across - shared by `problem` and `problemNew`. */
function threeProblemCards(eyebrow, title, block) {
  const s = lightSlide()
  heading(s, eyebrow, title)
  subhead(s, block.lede)
  const cw = (W - M * 2 - 0.5) / 3
  block.items.forEach((it, i) => {
    numberCard(s, { x: M + i * (cw + 0.25), y: 2.42, w: cw, h: 3.5, n: it.n, title: it.h, body: it.b })
  })
  footer(s)
  return s
}

/** Service deep-dive - bullets left, dark stat panel right. */
function deepDive(d) {
  const s = lightSlide()
  heading(s, 'Service', d.name, { titleW: 6.4 })
  s.addText(d.lede, {
    x: M, y: 1.84, w: 6.2, h: 0.72, margin: 0, valign: 'top',
    fontFace: F.body, fontSize: 14, color: C.inkMut, lineSpacing: 21,
  })
  d.points.forEach((p, i) => {
    const y = 2.72 + i * 0.58
    dot(s, M + 0.02, y + 0.07, C[d.k], 0.15)
    s.addText(p, {
      x: M + 0.34, y, w: 5.9, h: 0.46, margin: 0, valign: 'top',
      fontFace: F.body, fontSize: 13, color: C.ink, lineSpacing: 18,
    })
  })
  s.addShape(pres.ShapeType.roundRect, {
    x: 7.6, y: 1.6, w: W - M - 7.6, h: 4.3, rectRadius: 0.12,
    fill: { color: C.ink }, line: { color: C.ink, width: 1 }, shadow: softShadow(),
  })
  d.stats.forEach((st, i) => {
    const y = 2.15 + i * 1.75
    // Long values wrap at 42pt and collide with the label, so scale them down.
    const size = st.v.length > 10 ? 26 : st.v.length > 6 ? 32 : 42
    s.addText(st.v, {
      x: 8.1, y, w: 4.4, h: 0.86, margin: 0, valign: 'bottom',
      fontFace: F.display, fontSize: size, bold: true, color: C[d.k],
    })
    s.addText(st.k, {
      x: 8.1, y: y + 0.92, w: 4.2, h: 0.5, margin: 0, valign: 'top',
      fontFace: F.body, fontSize: 12, color: C.onDarkMut, lineSpacing: 17,
    })
  })
  footer(s)
  s.addNotes(`${d.name}. Pick the two bullets closest to their situation and give a concrete example for each. Skip the rest.`)
  return s
}

// ════════════════════════════════════════════════════════════════════════════
//  SLIDE LIBRARY
// ════════════════════════════════════════════════════════════════════════════
const SLIDES = {
  cover: () => {
    const s = pres.addSlide()
    s.background = { color: C.bgDark }
    dot(s, M, 0.68, C.brand, 0.22)
    s.addText(THEME.company, {
      x: M + 0.34, y: 0.6, w: 5, h: 0.38, margin: 0,
      fontFace: F.display, fontSize: 20, bold: true, color: C.onDark,
    })
    s.addText(THEME.tagline.toUpperCase(), {
      x: M + 0.34, y: 0.98, w: 5, h: 0.24, margin: 0,
      fontFace: F.body, fontSize: 9, color: C.onDarkMut, charSpacing: 2.6,
    })
    s.addText(deckCfg.title, {
      x: M, y: 2.45, w: 11.4, h: 2.1, margin: 0, valign: 'top',
      fontFace: F.display, fontSize: 46, bold: true, color: C.onDark, lineSpacing: 54,
    })
    s.addText(deckCfg.subtitle, {
      x: M, y: 4.86, w: 8.2, h: 0.8, margin: 0, valign: 'top',
      fontFace: F.body, fontSize: 15, color: C.onDarkMut, lineSpacing: 23,
    })
    ;['s1', 's2', 's5', 's3', 's4'].forEach((k, i) => dot(s, M + i * 0.32, 5.95, C[k], 0.19))
    s.addText(`${THEME.contact.site}   ·   ${THEME.contact.location}`, {
      x: M, y: H - 0.85, w: 8, h: 0.3, margin: 0,
      fontFace: F.body, fontSize: 11, color: C.onDarkMut,
    })
    s.addNotes('Cover. One line on who you are, then straight into their problem. Do not read the tagline aloud.')
    return s
  },

  about: () => {
    const s = lightSlide()
    heading(s, 'Who we are', `About ${THEME.company}`)
    s.addText(CONTENT.about.lede, {
      x: M, y: 1.84, w: 6.4, h: 0.36, margin: 0, valign: 'top',
      fontFace: F.display, fontSize: 17, italic: true, color: C.inkMut,
    })
    s.addText(CONTENT.about.body, {
      x: M, y: 2.42, w: 6.3, h: 3, margin: 0, valign: 'top',
      fontFace: F.body, fontSize: 13, color: C.ink, lineSpacing: 21, paraSpaceAfter: 10,
    })
    s.addShape(pres.ShapeType.roundRect, {
      x: 7.6, y: 1.84, w: W - M - 7.6, h: 4, rectRadius: 0.12,
      fill: { color: C.ink }, line: { color: C.ink, width: 1 }, shadow: softShadow(),
    })
    const colors = [C.s1, C.s2, C.s5]
    CONTENT.about.stats.forEach((st, i) => {
      const y = 2.24 + i * 1.2
      s.addText(st.v, {
        x: 8.1, y, w: 1.5, h: 0.62, margin: 0, valign: 'bottom',
        fontFace: F.display, fontSize: 30, bold: true, color: colors[i],
      })
      s.addText(st.k, {
        x: 9.5, y: y + 0.14, w: 3, h: 0.5, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 11.5, color: C.onDarkMut, lineSpacing: 16,
      })
    })
    footer(s)
    s.addNotes('Keep this to 30 seconds. Nobody buys because of your About slide - it exists so they know who is in the room.')
    return s
  },

  problem: () => {
    const s = threeProblemCards('The problem', 'Why teams call us', CONTENT.problem)
    s.addNotes('Ask which of the three they recognise. Whichever they pick tells you which deep-dive to spend time on.')
    return s
  },

  problemNew: () => {
    const s = threeProblemCards('The problem', 'Starting from scratch', CONTENT.problemNew)
    s.addNotes('For a first-time owner. Naming the wildly different quotes builds trust fast - they have already had that experience.')
    return s
  },

  dayOne: () => {
    const s = lightSlide()
    heading(s, 'Scope', 'What you actually need first')
    subhead(s, CONTENT.dayOne.lede)
    const cw = (W - M * 2 - 0.4) / 2
    const cols = [
      { d: CONTENT.dayOne.now, dark: true, color: C.s2 },
      { d: CONTENT.dayOne.later, dark: false, color: C.inkSoft },
    ]
    cols.forEach((col, i) => {
      const x = M + i * (cw + 0.4)
      s.addShape(pres.ShapeType.roundRect, {
        x, y: 2.42, w: cw, h: 3.5, rectRadius: 0.12,
        fill: { color: col.dark ? C.ink : C.bgTint },
        line: { color: col.dark ? C.ink : C.rule, width: 1 }, shadow: softShadow(),
      })
      s.addText(col.d.h, {
        x: x + 0.45, y: 2.78, w: cw - 0.9, h: 0.4, margin: 0, valign: 'top',
        fontFace: F.display, fontSize: 18, bold: true, color: col.dark ? C.onDark : C.ink,
      })
      col.d.items.forEach((t, j) => {
        const y = 3.36 + j * 0.48
        dot(s, x + 0.47, y + 0.06, col.color, 0.14)
        s.addText(t, {
          x: x + 0.78, y, w: cw - 1.25, h: 0.42, margin: 0, valign: 'top',
          fontFace: F.body, fontSize: 12, color: col.dark ? C.onDarkMut : C.inkMut, lineSpacing: 17,
        })
      })
    })
    footer(s)
    s.addNotes('This slide sells by subtraction. Telling someone what NOT to buy from you is the fastest way to be believed on the rest.')
    return s
  },

  launchPath: () => {
    const s = lightSlide()
    heading(s, 'The path', 'From nothing to live')
    subhead(s, CONTENT.launchPath.lede)
    const cw = (W - M * 2 - 1.0) / 5
    CONTENT.launchPath.steps.forEach((p, i) => {
      const x = M + i * (cw + 0.25)
      const last = i === CONTENT.launchPath.steps.length - 1
      s.addShape(pres.ShapeType.roundRect, {
        x, y: 2.5, w: cw, h: 3.3, rectRadius: 0.1,
        fill: { color: last ? C.ink : C.bgTint },
        line: { color: last ? C.ink : C.rule, width: 1 }, shadow: softShadow(),
      })
      s.addShape(pres.ShapeType.ellipse, {
        x: x + 0.3, y: 2.84, w: 0.48, h: 0.48,
        fill: { color: last ? C.brand : C.ink }, line: { color: last ? C.brand : C.ink, width: 0 },
      })
      s.addText(p.n, {
        x: x + 0.3, y: 2.91, w: 0.48, h: 0.36, margin: 0, align: 'center',
        fontFace: F.body, fontSize: 14, bold: true, color: C.onDark,
      })
      s.addText(p.h, {
        x: x + 0.3, y: 3.5, w: cw - 0.6, h: 0.72, margin: 0, valign: 'top',
        fontFace: F.display, fontSize: 15, bold: true, color: last ? C.onDark : C.ink, lineSpacing: 19,
      })
      s.addText(p.b, {
        x: x + 0.3, y: 4.26, w: cw - 0.6, h: 1.34, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 10.5, color: last ? C.onDarkMut : C.inkMut, lineSpacing: 15,
      })
    })
    footer(s)
    s.addNotes('Step 5 is the one to dwell on. New owners expect a project that ends; what they need is something they can keep changing.')
    return s
  },

  services: () => {
    const s = lightSlide()
    heading(s, 'What we do', 'Five disciplines, one studio')
    subhead(s, 'Most clients start with one and add the others once they trust us.')
    const cw = (W - M * 2 - 0.5) / 3
    const ch = 1.72
    CONTENT.services.forEach((sv, i) => {
      const x = M + (i % 3) * (cw + 0.25)
      const y = 2.42 + Math.floor(i / 3) * (ch + 0.28)
      s.addShape(pres.ShapeType.roundRect, {
        x, y, w: cw, h: ch, rectRadius: 0.1,
        fill: { color: C.bgTint }, line: { color: C.rule, width: 1 }, shadow: softShadow(),
      })
      dot(s, x + 0.4, y + 0.42, C[sv.k], 0.18)
      s.addText(sv.name, {
        x: x + 0.68, y: y + 0.32, w: cw - 1.05, h: 0.36, margin: 0, valign: 'top',
        fontFace: F.display, fontSize: 16, bold: true, color: C.ink,
      })
      s.addText(sv.b, {
        x: x + 0.4, y: y + 0.82, w: cw - 0.8, h: 0.78, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 11.5, color: C.inkMut, lineSpacing: 16,
      })
    })
    const x6 = M + 2 * (cw + 0.25), y6 = 2.42 + ch + 0.28
    s.addShape(pres.ShapeType.roundRect, {
      x: x6, y: y6, w: cw, h: ch, rectRadius: 0.1,
      fill: { color: C.ink }, line: { color: C.ink, width: 1 }, shadow: softShadow(),
    })
    s.addText('Need two of these at once?\nThat is the normal case.', {
      x: x6 + 0.4, y: y6 + 0.5, w: cw - 0.8, h: 0.8, margin: 0, valign: 'top',
      fontFace: F.display, fontSize: 14, bold: true, color: C.onDark, lineSpacing: 20,
    })
    footer(s)
    s.addNotes('Do not walk through all five. Name them, then jump to the two that match what they said on the problem slide.')
    return s
  },

  serviceWeb: () => deepDive(CONTENT.deepDives.web),
  serviceData: () => deepDive(CONTENT.deepDives.data),
  serviceEng: () => deepDive(CONTENT.deepDives.engineering),

  process: () => {
    const s = lightSlide()
    heading(s, 'How we work', 'Four steps, no silent months')
    subhead(s, 'You see working software every Friday, from the first week.')
    const cw = (W - M * 2 - 0.75) / 4
    CONTENT.process.forEach((p, i) => {
      const x = M + i * (cw + 0.25)
      const last = i === 3
      s.addShape(pres.ShapeType.roundRect, {
        x, y: 2.5, w: cw, h: 3.3, rectRadius: 0.1,
        fill: { color: last ? C.ink : C.bgTint },
        line: { color: last ? C.ink : C.rule, width: 1 }, shadow: softShadow(),
      })
      s.addShape(pres.ShapeType.ellipse, {
        x: x + 0.38, y: 2.86, w: 0.52, h: 0.52,
        fill: { color: last ? C.brand : C.ink }, line: { color: last ? C.brand : C.ink, width: 0 },
      })
      s.addText(p.n, {
        x: x + 0.38, y: 2.93, w: 0.52, h: 0.4, margin: 0, align: 'center',
        fontFace: F.body, fontSize: 15, bold: true, color: C.onDark,
      })
      s.addText(p.h, {
        x: x + 0.38, y: 3.58, w: cw - 0.76, h: 0.4, margin: 0, valign: 'top',
        fontFace: F.display, fontSize: 18, bold: true, color: last ? C.onDark : C.ink,
      })
      s.addText(p.b, {
        x: x + 0.38, y: 4.06, w: cw - 0.76, h: 1.5, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 11.5, color: last ? C.onDarkMut : C.inkMut, lineSpacing: 17,
      })
    })
    footer(s)
    s.addNotes('The Friday demo is the line that lands. Most people have been burned by an agency that went quiet for six weeks.')
    return s
  },

  timeline: () => {
    const s = lightSlide()
    heading(s, 'Timeline', 'Five weeks, typically')
    subhead(s, CONTENT.timeline.lede)
    CONTENT.timeline.rows.forEach((r, i) => {
      const y = 2.45 + i * 0.86
      s.addShape(pres.ShapeType.roundRect, {
        x: M, y, w: W - M * 2, h: 0.72, rectRadius: 0.08,
        fill: { color: C.bgTint }, line: { color: C.rule, width: 1 },
      })
      s.addShape(pres.ShapeType.roundRect, {
        x: M + 0.28, y: y + 0.16, w: 1.28, h: 0.4, rectRadius: 0.2,
        fill: { color: C.ink }, line: { color: C.ink, width: 0 },
      })
      s.addText(r.w, {
        x: M + 0.28, y: y + 0.21, w: 1.28, h: 0.3, margin: 0, align: 'center',
        fontFace: F.body, fontSize: 10, bold: true, color: C.onDark, charSpacing: 0.6,
      })
      s.addText(r.h, {
        x: M + 1.78, y: y + 0.19, w: 3.3, h: 0.36, margin: 0, valign: 'top',
        fontFace: F.display, fontSize: 14, bold: true, color: C.ink,
      })
      s.addText(r.b, {
        x: M + 5.25, y: y + 0.21, w: W - M * 2 - 5.6, h: 0.36, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 11.5, color: C.inkMut,
      })
    })
    s.addText(CONTENT.timeline.note, {
      x: M, y: 6.05, w: 11, h: 0.36, margin: 0, valign: 'top',
      fontFace: F.display, fontSize: 14, italic: true, color: C.inkMut,
    })
    footer(s)
    s.addNotes('Give the range honestly. If their scope is bigger, say so here rather than letting them discover it in week three.')
    return s
  },

  whyUs: () => {
    const s = lightSlide()
    heading(s, 'Why us', 'What is different here')
    const cw = (W - M * 2 - 0.35) / 2
    CONTENT.differentiators.forEach((d, i) => {
      const x = M + (i % 2) * (cw + 0.35)
      const y = 2.1 + Math.floor(i / 2) * 1.92
      s.addShape(pres.ShapeType.roundRect, {
        x, y, w: cw, h: 1.62, rectRadius: 0.1,
        fill: { color: C.bgTint }, line: { color: C.rule, width: 1 }, shadow: softShadow(),
      })
      dot(s, x + 0.42, y + 0.46, C.brand, 0.16)
      s.addText(d.h, {
        x: x + 0.72, y: y + 0.34, w: cw - 1.15, h: 0.4, margin: 0, valign: 'top',
        fontFace: F.display, fontSize: 16, bold: true, color: C.ink,
      })
      s.addText(d.b, {
        x: x + 0.42, y: y + 0.82, w: cw - 0.84, h: 0.66, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 12, color: C.inkMut, lineSpacing: 17,
      })
    })
    footer(s)
    s.addNotes('Lead with the fixed quote. It is the single biggest objection-remover for anyone billed hourly before.')
    return s
  },

  objections: () => {
    const s = lightSlide()
    heading(s, 'Straight answers', 'What you are probably wondering')
    subhead(s, CONTENT.objections.lede)
    const cw = (W - M * 2 - 0.35) / 2
    CONTENT.objections.items.forEach((d, i) => {
      const x = M + (i % 2) * (cw + 0.35)
      const y = 2.5 + Math.floor(i / 2) * 1.82
      s.addShape(pres.ShapeType.roundRect, {
        x, y, w: cw, h: 1.55, rectRadius: 0.1,
        fill: { color: C.bgTint }, line: { color: C.rule, width: 1 }, shadow: softShadow(),
      })
      s.addText(d.h, {
        x: x + 0.42, y: y + 0.3, w: cw - 0.84, h: 0.38, margin: 0, valign: 'top',
        fontFace: F.display, fontSize: 16, bold: true, color: C.ink,
      })
      s.addText(d.b, {
        x: x + 0.42, y: y + 0.74, w: cw - 0.84, h: 0.68, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 11.5, color: C.inkMut, lineSpacing: 16,
      })
    })
    footer(s)
    s.addNotes('Only show this if they seem hesitant. Raising objections nobody had can plant doubt instead of removing it.')
    return s
  },

  pricing: () => {
    const s = lightSlide()
    heading(s, 'Pricing', 'Transparent starting points')
    subhead(s, 'Every project gets a fixed, one-page quote before any money changes hands.')
    const cw = (W - M * 2 - 0.5) / 3
    CONTENT.pricing.forEach((p, i) => {
      const x = M + i * (cw + 0.25)
      const dark = !!p.featured
      s.addShape(pres.ShapeType.roundRect, {
        x, y: 2.42, w: cw, h: 3.6, rectRadius: 0.12,
        fill: { color: dark ? C.ink : C.bgTint },
        line: { color: dark ? C.ink : C.rule, width: 1 }, shadow: softShadow(),
      })
      if (dark) {
        s.addShape(pres.ShapeType.roundRect, {
          x: x + cw - 1.62, y: 2.66, w: 1.28, h: 0.32, rectRadius: 0.16,
          fill: { color: C.brand }, line: { color: C.brand, width: 0 },
        })
        s.addText('POPULAR', {
          x: x + cw - 1.62, y: 2.7, w: 1.28, h: 0.24, margin: 0, align: 'center',
          fontFace: F.body, fontSize: 8.5, bold: true, color: 'FFFFFF', charSpacing: 1.2,
        })
      }
      s.addText(p.name, {
        x: x + 0.42, y: 2.7, w: cw - 2.2, h: 0.34, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 12, bold: true, color: dark ? C.onDarkMut : C.inkMut, charSpacing: 1.4,
      })
      s.addText(p.price, {
        x: x + 0.42, y: 3.1, w: cw - 0.84, h: 0.7, margin: 0, valign: 'top',
        fontFace: F.display, fontSize: 36, bold: true, color: dark ? C.onDark : C.ink,
      })
      s.addText(p.note, {
        x: x + 0.42, y: 3.8, w: cw - 0.84, h: 0.26, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 10.5, color: dark ? C.onDarkMut : C.inkSoft,
      })
      s.addText(p.desc, {
        x: x + 0.42, y: 4.12, w: cw - 0.84, h: 0.4, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 11.5, color: dark ? C.onDarkMut : C.inkMut,
      })
      s.addText(p.items.map((t, j) => ({
        text: t, options: { bullet: true, breakLine: j !== p.items.length - 1 },
      })), {
        x: x + 0.42, y: 4.58, w: cw - 0.84, h: 1.24, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 10.5, color: dark ? C.onDarkMut : C.inkMut, paraSpaceAfter: 4,
      })
    })
    footer(s)
    s.addNotes('These are starting points, not a menu. Say the number, then move straight to what their scope would actually need.')
    return s
  },

  next: () => {
    const s = lightSlide()
    heading(s, 'Getting started', 'What happens next')
    const cw = (W - M * 2 - 0.5) / 3
    CONTENT.next.forEach((n, i) => {
      numberCard(s, {
        x: M + i * (cw + 0.25), y: 2.3, w: cw, h: 2.6,
        n: String(i + 1).padStart(2, '0'), title: n.h, body: n.b,
      })
    })
    s.addText('No retainer, no lock-in, and nothing signed until the scope is on one page.', {
      x: M, y: 5.22, w: 11, h: 0.36, margin: 0, valign: 'top',
      fontFace: F.display, fontSize: 15, italic: true, color: C.inkMut,
    })
    footer(s)
    s.addNotes('Book the call before leaving the room. Offer two concrete times rather than "let me know".')
    return s
  },

  close: () => {
    const s = pres.addSlide()
    s.background = { color: C.bgDark }
    s.addText('Let us talk about\nyour project.', {
      x: M, y: 2.25, w: 8.4, h: 1.8, margin: 0, valign: 'top',
      fontFace: F.display, fontSize: 46, bold: true, color: C.onDark, lineSpacing: 54,
    })
    s.addText('A 30-minute call, then a fixed one-page quote. That is the whole process.', {
      x: M, y: 4.22, w: 7.4, h: 0.5, margin: 0, valign: 'top',
      fontFace: F.body, fontSize: 14, color: C.onDarkMut, lineSpacing: 21,
    })
    ;[THEME.contact.site, THEME.contact.email, THEME.contact.location].forEach((t, i) => {
      const y = 5.1 + i * 0.42
      dot(s, M + 0.02, y + 0.08, C.brand, 0.14)
      s.addText(t, {
        x: M + 0.32, y, w: 6, h: 0.34, margin: 0, valign: 'top',
        fontFace: F.body, fontSize: 13, color: C.onDark,
      })
    })
    ;['s1', 's2', 's5', 's3', 's4'].forEach((k, i) => dot(s, W - M - 1.6 + i * 0.32, H - 1.05, C[k], 0.19))
    s.addText(THEME.company, {
      x: W - M - 4, y: H - 1.62, w: 4, h: 0.4, margin: 0, align: 'right',
      fontFace: F.display, fontSize: 20, bold: true, color: C.onDark,
    })
    s.addNotes('Closing. Agree the next step out loud before you pack up.')
    return s
  },
}

// ════════════════════════════════════════════════════════════════════════════
//  CLI
// ════════════════════════════════════════════════════════════════════════════
const args = process.argv.slice(2)
const argOf = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : null
}

if (args.includes('--list')) {
  console.log('\nDecks:')
  for (const [k, v] of Object.entries(DECKS)) {
    console.log(`  --deck=${k.padEnd(12)} ${String(v.slides.length).padStart(2)} slides  ${v.label}`)
  }
  console.log('\nSlides available to compose:')
  console.log('  ' + Object.keys(SLIDES).join(', ') + '\n')
  process.exit(0)
}

const deckName = argOf('deck') || 'full'
deckCfg = DECKS[deckName]
if (!deckCfg) {
  console.error(`Unknown deck "${deckName}". Run --list to see the options.`)
  process.exit(1)
}

const unknown = deckCfg.slides.filter((n) => !SLIDES[n])
if (unknown.length) {
  console.error(`Deck "${deckName}" references slides that do not exist: ${unknown.join(', ')}`)
  process.exit(1)
}

pres = new pptxgen()
pres.layout = 'LAYOUT_WIDE'
pres.author = THEME.company
pres.title = `${THEME.company} - ${deckCfg.label}`

deckCfg.slides.forEach((name, i) => {
  page = i + 1
  SLIDES[name]()
})

const out = argOf('out') || args.find((a) => !a.startsWith('--')) ||
  `${THEME.company}-${deckName === 'full' ? 'Pitch' : deckName}-Deck.pptx`

pres.writeFile({ fileName: out })
  .then((f) => console.log(`Wrote ${f}  (${deckName}, ${deckCfg.slides.length} slides)`))
