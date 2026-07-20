'use client'

import { useState } from 'react'

/**
 * Illustrative before/after for the web case study. All numbers are invented
 * to show the *kind* of shift we'd aim for - not a measured result.
 */
const DATA = {
  before: {
    bars: [
      { k: 'Page load (mobile)', v: 4.6, unit: 's', pct: 100, good: false },
      { k: 'Visitors who bounce', v: 68, unit: '%', pct: 68, good: false },
      { k: 'Enquiries / month', v: 12, unit: '', pct: 30, good: true },
    ],
  },
  after: {
    bars: [
      { k: 'Page load (mobile)', v: 1.8, unit: 's', pct: 39, good: true },
      { k: 'Visitors who bounce', v: 41, unit: '%', pct: 41, good: true },
      { k: 'Enquiries / month', v: 28, unit: '', pct: 72, good: true },
    ],
  },
}

export default function WebBeforeAfter() {
  const [mode, setMode] = useState<'before' | 'after'>('after')
  const after = mode === 'after'
  const bars = DATA[mode].bars

  return (
    <div className="ix-wrap" style={{ ['--accent' as string]: '#E07A5F' }}>
      <div className="ix-head">
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-mut)' }}>Interactive sketch</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22 }}>Current site vs. a reimagined one</div>
        </div>
        <div className="ix-seg" role="tablist">
          <button className={!after ? 'on' : ''} onClick={() => setMode('before')}>Current</button>
          <button className={after ? 'on' : ''} onClick={() => setMode('after')}>Reimagined</button>
        </div>
      </div>

      <div className="ix-grid2">
        {/* mock preview */}
        <div className="ix-mock" aria-hidden="true">
          <div className="mbar"><i /><i /><i /></div>
          {after ? (
            <div className="mbody" style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
              <div className="ln" style={{ width: '80%', height: 13, background: 'var(--ink)' }} />
              <div className="ln" style={{ width: '55%' }} />
              <div className="cta" style={{ marginTop: 8 }} />
            </div>
          ) : (
            <div className="mbody">
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="ln" style={{ width: '30%' }} /><div className="ln" style={{ width: '22%' }} /><div className="ln" style={{ width: '26%' }} />
              </div>
              <div className="blk" style={{ height: 34 }} />
              <div className="ln" style={{ width: '92%' }} /><div className="ln" style={{ width: '85%' }} /><div className="ln" style={{ width: '88%' }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="blk" style={{ height: 26, flex: 1 }} /><div className="blk" style={{ height: 26, flex: 1 }} /><div className="blk" style={{ height: 26, flex: 1 }} />
              </div>
            </div>
          )}
        </div>

        {/* comparison bars */}
        <div className="ix-bars">
          {bars.map((b) => (
            <div className="ix-bar" key={b.k}>
              <div className="lab"><span>{b.k}</span><b>{b.v}{b.unit}</b></div>
              <div className="track"><div className="fill" style={{ width: `${b.pct}%`, background: after ? '#6B9080' : '#C86A54' }} /></div>
            </div>
          ))}
        </div>
      </div>

      <p className="ix-note">
        Toggle between a cluttered, slow page and a focused, fast one. The figures are invented for illustration -
        a real project would start from your actual analytics, and the plan would be yours, not this one.
      </p>
    </div>
  )
}
