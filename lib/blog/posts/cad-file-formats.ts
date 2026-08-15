import type { Post } from '../types'

export const cadFileFormats: Post = {
  slug: 'dwg-vs-step-vs-stl-cad-file-formats-explained',
  title: 'DWG vs STEP vs STL: CAD File Formats Explained Without the Jargon',
  cardTitle: 'DWG vs STEP vs STL Explained',
  excerpt:
    'Someone asked you for "a STEP file" and you are not sure what you have. This is the plain-English map of which format does what, which one to send, and how to avoid the expensive mistakes.',
  description:
    'A jargon-free guide to CAD file formats: what DWG, DXF, STEP, IGES, STL and 3MF actually are, when to use each, and which file to send your manufacturer or 3D printer.',
  category: 'Engineering',
  date: '2026-07-24',
  readMinutes: 10,
  author: { name: 'Marrelay', role: 'Digital studio, Toronto' },
  tags: ['CAD', 'DWG', 'STEP', 'STL', 'Manufacturing', '3D printing'],
  seedViews: 165,
  blocks: [
    {
      t: 'lead',
      text: 'A supplier asks for a STEP file. Your designer sends a DWG. The 3D printing service wants an STL and rejects both. Nobody explains why, because in engineering everyone assumes you already know. Here is the whole landscape in one page, written for the person signing the invoice.',
    },
    {
      t: 'callout',
      kind: 'note',
      title: 'The one idea that makes it all click',
      text: 'CAD formats split into two families: files that describe shapes with perfect mathematical precision, and files that approximate shapes with millions of tiny triangles. Precision files can be edited and manufactured accurately. Triangle files can be printed and viewed but never truly re-engineered. Almost every mistake comes from sending one when they needed the other.',
    },

    { t: 'h2', id: 'families', text: 'The two families' },
    {
      t: 'figure',
      kind: 'cad-formats',
      caption: 'The CAD format landscape: 2D drawings, precise 3D geometry, and mesh approximations.',
    },
    {
      t: 'h3',
      text: 'Precise geometry (curves stay curves)',
    },
    {
      t: 'p',
      text: 'These store real mathematics: a circle is defined as a circle with a radius. Scale it a thousand times and it stays perfectly round. This is what manufacturers, machinists and engineers need, because you can measure, modify and machine from it. STEP, IGES and native CAD files live here.',
    },
    {
      t: 'h3',
      text: 'Meshes (curves become many flat facets)',
    },
    {
      t: 'p',
      text: 'These approximate a shape with a skin of triangles. A cylinder becomes a many-sided prism. Zoom in far enough and you see the flat faces. Good enough for 3D printing and visualisation, useless for precision engineering, and effectively impossible to convert back into clean editable geometry. STL and 3MF live here.',
    },

    { t: 'h2', id: 'formats', text: 'The formats, one by one' },
    {
      t: 'table',
      caption: 'The formats you will actually encounter.',
      head: ['Format', 'Dimension', 'Type', 'Use it for'],
      rows: [
        ['DWG', '2D (and some 3D)', 'Native (AutoCAD)', 'Working drawings, floor plans, shop drawings'],
        ['DXF', '2D', 'Exchange', 'Sending 2D profiles to laser/waterjet/CNC cutters'],
        ['STEP (.stp)', '3D', 'Exchange, precise', 'The default for sending 3D parts to manufacturers'],
        ['IGES (.igs)', '3D', 'Exchange, precise (older)', 'Legacy systems and surface data; use only if asked'],
        ['STL', '3D', 'Mesh', '3D printing, quick visual prototypes'],
        ['3MF', '3D', 'Mesh (modern)', 'Better 3D printing: carries colour, units, materials'],
        ['PDF', '2D', 'Document', 'Human review, approvals, printing on paper'],
        ['SLDPRT / IPT / F3D', '3D', 'Native (proprietary)', 'Editing inside the original software only'],
      ],
    },
    {
      t: 'h3',
      text: 'DWG: the 2D workhorse',
    },
    {
      t: 'p',
      text: 'AutoCAD\'s native format and the industry standard for 2D drawings: layouts, elevations, dimensioned shop drawings. It keeps layers, text, dimensions and title blocks. Because it is proprietary, other software reads it with varying fidelity, though support is now generally good.',
    },
    {
      t: 'h3',
      text: 'DXF: DWG\'s universal cousin',
    },
    {
      t: 'p',
      text: 'Created specifically so other programs could read AutoCAD geometry. Cutting services (laser, waterjet, plasma, CNC routers) almost always ask for DXF because they only need the flat outline to drive the machine.',
    },
    {
      t: 'h3',
      text: 'STEP: the one to send 90% of the time',
    },
    {
      t: 'p',
      text: 'A neutral, open, precise 3D format that virtually every CAD system reads and writes. If a manufacturer, machinist or engineer asks for "a 3D file" without specifying, STEP is the safe answer. It preserves exact geometry and assembly structure. What it does not carry is your modelling history, so they get the finished shape rather than an editable recipe.',
    },
    {
      t: 'h3',
      text: 'IGES: the older alternative',
    },
    {
      t: 'p',
      text: 'STEP\'s predecessor. Still used by some legacy systems and for complex surface work, but it is more prone to producing gaps and errors on import. Send it only when specifically requested.',
    },
    {
      t: 'h3',
      text: 'STL: triangles for printing',
    },
    {
      t: 'p',
      text: 'The long-standing 3D printing standard. It stores nothing but a triangle mesh: no units, no colour, no materials, no accuracy guarantee. The export resolution you choose decides whether a curved surface looks smooth or faceted. Fine for its job, wrong for manufacturing tolerances.',
    },
    {
      t: 'h3',
      text: '3MF: what STL should have been',
    },
    {
      t: 'p',
      text: 'A modern replacement that carries units, colour, materials and print settings in one file, with fewer of STL\'s corruption problems. If your printer or service supports it, prefer it.',
    },
    {
      t: 'callout',
      kind: 'warn',
      title: 'Native files are not a delivery format',
      text: 'SLDPRT (SolidWorks), IPT (Inventor) and F3D (Fusion) only open properly in their own software, and often only in a matching or newer version. Never accept these as your only deliverable. Always get a STEP and a PDF alongside them, or you are locked into one vendor\'s licence to touch your own design.',
    },

    { t: 'h2', id: 'which', text: 'Which file should I actually send?' },
    {
      t: 'table',
      caption: 'The cheat sheet. Screenshot this.',
      head: ['If you are...', 'Send', 'Why'],
      rows: [
        ['Getting a part machined or moulded', 'STEP + dimensioned PDF', 'Precise geometry plus the tolerances and notes that geometry cannot carry'],
        ['Getting sheet metal or panels cut', 'DXF (flat profile)', 'Cutting machines need the 2D outline'],
        ['3D printing something', 'STL or 3MF', 'Printers slice meshes; precision is not required'],
        ['Asking for a quote', 'STEP + PDF', 'Enough to assess cost without exposing editable source'],
        ['Handing a project to a new engineer', 'Native + STEP + PDF', 'Native to edit, STEP as insurance, PDF as the human record'],
        ['Sharing with a non-technical stakeholder', 'PDF (or a 3D PDF)', 'Opens anywhere, no CAD licence needed'],
      ],
    },

    { t: 'h2', id: 'mistakes', text: 'The expensive mistakes' },
    {
      t: 'ol',
      items: [
        'Sending an STL for machining. The manufacturer either refuses it or charges to rebuild the model from scratch, because they cannot pull accurate dimensions from a triangle mesh. This is the single most common and most costly mix-up.',
        'Sending 3D geometry with no drawing. A STEP file contains shape but not tolerances, surface finish, materials or thread specs. Without a dimensioned drawing, the shop guesses, and their guess is not free.',
        'Ignoring units. STL carries no unit information, so a part modelled in millimetres can arrive interpreted as inches. That is a 25x error you discover after production.',
        'Exporting STL at low resolution. Too coarse and curved surfaces print visibly faceted. Too fine and the file becomes unusably large. Ask your printer for their preferred tolerance setting.',
        'Accepting only proprietary files at handover. When the relationship or the software licence ends, your design becomes unusable. Insist on neutral formats in the contract.',
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'What to write into your next CAD contract',
      text: 'Deliverables to include: native source files, STEP for 3D, DXF for any cut profiles, and dimensioned PDF drawings. Four lines in a scope document that save you from vendor lock-in permanently.',
    },

    { t: 'h2', id: 'faq', text: 'Questions we get asked' },
    {
      t: 'faq',
      items: [
        {
          q: 'Can I convert an STL back into a proper editable model?',
          a: 'Not cleanly. Software can attempt to fit surfaces to the mesh, but the result is approximate and messy, and it is usually faster and cheaper to remodel the part properly. Treat mesh conversion as a last resort, not a plan.',
        },
        {
          q: 'Is STEP or IGES better?',
          a: 'STEP, almost always. It is newer, better supported, handles solids and assemblies more reliably, and produces fewer import errors. Use IGES only when a client or system specifically requires it.',
        },
        {
          q: 'Why did my file open with gaps or missing faces?',
          a: 'Usually a translation issue between systems, more common with IGES and with very complex surfaces. Re-export as STEP, and ask for a repaired version. A quick check on receipt is far cheaper than discovering it mid-production.',
        },
        {
          q: 'Do I need CAD software just to look at a file?',
          a: 'No. Free viewers exist for most formats, and many CAD tools offer free web-based viewers. For non-technical stakeholders, ask for a PDF instead so nobody needs to install anything.',
        },
      ],
    },

    { t: 'h2', id: 'wrap', text: 'The short version' },
    {
      t: 'p',
      text: 'STEP for precise 3D and anything being manufactured. DXF for 2D cutting. STL or 3MF only for 3D printing. Always pair 3D geometry with a dimensioned PDF, because tolerances live in the drawing, not the model. And never let native files be your only copy.',
    },
    {
      t: 'sources',
      title: 'Format references',
      items: [
        { label: 'ISO 10303 (STEP)', url: 'https://www.iso.org/standard/63141.html', note: 'the standard behind .step and .stp' },
        { label: 'Autodesk: About DWG', url: 'https://www.autodesk.com/products/dwg', note: 'the native AutoCAD format' },
        { label: '3MF Consortium', url: 'https://3mf.io/', note: 'the modern alternative to STL for 3D printing' },
      ],
    },

  ],
}
