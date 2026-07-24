/**
 * Hand-drawn style SVG diagrams for the articles. Inline SVG keeps them crisp,
 * theme-aware, fast (no image requests) and accessible.
 */

const INK = 'var(--ink)'
const PAPER = 'var(--paper)'
const BRAND = 'var(--brand)'
const MUT = 'var(--ink-mut)'

export function ConsentFlow() {
  return (
    <svg viewBox="0 0 760 250" role="img" aria-label="Consent Mode page load sequence" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <marker id="cf-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={INK} />
        </marker>
      </defs>

      {/* timeline */}
      <line x1="30" y1="196" x2="730" y2="196" stroke={INK} strokeWidth="1.5" markerEnd="url(#cf-arrow)" />
      <text x="30" y="222" fill={MUT} fontSize="11" fontFamily="var(--mono)">PAGE LOAD</text>
      <text x="660" y="222" fill={MUT} fontSize="11" fontFamily="var(--mono)">TIME</text>

      {[
        { x: 40, w: 190, t: '1. Consent default', s: 'ad_storage: denied', s2: 'analytics_storage: denied', fill: PAPER },
        { x: 260, w: 190, t: '2. Google tags load', s: 'Restricted mode', s2: 'No cookies set', fill: PAPER },
        { x: 480, w: 240, t: '3. Visitor chooses', s: 'gtag(consent, update)', s2: 'Granted signals unlock', fill: 'var(--paper-2)' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="34" width={b.w} height="120" rx="14" fill={b.fill} stroke={INK} strokeWidth="1.5" />
          <text x={b.x + 16} y="62" fill={INK} fontSize="14" fontWeight="700">{b.t}</text>
          <text x={b.x + 16} y="88" fill={MUT} fontSize="12" fontFamily="var(--mono)">{b.s}</text>
          <text x={b.x + 16} y="108" fill={MUT} fontSize="12" fontFamily="var(--mono)">{b.s2}</text>
          <circle cx={b.x + b.w / 2} cy="196" r="6" fill={i === 2 ? BRAND : INK} />
          <line x1={b.x + b.w / 2} y1="154" x2={b.x + b.w / 2} y2="190" stroke={INK} strokeWidth="1.2" strokeDasharray="3 3" />
        </g>
      ))}

      <text x="486" y="146" fill={BRAND} fontSize="12" fontWeight="700">Modelling fills the gap</text>
    </svg>
  )
}

export function CwvMeters() {
  const meters = [
    { label: 'LCP', sub: 'Loading', good: 'under 2.5s', pct: 0.42 },
    { label: 'INP', sub: 'Responsiveness', good: 'under 200ms', pct: 0.3 },
    { label: 'CLS', sub: 'Visual stability', good: 'under 0.1', pct: 0.24 },
  ]
  return (
    <svg viewBox="0 0 760 230" role="img" aria-label="Core Web Vitals thresholds" style={{ width: '100%', height: 'auto' }}>
      {meters.map((m, i) => {
        const y = 26 + i * 66
        return (
          <g key={m.label}>
            <text x="12" y={y + 20} fill={INK} fontSize="18" fontWeight="700">{m.label}</text>
            <text x="70" y={y + 20} fill={MUT} fontSize="12">{m.sub}</text>
            {/* bar */}
            <rect x="210" y={y + 4} width="420" height="20" rx="10" fill="var(--paper-3)" stroke={INK} strokeWidth="1.2" />
            <rect x="210" y={y + 4} width={420 * 0.45} height="20" rx="10" fill="#3D7D6E" opacity="0.85" />
            <rect x={210 + 420 * 0.45} y={y + 4} width={420 * 0.28} height="20" fill="#C58A2E" opacity="0.75" />
            <rect x={210 + 420 * 0.73} y={y + 4} width={420 * 0.27} height="20" fill={BRAND} opacity="0.75" />
            {/* marker */}
            <polygon
              points={`${210 + 420 * m.pct},${y + 2} ${205 + 420 * m.pct},${y - 8} ${215 + 420 * m.pct},${y - 8}`}
              fill={INK}
            />
            <text x="646" y={y + 19} fill={INK} fontSize="12" fontFamily="var(--mono)">{m.good}</text>
          </g>
        )
      })}
      <text x="212" y="222" fill="#3D7D6E" fontSize="11" fontWeight="700">GOOD</text>
      <text x="404" y="222" fill="#C58A2E" fontSize="11" fontWeight="700">NEEDS WORK</text>
      <text x="556" y="222" fill={BRAND} fontSize="11" fontWeight="700">POOR</text>
    </svg>
  )
}

export function CadFormats() {
  return (
    <svg viewBox="0 0 760 270" role="img" aria-label="CAD format families" style={{ width: '100%', height: 'auto' }}>
      {/* 2D */}
      <rect x="20" y="30" width="220" height="200" rx="16" fill="var(--paper-2)" stroke={INK} strokeWidth="1.5" />
      <text x="40" y="60" fill={INK} fontSize="15" fontWeight="700">2D drawings</text>
      <text x="40" y="82" fill={MUT} fontSize="12">Flat, dimensioned</text>
      <g transform="translate(44,100)">
        <rect x="0" y="0" width="80" height="54" fill="none" stroke={INK} strokeWidth="1.4" />
        <line x1="0" y1="66" x2="80" y2="66" stroke={MUT} strokeWidth="1" />
        <line x1="0" y1="62" x2="0" y2="70" stroke={MUT} strokeWidth="1" />
        <line x1="80" y1="62" x2="80" y2="70" stroke={MUT} strokeWidth="1" />
        <text x="30" y="84" fill={MUT} fontSize="10" fontFamily="var(--mono)">120.0</text>
      </g>
      <text x="40" y="212" fill={INK} fontSize="12" fontFamily="var(--mono)" fontWeight="700">DWG · DXF · PDF</text>

      {/* precise 3D */}
      <rect x="270" y="30" width="220" height="200" rx="16" fill="var(--paper-2)" stroke={INK} strokeWidth="1.5" />
      <text x="290" y="60" fill={INK} fontSize="15" fontWeight="700">Precise 3D</text>
      <text x="290" y="82" fill={MUT} fontSize="12">Curves stay curves</text>
      <g transform="translate(320,100)">
        <ellipse cx="55" cy="16" rx="46" ry="15" fill="none" stroke={INK} strokeWidth="1.5" />
        <path d="M9,16 L9,58 A46,15 0 0 0 101,58 L101,16" fill="none" stroke={INK} strokeWidth="1.5" />
      </g>
      <text x="290" y="212" fill={INK} fontSize="12" fontFamily="var(--mono)" fontWeight="700">STEP · IGES</text>

      {/* mesh */}
      <rect x="520" y="30" width="220" height="200" rx="16" fill="var(--paper-2)" stroke={INK} strokeWidth="1.5" />
      <text x="540" y="60" fill={INK} fontSize="15" fontWeight="700">Meshes</text>
      <text x="540" y="82" fill={MUT} fontSize="12">Curves become facets</text>
      <g transform="translate(570,100)" fill="none" stroke={BRAND} strokeWidth="1.4">
        <polygon points="55,2 88,14 88,50 55,74 22,50 22,14" />
        <line x1="22" y1="14" x2="88" y2="50" />
        <line x1="88" y1="14" x2="22" y2="50" />
        <line x1="55" y1="2" x2="55" y2="74" />
      </g>
      <text x="540" y="212" fill={INK} fontSize="12" fontFamily="var(--mono)" fontWeight="700">STL · 3MF</text>
    </svg>
  )
}
