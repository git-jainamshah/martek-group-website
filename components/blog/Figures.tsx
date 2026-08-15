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

/**
 * What a 301 redirect preserves and a 404 throws away. The single most
 * important idea in a site migration, so it gets a picture.
 */
export function RedirectMap() {
  const row = (y: number, ok: boolean) => {
    const c = ok ? 'var(--sage)' : BRAND
    return (
      <g key={y}>
        <rect x="14" y={y} width="196" height="52" rx="12" fill={PAPER} stroke={INK} strokeWidth="1.5" />
        <text x="30" y={y + 24} fill={MUT} fontSize="10.5" fontFamily="var(--mono)">OLD URL</text>
        <text x="30" y={y + 41} fill={INK} fontSize="12.5" fontFamily="var(--mono)">/services-web</text>

        {/* Status pill sits ABOVE the arrow, not on it. At the same y the line
            ran straight through the bottom of the badge. */}
        <line x1="216" y1={y + 26} x2="292" y2={y + 26} stroke={c} strokeWidth="2" markerEnd={`url(#rm-arrow-${ok ? 'ok' : 'no'})`} />
        <rect x="234" y={y + 1} width="40" height="19" rx="9.5" fill={c} />
        <text x="254" y={y + 14.5} fill={PAPER} fontSize="11" fontWeight="700"
          fontFamily="var(--mono)" textAnchor="middle">{ok ? '301' : '404'}</text>

        <rect x="300" y={y} width="240" height="52" rx="12"
          fill={ok ? 'var(--paper-2)' : PAPER} stroke={ok ? INK : c}
          strokeWidth="1.5" strokeDasharray={ok ? undefined : '5 4'} />
        <text x="318" y={y + 24} fill={MUT} fontSize="10.5" fontFamily="var(--mono)">{ok ? 'NEW URL' : 'NOTHING'}</text>
        <text x="318" y={y + 41} fill={ok ? INK : c} fontSize="12.5" fontFamily="var(--mono)">
          {ok ? '/services/web-development' : 'Page not found'}
        </text>

        <text x="558" y={y + 24} fill={ok ? 'var(--sage)' : BRAND} fontSize="12.5" fontWeight="700">
          {ok ? 'Rankings move' : 'Rankings lost'}
        </text>
        <text x="558" y={y + 41} fill={MUT} fontSize="11}">{''}</text>
        <text x="558" y={y + 41} fill={MUT} fontSize="11">{ok ? 'Links still count' : 'Links point nowhere'}</text>
      </g>
    )
  }
  return (
    <svg viewBox="0 0 760 170" role="img"
      aria-label="A 301 redirect moves rankings to the new URL; without one the old URL 404s and its rankings are lost"
      style={{ width: '100%', height: 'auto' }}>
      <defs>
        <marker id="rm-arrow-ok" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="var(--sage)" />
        </marker>
        <marker id="rm-arrow-no" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={BRAND} />
        </marker>
      </defs>
      <text x="14" y="16" fill={MUT} fontSize="10.5" fontFamily="var(--mono)">WITH A REDIRECT MAP</text>
      {row(26, true)}
      <text x="14" y="106" fill={MUT} fontSize="10.5" fontFamily="var(--mono)">WITHOUT ONE</text>
      {row(116, false)}
    </svg>
  )
}

/**
 * The shape of a normal post-launch recovery, so a reader can tell an expected
 * dip from a real problem instead of panicking (or waiting too long).
 */
export function RedesignRecovery() {
  const pts = [[40, 60], [150, 108], [260, 96], [370, 74], [480, 58], [590, 48], [700, 44]]
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const labels = ['Launch', 'Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 6', 'Wk 8']
  return (
    <svg viewBox="0 0 760 200" role="img"
      aria-label="Traffic dips for one to two weeks after launch, then recovers to the previous baseline by week four to eight"
      style={{ width: '100%', height: 'auto' }}>
      {/* baseline */}
      <line x1="30" y1="60" x2="730" y2="60" stroke={MUT} strokeWidth="1.2" strokeDasharray="5 5" />
      <text x="250" y="52" fill={MUT} fontSize="11" fontFamily="var(--mono)">OLD BASELINE</text>

      {/* danger zone */}
      <rect x="30" y="130" width="700" height="34" rx="8" fill="var(--brand-soft)" opacity="0.55" />
      <text x="44" y="152" fill="var(--brand-ink)" fontSize="11.5" fontWeight="700">
        Still down here at week 4? Something is broken, do not wait it out.
      </text>

      <path d={path} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="5" fill={i === 1 ? BRAND : INK} />
          <text x={p[0]} y="186" fill={MUT} fontSize="11" fontFamily="var(--mono)" textAnchor="middle">{labels[i]}</text>
        </g>
      ))}
      <text x="150" y="128" fill={BRAND} fontSize="11.5" fontWeight="700" textAnchor="middle">expected dip</text>
    </svg>
  )
}

