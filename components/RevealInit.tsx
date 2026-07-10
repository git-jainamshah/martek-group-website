'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Global scroll-reveal (ported from site.js).
 * Observes [data-reveal] / [data-reveal-stagger] elements and adds `.in`
 * when they enter the viewport. Re-runs on route change.
 */
export default function RevealInit() {
  const pathname = usePathname()

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal], [data-reveal-stagger]'))
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((el) => {
      if (!el.classList.contains('in')) io.observe(el)
    })
    return () => io.disconnect()
  }, [pathname])

  return null
}
