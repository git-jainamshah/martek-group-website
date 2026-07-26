'use client'

/**
 * Dependency-free SVG charts in the Marrelay palette.
 */

const PALETTE = ['#ED1C24', '#6B9080', '#8390C8', '#E07A5F', '#8B5A8C', '#F2CC8F', '#6E6A62', '#C8141B']

export function HBarChart({ data, maxBars = 8 }: { data: { label: string; value: number }[]; maxBars?: number }) {
  const rows = data.slice(0, maxBars)
  const max = Math.max(1, ...rows.map((r) => r.value))
  if (!rows.length) return <Empty />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((r, i) => (
        <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 34px', gap: 10, alignItems: 'center', fontSize: 12.5 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.label}>{r.label}</span>
          <div style={{ background: 'var(--paper-3)', borderRadius: 6, height: 18, overflow: 'hidden' }}>
            <div style={{ width: `${(r.value / max) * 100}%`, height: '100%', background: PALETTE[i % PALETTE.length], borderRadius: 6, transition: 'width .4s' }} />
          </div>
          <b style={{ textAlign: 'right' }}>{r.value}</b>
        </div>
      ))}
    </div>
  )
}

export function Donut({ data, size = 168 }: { data: { label: string; value: number }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (!total) return <Empty />
  const r = 60, cx = 80, cy = 80, thick = 26
  let acc = 0
  const arcs = data.slice(0, 8).map((d, i) => {
    const start = (acc / total) * 2 * Math.PI - Math.PI / 2
    acc += d.value
    const end = (acc / total) * 2 * Math.PI - Math.PI / 2
    const large = end - start > Math.PI ? 1 : 0
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end)
    return { d, i, path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` }
  })
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox="0 0 160 160">
        {arcs.map((a) => (
          <path key={a.d.label} d={a.path} fill="none" stroke={PALETTE[a.i % PALETTE.length]} strokeWidth={thick} />
        ))}
        <text x={cx} y={cy - 2} textAnchor="middle" style={{ fontSize: 26, fontWeight: 700, fill: 'var(--ink)' }}>{total}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" style={{ fontSize: 10, fill: 'var(--ink-mut)' }}>leads</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12.5 }}>
        {data.slice(0, 8).map((d, i) => (
          <span key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <i style={{ width: 10, height: 10, borderRadius: 3, background: PALETTE[i % PALETTE.length], display: 'inline-block' }} />
            {d.label} <b style={{ marginLeft: 'auto', paddingLeft: 10 }}>{d.value}</b>
          </span>
        ))}
      </div>
    </div>
  )
}

export function TimeSeries({ data, height = 130 }: { data: { date: string; value: number }[]; height?: number }) {
  if (!data.length) return <Empty />
  const max = Math.max(1, ...data.map((d) => d.value))
  const w = Math.max(280, data.length * 26)
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={w} height={height + 26} style={{ display: 'block' }}>
        {data.map((d, i) => {
          const h = (d.value / max) * height
          return (
            <g key={d.date}>
              <rect x={i * 26 + 4} y={height - h} width={16} height={h} rx={4} fill="var(--brand)" opacity={0.85}>
                <title>{d.date}: {d.value}</title>
              </rect>
              <text x={i * 26 + 12} y={height + 14} textAnchor="middle" style={{ fontSize: 8.5, fill: 'var(--ink-soft)' }}>
                {d.date.slice(5)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function StatCard({
  label, value, sub, exact,
}: {
  label: string
  value: React.ReactNode
  sub?: string
  /** Full-precision figure shown under the compact headline (e.g. "CA$20,227.00"). */
  exact?: string
}) {
  return (
    <div className="ad-card" style={{ padding: 18, minWidth: 0 }}>
      <div
        style={{
          fontSize: 30, fontWeight: 700, fontFamily: 'var(--serif)', lineHeight: 1.12,
          // Headline figures must never spill out of the card.
          minWidth: 0, overflowWrap: 'anywhere',
        }}
        title={exact}
      >
        {value}
      </div>
      {exact && (
        <div className="ad-soft" style={{ fontSize: 11.5, marginTop: 3, fontFamily: 'var(--mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {exact}
        </div>
      )}
      <div className="ad-mut" style={{ fontSize: 13, marginTop: exact ? 4 : 2 }}>{label}</div>
      {sub && <div className="ad-soft" style={{ fontSize: 11.5, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Empty() {
  return <p className="ad-soft" style={{ fontSize: 13 }}>No data yet.</p>
}

/* ============================================================
   Extended chart set for the main dashboard
   ============================================================ */

/** KPI card with a week-over-week delta and optional sparkline. */
export function TrendCard({
  label, value, delta, sub, spark, href, exact,
}: {
  label: string
  value: React.ReactNode
  delta?: number | null
  sub?: string
  spark?: number[]
  href?: string
  /** Full-precision figure shown under the compact headline. */
  exact?: string
}) {
  const up = (delta ?? 0) > 0
  const flat = delta === 0 || delta === null || delta === undefined
  const body = (
    <div className="ad-card" style={{ padding: 18, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--serif)', lineHeight: 1.1, overflowWrap: 'anywhere' }} title={exact}>{value}</div>
          {exact && (
            <div className="ad-soft" style={{ fontSize: 11.5, marginTop: 3, fontFamily: 'var(--mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exact}</div>
          )}
          <div className="ad-mut" style={{ fontSize: 13, marginTop: exact ? 4 : 2 }}>{label}</div>
        </div>
        {!flat && (
          <span
            style={{
              fontSize: 11.5, fontWeight: 700, padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap',
              background: up ? '#E7F3EC' : '#FCEEEF',
              color: up ? '#2F6B4F' : '#C8141B',
            }}
            title="Compared with the previous 7 days"
          >
            {up ? '▲' : '▼'} {Math.abs(delta as number)}%
          </span>
        )}
      </div>
      {spark && spark.length > 1 && <Sparkline data={spark} />}
      {sub && <div className="ad-soft" style={{ fontSize: 11.5, marginTop: 6 }}>{sub}</div>}
    </div>
  )
  return href ? <a href={href} style={{ display: 'block', height: '100%' }}>{body}</a> : body
}

/** Tiny inline trend line. */
export function Sparkline({ data, height = 34 }: { data: number[]; height?: number }) {
  if (data.length < 2) return null
  const max = Math.max(1, ...data)
  const w = 100
  const step = w / (data.length - 1)
  const pts = data.map((v, i) => `${(i * step).toFixed(2)},${(height - (v / max) * (height - 4) - 2).toFixed(2)}`)
  const area = `M0,${height} L${pts.join(' L')} L${w},${height} Z`
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none"
      style={{ width: '100%', height, marginTop: 10, display: 'block', overflow: 'visible' }}>
      <path d={area} fill="var(--brand)" opacity={0.1} />
      <polyline points={pts.join(' ')} fill="none" stroke="var(--brand)" strokeWidth="1.6"
        vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Interactive area chart with hover tooltip, used for the 30/90 day lead trend.
 */
export function AreaChart({
  data, height = 190, label = 'leads',
}: {
  data: { date: string; value: number }[]
  height?: number
  label?: string
}) {
  if (!data.length) return <Empty />
  const max = Math.max(1, ...data.map((d) => d.value))
  const w = 720
  const padL = 30, padB = 24, padT = 10
  const innerH = height - padB - padT
  const step = data.length > 1 ? (w - padL) / (data.length - 1) : 0
  const x = (i: number) => padL + i * step
  const y = (v: number) => padT + innerH - (v / max) * innerH

  const line = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' L')
  const area = `M${padL},${padT + innerH} L${line} L${x(data.length - 1)},${padT + innerH} Z`

  // y-axis ticks: 0, mid, max
  const ticks = [0, Math.round(max / 2), max].filter((v, i, a) => a.indexOf(v) === i)
  // x labels: roughly six evenly spaced
  const labelEvery = Math.max(1, Math.ceil(data.length / 6))

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', minWidth: 420, height: 'auto', display: 'block' }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={w} y1={y(t)} y2={y(t)} stroke="var(--rule, #E4DCC9)" strokeWidth="1" strokeDasharray="3 4" />
            <text x={padL - 6} y={y(t) + 3.5} textAnchor="end" style={{ fontSize: 9.5, fill: 'var(--ink-soft)' }}>{t}</text>
          </g>
        ))}

        <path d={area} fill="var(--brand)" opacity={0.12} />
        <path d={`M${line}`} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {data.map((d, i) => (
          <g key={d.date}>
            {/* invisible wide hit area so the tooltip is easy to trigger */}
            <rect x={x(i) - step / 2} y={padT} width={Math.max(step, 6)} height={innerH} fill="transparent">
              <title>{d.date}: {d.value} {label}</title>
            </rect>
            {d.value > 0 && <circle cx={x(i)} cy={y(d.value)} r="2.6" fill="var(--brand)" />}
            {i % labelEvery === 0 && (
              <text x={x(i)} y={height - 6} textAnchor="middle" style={{ fontSize: 9, fill: 'var(--ink-soft)' }}>
                {d.date.slice(5)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

/** Stacked horizontal bar showing share of a total, with a legend. */
export function ShareBar({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (!total) return <Empty />
  const rows = data.slice(0, 6)
  return (
    <div>
      <div style={{ display: 'flex', height: 26, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--rule, #E4DCC9)' }}>
        {rows.map((r, i) => (
          <div key={r.label}
            style={{ width: `${(r.value / total) * 100}%`, background: PALETTE[i % PALETTE.length] }}
            title={`${r.label}: ${r.value} (${Math.round((r.value / total) * 100)}%)`} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 12 }}>
        {rows.map((r, i) => (
          <span key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
            <i style={{ width: 10, height: 10, borderRadius: 3, background: PALETTE[i % PALETTE.length], display: 'inline-block' }} />
            {r.label}
            <b>{Math.round((r.value / total) * 100)}%</b>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Section wrapper so dashboard panels look consistent. */
export function Panel({
  title, subtitle, action, children,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="ad-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h3>
          {subtitle && <p className="ad-soft" style={{ fontSize: 12, marginTop: 2 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