/**
 * The three platforms placed on the two axes that actually decide the choice:
 * how much control you keep, and how much maintenance you take on.
 */
export function PlatformTradeoff() {
  const items = [
    { x: 175, y: 74, label: 'Webflow', note: 'Least upkeep, least control', fill: 'var(--butter)' },
    { x: 400, y: 116, label: 'WordPress', note: 'Most flexible, most upkeep', fill: 'var(--sage-soft)' },
    { x: 625, y: 68, label: 'Custom', note: 'Exactly what you specified', fill: 'var(--terra-soft)' },
  ]
  return (
    <svg viewBox="0 0 760 240" role="img"
      aria-label="Webflow has the least upkeep and least control, WordPress the most flexibility and most upkeep, custom builds give the most control"
      style={{ width: '100%', height: 'auto' }}>
      {/* axes */}
      <line x1="60" y1="186" x2="720" y2="186" stroke={INK} strokeWidth="1.5" />
      <line x1="60" y1="186" x2="60" y2="30" stroke={INK} strokeWidth="1.5" />
      <text x="60" y="212" fill={MUT} fontSize="11" fontFamily="var(--mono)">LESS CONTROL</text>
      <text x="720" y="212" fill={MUT} fontSize="11" fontFamily="var(--mono)" textAnchor="end">MORE CONTROL</text>
      {/* Rotated so it runs along its own axis - horizontal, it collided with
          the nearest plotted item. */}
      <text x="42" y="108" fill={MUT} fontSize="11" fontFamily="var(--mono)"
        textAnchor="middle" transform="rotate(-90 42 108)">MORE MAINTENANCE</text>

      {items.map((it) => (
        <g key={it.label}>
          <circle cx={it.x} cy={it.y} r="26" fill={it.fill} stroke={INK} strokeWidth="1.5" />
          <text x={it.x} y={it.y - 38} fill={INK} fontSize="14.5" fontWeight="700" textAnchor="middle">{it.label}</text>
          <text x={it.x} y={it.y + 50} fill={MUT} fontSize="11.5" textAnchor="middle">{it.note}</text>
        </g>
      ))}
    </svg>
  )
}

/**
 * How a ChatGPT ad click becomes an attributed conversion. The chain is the
 * thing people get wrong (usually by losing oppref), so it gets a picture.
 */
export function OaiMeasureFlow() {
  const steps = [
    { t: '1. Ad click', s: 'ChatGPT appends', m: '?oppref=...' },
    { t: '2. Landing page', s: 'Pixel reads it, stores', m: '__oppref cookie' },
    { t: '3. Conversion', s: 'Your event fires', m: 'oaiq("measure", ...)' },
    { t: '4. Ads Manager', s: 'Matched to the click', m: 'Conversions' },
  ]
  const w = 168
  const gap = 22
  return (
    <svg viewBox="0 0 760 200" role="img"
      aria-label="An ad click appends oppref to the landing page URL, the Pixel stores it in a first-party cookie, a later conversion event fires, and Ads Manager matches it back to the click"
      style={{ width: '100%', height: 'auto' }}>
      <defs>
        <marker id="oai-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={INK} />
        </marker>
      </defs>

      {steps.map((b, i) => {
        const x = 12 + i * (w + gap)
        const last = i === steps.length - 1
        return (
          <g key={i}>
            <rect x={x} y="28" width={w} height="98" rx="14"
              fill={last ? INK : PAPER} stroke={INK} strokeWidth="1.5" />
            <text x={x + 16} y="56" fill={last ? PAPER : INK} fontSize="13.5" fontWeight="700">{b.t}</text>
            <text x={x + 16} y="78" fill={last ? 'var(--paper-3)' : MUT} fontSize="11.5">{b.s}</text>
            <text x={x + 16} y="102" fill={last ? BRAND : BRAND} fontSize="11.5" fontFamily="var(--mono)">{b.m}</text>
            {!last && (
              <line x1={x + w + 3} y1="77" x2={x + w + gap - 5} y2="77"
                stroke={INK} strokeWidth="1.8" markerEnd="url(#oai-arrow)" />
            )}
          </g>
        )
      })}

      {/* The failure mode, called out where it happens */}
      <text x="12" y="160" fill={BRAND} fontSize="11.5" fontWeight="700">
        Break the chain here and nothing is attributed:
      </text>
      <text x="12" y="180" fill={MUT} fontSize="11.5">
        a redirect that drops the query string, or a Pixel that loads too late.
      </text>
    </svg>
  )
}
