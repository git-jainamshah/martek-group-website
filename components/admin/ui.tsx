'use client'

import { useState } from 'react'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'

/** Password input with show/hide eye toggle. */
export function PasswordInput(props: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  required?: boolean
  minLength?: number
}) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        className="ad-input"
        style={{ paddingRight: 42 }}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        required={props.required}
        minLength={props.minLength}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
        onClick={() => setShow(!show)}
        style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--ink-mut)', display: 'flex', padding: 4,
        }}
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  )
}

/** Collapsible section card. */
export function Section({
  title, kicker, subtitle, defaultOpen = true, right, children,
}: {
  title: React.ReactNode
  kicker?: string
  subtitle?: React.ReactNode
  defaultOpen?: boolean
  right?: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="ad-section">
      <button type="button" className="ad-section-head" onClick={() => setOpen(!open)}>
        <div>
          {kicker && <div className="ad-kicker" style={{ marginBottom: 4 }}>{kicker}</div>}
          <h2>{title}</h2>
          {subtitle && <div className="ad-mut" style={{ fontSize: 13, marginTop: 3 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {right && <span onClick={(e) => e.stopPropagation()}>{right}</span>}
          <ChevronDown size={18} className={`ad-chevron ${open ? 'open' : ''}`} />
        </div>
      </button>
      {open && <div className="ad-section-body">{children}</div>}
    </div>
  )
}

/** Switch toggle. */
export function Toggle({ checked, onChange, ariaLabel }: { checked: boolean; onChange: (v: boolean) => void; ariaLabel?: string }) {
  return (
    <label className="ad-switch">
      <input type="checkbox" checked={checked} aria-label={ariaLabel} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  )
}

/** Modal wrapper. */
export function Modal({ onClose, wide, children }: { onClose?: () => void; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className="ad-overlay" onClick={onClose}>
      <div className={`ad-modal ${wide ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

/** Labeled field wrapper. */
export function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div style={span2 ? { gridColumn: 'span 2' } : undefined}>
      <label className="ad-label">{label}</label>
      {children}
    </div>
  )
}
