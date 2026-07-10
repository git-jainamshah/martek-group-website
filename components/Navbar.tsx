'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const ArrowSvg = ({ strokeWidth = 1.6, className }: { strokeWidth?: number; className?: string }) => (
  <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
    <path d="M3 11 L11 3 M5 3 H11 V9" />
  </svg>
)

const navLinks = [
  { label: 'Web', href: '/services/web-development' },
  { label: 'Data', href: '/services/data-analytics' },
  { label: 'Social', href: '/services/social' },
  { label: 'SEO & Ads', href: '/services/seo-ads' },
  { label: 'Engineering', href: '/services/engineering' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const close = useCallback(() => setIsOpen(false), [])

  // body.m-open drives the drawer/backdrop/hamburger CSS (ported from site.js)
  useEffect(() => {
    document.body.classList.toggle('m-open', isOpen)
    return () => {
      document.body.classList.remove('m-open')
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const onResize = () => {
      if (window.innerWidth > 980) close()
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [close])

  // close the drawer on route change
  useEffect(() => {
    close()
  }, [pathname, close])

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* announcement bar */}
      <div className="bar">
        <div className="wrap">
          <div className="row">
            <span className="pill">New</span>
            <span>
              We just launched a <b>fixed-price startup sprint</b>: a landing page in 14 days.
            </span>
            <Link href="/#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--paper)' }}>
              See sprint pricing <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* nav */}
      <nav className="main">
        <div className="wrap">
          <div className="row">
            <Link href="/" className="logo">
              <span className="logo-mark">
                <Image src="/assets/martek-mark.png" alt="Martek Group" width={40} height={40} priority />
              </span>
              <span className="logo-name">
                <b>
                  Martek <span className="grp">Group</span>
                </b>
                <span>Digital studio</span>
              </span>
            </Link>

            <div className="nav-links">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className={isActive(l.href) ? 'active' : undefined}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="nav-cta">
              <Link href="/#pricing" className="btn btn-ghost">
                Pricing
              </Link>
              <Link href="/contact" className="btn btn-primary">
                Book a call
                <ArrowSvg className="arr-svg" />
              </Link>
              <button
                className="nav-toggle"
                type="button"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((v) => !v)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* mobile drawer */}
      <div className="m-backdrop" onClick={close} aria-hidden="true"></div>
      <aside className="m-nav" aria-hidden={!isOpen} aria-label="Site menu">
        <div className="dotline"></div>
        <div className="m-nav-top">
          <span className="m-brand">
            <span className="lm">
              <Image src="/assets/martek-mark.png" alt="Martek Group" width={34} height={34} />
            </span>
            <span className="bt">Menu</span>
          </span>
          <button className="m-close" type="button" aria-label="Close menu" onClick={close}>
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4 L14 14 M14 4 L4 14" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="m-links">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={isActive(l.href) ? 'active' : undefined} onClick={close}>
              <span>{l.label}</span>
              <span className="ar">
                <ArrowSvg strokeWidth={1.7} />
              </span>
            </Link>
          ))}
          <Link href="/#pricing" onClick={close}>
            <span>Pricing</span>
            <span className="ar">
              <ArrowSvg strokeWidth={1.7} />
            </span>
          </Link>
        </nav>
        <div className="m-foot">
          <Link href="/contact" className="btn btn-primary" onClick={close}>
            Book a call <ArrowSvg strokeWidth={1.7} className="arr-svg" />
          </Link>
          <p className="m-mail">
            or email <a href="mailto:hello@martek.studio">hello@martek.studio</a>
          </p>
        </div>
      </aside>
    </>
  )
}
