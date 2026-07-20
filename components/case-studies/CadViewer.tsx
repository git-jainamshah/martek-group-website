'use client'

import { useState } from 'react'

/**
 * Illustrative CAD/CAM sketch for the engineering case study. A simplified
 * sample bracket - dimensions are made up to show how we'd document a part,
 * not a real drawing.
 */
const ACCENT = '#8B5A8C'

export default function CadViewer() {
  const [dims, setDims] = useState(true)
  const [wire, setWire] = useState(false)
  const [explode, setExplode] = useState(0) // 0..40

  const fill = wire ? 'none' : 'var(--paper-3)'
  const stroke = 'var(--ink)'
  const off = explode // vertical separation for the cover plate

  return (
    <div className="ix-wrap" style={{ ['--accent' as string]: ACCENT }}>
      <div className="ix-head">
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-mut)' }}>Interactive sketch</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22 }}>A sample mounting bracket</div>
        </div>
        <div className="ix-toggle-row">
          <button className={`ix-chip${dims ? ' on' : ''}`} onClick={() => setDims((v) => !v)}>Dimensions</button>
          <button className={`ix-chip${wire ? ' on' : ''}`} onClick={() => setWire((v) => !v)}>Wireframe</button>
        </div>
      </div>

      <div className="ix-cad">
        <svg viewBox="0 0 420 250" style={{ width: '100%', display: 'block' }} role="img" aria-label="Sample bracket drawing">
          {/* base plate */}
          <g transform={`translate(0, ${off / 2})`}>
            <rect x="70" y="150" width="280" height="60" rx="8" fill={fill} stroke={stroke} strokeWidth="1.6" />
            <line x1="210" y1="150" x2="210" y2="210" stroke="var(--ink-soft)" strokeWidth="0.8" strokeDasharray="5 4" />
          </g>

          {/* cover / bracket face (separates on explode) */}
          <g transform={`translate(0, ${-off})`}>
            <path d="M90 130 L330 130 Q345 130 345 115 L345 55 Q345 40 330 40 L90 40 Q75 40 75 55 L75 115 Q75 130 90 130 Z"
              fill={fill} stroke={stroke} strokeWidth="1.6" />
            {/* two mounting holes */}
            <circle cx="130" cy="85" r="15" fill={wire ? 'none' : 'var(--paper)'} stroke={stroke} strokeWidth="1.6" />
            <circle cx="130" cy="85" r="2.4" fill={stroke} />
            <circle cx="290" cy="85" r="15" fill={wire ? 'none' : 'var(--paper)'} stroke={stroke} strokeWidth="1.6" />
            <circle cx="290" cy="85" r="2.4" fill={stroke} />
            {/* center lines */}
            <line x1="130" y1="60" x2="130" y2="110" stroke="var(--ink-soft)" strokeWidth="0.8" strokeDasharray="5 4" />
            <line x1="105" y1="85" x2="155" y2="85" stroke="var(--ink-soft)" strokeWidth="0.8" strokeDasharray="5 4" />
            <line x1="290" y1="60" x2="290" y2="110" stroke="var(--ink-soft)" strokeWidth="0.8" strokeDasharray="5 4" />
            <line x1="265" y1="85" x2="315" y2="85" stroke="var(--ink-soft)" strokeWidth="0.8" strokeDasharray="5 4" />
          </g>

          {/* dimensions */}
          {dims && (
            <g fontFamily="var(--mono)" fontSize="10" fill="var(--ink)" transform={`translate(0, ${-off})`}>
              {/* width */}
              <line x1="75" y1="24" x2="345" y2="24" stroke={ACCENT} strokeWidth="1" />
              <line x1="75" y1="20" x2="75" y2="28" stroke={ACCENT} strokeWidth="1" />
              <line x1="345" y1="20" x2="345" y2="28" stroke={ACCENT} strokeWidth="1" />
              <rect x="192" y="16" width="36" height="15" fill="var(--paper)" />
              <text x="210" y="27" textAnchor="middle">120.0</text>
              {/* hole spacing */}
              <line x1="130" y1="128" x2="290" y2="128" stroke={ACCENT} strokeWidth="1" />
              <rect x="192" y="120.5" width="36" height="15" fill="var(--paper)" />
              <text x="210" y="132" textAnchor="middle">80.0</text>
              {/* hole dia */}
              <text x="130" y="85" dx="20" dy="-16" fill={ACCENT}>&#8709;12 H7</text>
            </g>
          )}
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mut)', whiteSpace: 'nowrap' }}>Exploded view</span>
        <input className="ix-slider" type="range" min={0} max={40} value={explode} onChange={(e) => setExplode(Number(e.target.value))} />
      </div>

      <p className="ix-note">
        Toggle dimensions and tolerances, switch to wireframe, or drag to explode the assembly. A sample part with
        invented dimensions - a real drawing would come from your actual geometry and tolerances.
      </p>
    </div>
  )
}
