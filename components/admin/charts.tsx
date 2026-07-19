'use client'

/**
 * Dependency-free SVG charts in the Martek palette.
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

export function StatCard({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="ad-card" style={{ padding: 18 }}>
      <div style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--serif)' }}>{value}</div>
      <div className="ad-mut" style={{ fontSize: 13, marginTop: 2 }}>{label}</div>
      {sub && <div className="ad-soft" style={{ fontSize: 11.5, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Empty() {
  return <p className="ad-soft" style={{ fontSize: 13 }}>No data yet.</p>
}
