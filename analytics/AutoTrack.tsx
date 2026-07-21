'use client'

/**
 * =====================================================================
 * MARRELAY ANALYTICS - AUTOTRACK
 * =====================================================================
 * Mounts once (in LayoutWrapper) and drives the "ambient" events:
 *   - page_view          on every SPA route change (+ first load)
 *   - scroll_depth       25 / 50 / 75 / 90 % (once each per page)
 *   - engaged_visit      GA4-style: >=10s active OR >=2 pageviews
 *   - navigation_click / cta_click / outbound_click / social_click / menu_open
 * Click tracking is delegated (one listener) and classifies elements by
 * data-dl-* attributes first, then sensible DOM heuristics.
 * =====================================================================
 */

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import {
  trackPageView, trackScrollDepth, trackEngagedVisit,
  trackNav, trackCta, trackLinkClick, trackSocial, trackMenuOpen,
} from './events'

const SCROLL_MARKS = [25, 50, 75, 90]

export default function AutoTrack() {
  const pathname = usePathname()
  const pvCount = useRef(0)
  const engagedFired = useRef(false)
  const scrollHit = useRef<Set<number>>(new Set())

  /* ---- page_view on every route change ---- */
  useEffect(() => {
    pvCount.current += 1
    // reset per-page scroll marks
    scrollHit.current = new Set()
    // let the title settle after navigation
    const t = setTimeout(() => trackPageView({ page_view_number: pvCount.current }), 30)

    // engaged after 2nd pageview
    if (pvCount.current >= 2 && !engagedFired.current) {
      engagedFired.current = true
      trackEngagedVisit('multi_page', undefined)
    }
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  /* ---- engaged after 10s of active time ---- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!engagedFired.current) {
        engagedFired.current = true
        trackEngagedVisit('time_10s', 10000)
      }
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  /* ---- scroll depth ---- */
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const doc = document.documentElement
        const scrollable = doc.scrollHeight - window.innerHeight
        const pct = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 100
        for (const m of SCROLL_MARKS) {
          if (pct >= m && !scrollHit.current.has(m)) {
            scrollHit.current.add(m)
            trackScrollDepth(m)
          }
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ---- delegated click tracking ---- */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target || !target.closest) return

      // explicit opt-in via data attributes wins
      const tagged = target.closest('[data-dl-event]') as HTMLElement | null
      if (tagged) {
        const ev = tagged.getAttribute('data-dl-event')
        if (ev === 'social_click') { trackSocial(tagged.getAttribute('data-dl-platform') || label(tagged)); return }
        if (ev === 'menu_open') { trackMenuOpen(tagged.getAttribute('data-dl-menu') || label(tagged)); return }
        if (ev === 'cta_click') {
          trackCta({ text: label(tagged), destination: hrefOf(tagged), location: tagged.getAttribute('data-dl-location') || region(tagged), type: 'button' })
          return
        }
      }

      const a = target.closest('a[href]') as HTMLAnchorElement | null
      const btn = target.closest('button, [role="button"]') as HTMLElement | null

      if (a) {
        const href = a.getAttribute('href') || ''
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return
        const inHeader = !!a.closest('header, nav')
        const inFooter = !!a.closest('footer')
        const isSocial = /facebook|instagram|linkedin|twitter|x\.com|tiktok|youtube|pinterest/i.test(href) && inFooter
        const outbound = isOutbound(href)

        if (isSocial) { trackSocial(platformFromHref(href) || label(a)); return }
        if (inHeader) { trackNav({ label: label(a), url: href, group: a.closest('.nav-drop') ? navGroup(a) : '', location: 'header' }); return }
        if (a.classList.contains('btn')) { trackCta({ text: label(a), destination: href, location: region(a), type: 'link' }); return }
        trackLinkClick({ url: href, text: label(a), domain: domainOf(href), outbound })
        return
      }

      if (btn && (btn.classList.contains('btn') || btn.getAttribute('type') === 'submit')) {
        trackCta({ text: label(btn), destination: hrefOf(btn), location: region(btn), type: 'button' })
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}

/* ---------------- helpers ---------------- */
function label(el: HTMLElement) {
  return (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
}
function hrefOf(el: HTMLElement) {
  const a = el.closest('a[href]') as HTMLAnchorElement | null
  return a ? a.getAttribute('href') || '' : ''
}
function region(el: HTMLElement) {
  if (el.closest('header, nav')) return 'header'
  if (el.closest('footer')) return 'footer'
  if (el.closest('.svc-hero, .cs-hero-grid')) return 'hero'
  if (el.closest('form')) return 'form'
  return 'body'
}
function navGroup(el: HTMLElement) {
  const drop = el.closest('.nav-drop') as HTMLElement | null
  const btn = drop?.querySelector('.nav-drop-btn')
  return btn ? (btn.textContent || '').trim() : ''
}
function domainOf(href: string) {
  try { return new URL(href, window.location.href).hostname } catch { return '' }
}
function isOutbound(href: string) {
  try { return new URL(href, window.location.href).hostname !== window.location.hostname } catch { return false }
}
function platformFromHref(href: string) {
  const m = href.match(/(facebook|instagram|linkedin|twitter|tiktok|youtube|pinterest)/i)
  return m ? m[1].toLowerCase() : (href.includes('x.com') ? 'x' : '')
}
