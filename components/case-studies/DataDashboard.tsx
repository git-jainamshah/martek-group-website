'use client'

import { useState } from 'react'

/**
 * Illustrative mini-dashboard for the data case study. Sample data only -
 * a way to show the kind of clarity clean tracking gives, not real figures.
 */
const CHANNELS = [
  { k: 'Organic', sessions: 4200, conversions: 92 },
  { k: 'Paid', sessions: 3100, conversions: 74 },
  { k: 'Direct', sessions: 2400, conversions: 48 },
  { k: 'Social', sessions: 1800, conversions: 26 },
  { k: 'Email', sessions: 900, conversions: 31 },
]
const ACCENT = '#6B9080'

export default function DataDashboard() {
  const [metric, setMetric] = useState<'sessions' | 'conversions'>('sessions')
  const [active, setActive] = useState<string | null>(null)
  const vals = CHANNELS.map((c) => c[metric])
  const max = Math.max(...vals)
  const total = vals.reduce((a, b) => a + b, 0)
  const top = CHANNELS.reduce((a, b) => (b[metric] > a[metric] ? b : a))

  const W = 420, H = 190, pad = 28, bw = 46, gap = (W - pad * 2 - bw * CHANNELS.length) / (CHANNELS.length - 1)

  return (
    <div className="ix-wrap" style={{ ['--accent' as string]: ACCENT }}>
      <div className="ix-head">
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-mut)' }}>Interactive sketch</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22 }}>A dashboard you&apos;d actually open</div>
        </div>
        <div className="ix-seg">
          <button className={metric === 'sessions' ? 'on' : ''} onClick={() => setMetric('sessions')}>Sessions</button>
          <button className={metric === 'conversions' ? 'on' : ''} onClick={() => setMetric('conversions')}>Conversions</button>
        </div>
      </div>

      <div className="ix-kpis">
        <div className="ix-kpi"><div className="v">{total.toLocaleString()}</div><div className="k">Total {metric}</div></div>
        <div className="ix-kpi"><div className="v">{top.k}</div><div className="k">Top channel</div></div>
        <div className="ix-kpi"><div className="v">{active ?? '-'}</div><div className="k">Selected</div></div>
      </div>

      <svg className="ix-chart" viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', marginTop: 12 }} role="img" aria-label={`${metric} by channel`}>
        <line x1={pad} y1={H - 26} x2={W - pad} y2={H - 26} stroke="var(--rule-strong)" strokeWidth="1" />
        {CHANNELS.map((c, i) => {
          const v = c[metric]
          const bh = Math.round(((H - 60) * v) / max)
          const x = pad + i * (bw + gap)
          const y = H - 26 - bh
          const on = active === c.k
          return (
            <g key={c.k} className="barwrap" onClick={() => setActive(on ? null : c.k)} style={{ cursor: 'pointer' }}>
              <rect className="bar" x={x} y={y} width={bw} height={bh} rx="4"
                fill={on ? 'var(--ink)' : ACCENT} opacity={active && !on ? 0.4 : 1} />
              <text x={x + bw / 2} y={y - 6} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--ink)">{v.toLocaleString()}</text>
              <text x={x + bw / 2} y={H - 10} textAnchor="middle" fontFamily="var(--mono)" fontSize="10.5" fill="var(--ink-mut)">{c.k}</text>
            </g>
          )
        })}
      </svg>

      <p className="ix-note">
        Switch the metric, tap a bar to focus a channel. Sample numbers only - the point is that once tracking is clean,
        you can finally see which channels earn and which just spend.
      </p>
    </div>
  )
}
