'use client'

import { useState } from 'react'

export interface FaqItem {
  q: string
  a: string
}

/** FAQ accordion — one item open at a time, first open by default (ported from site.js). */
export default function FaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="faq-list" data-reveal>
      {items.map((item, i) => (
        <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
          <div className="q" onClick={() => setOpen(open === i ? -1 : i)}>
            <h4>{item.q}</h4>
            <span className="plus">+</span>
          </div>
          <div className="a">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
