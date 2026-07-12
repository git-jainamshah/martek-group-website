'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import SocialLinks from './SocialLinks'

const ArrowSvg = ({ strokeWidth = 1.6, className }: { strokeWidth?: number; className?: string }) => (
  <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
    <path d="M3 11 L11 3 M5 3 H11 V9" />
  </svg>
)

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 11 L12 4 L20 11 V20 H14.5 V14.5 H9.5 V20 H4 Z" strokeLinejoin="round" />
  </svg>
)

const navLinks = [
  { label: 'Home', href: '/', homeIcon: true },
  { label: 'About Us', href: '/about' },
  { label: 'Web', href: '/services/web-development' },
  { label: 'Data', href: '/services/data-analytics' },
  { label: 'Social', href: '/services/social' },
  { label: 'SEO & Ads', href: '/services/seo-ads' },
  { label: 'Engineering', href: '/services/engineering' },
]

/* per-page announcement bar + contact link (ported from each reference page) */
const defaultBar = {
  pill: 'New',
  text: (
    <>
      We just launched a <b>fixed-price startup sprint</b>: a landing page in 14 days.
    </>
  ),
  ctaLabel: 'See sprint pricing',
  ctaHref: '/#pricing',
  contactHref: '/contact',
}

const barByPath: Record<string, typeof defaultBar> = {
  '/services/web-development': {
    pill: 'Web',
    text: (
      <>
        Most launch sites go live in <b>4–6 weeks</b>. Landing-page sprints in 14 days.
      </>
    ),
    ctaLabel: 'Start yours',
    ctaHref: '/contact?service=web',
    contactHref: '/contact?service=web',
  },
  '/services/data-analytics': {
    pill: 'Data',
    text: (
      <>
        Most teams get a <b>clean dashboard + weekly report</b> within two weeks of kickoff.
      </>
    ),
    ctaLabel: 'Get set up',
    ctaHref: '/contact?service=data',
    contactHref: '/contact?service=data',
  },
  '/services/social': {
    pill: 'Social',
    text: (
      <>
        We become your <b>in-house content team</b>, strategy, posts, replies, and creator deals.
      </>
    ),
    ctaLabel: "Let's talk",
    ctaHref: '/contact?service=social',
    contactHref: '/contact?service=social',
  },
  '/services/seo-ads': {
    pill: 'SEO & Ads',
    text: (
      <>
        We move your <b>cost-per-acquisition down</b>, week by week, with receipts.
      </>
    ),
    ctaLabel: 'Get a plan',
    ctaHref: '/contact?service=seo',
    contactHref: '/contact?service=seo',
  },
  '/services/engineering': {
    pill: 'Engineering',
    text: (
      <>
        The side of the studio we built <b>first</b>, 4 years of CAD, drafting &amp; 3D modelling.
      </>
    ),
    ctaLabel: 'Send a brief',
    ctaHref: '/contact?service=engineering',
    contactHref: '/contact?service=engineering',
  },
  '/contact': {
    pill: 'Open',
    text: (
      <>
        Currently taking on <b>new projects</b> — we keep slots limited to stay hands-on.
      </>
    ),
    ctaLabel: 'Grab a slot',
    ctaHref: '/contact#form',
    contactHref: '/contact#form',
  },
}

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
  const bar = (pathname && barByPath[pathname]) || defaultBar

  return (
    <>
      {/* announcement bar */}
      <div className="bar">
        <div className="wrap">
          <div className="row">
            <span className="pill">{bar.pill}</span>
            <span className="bar-text">{bar.text}</span>
            <Link href={bar.ctaHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--paper)' }}>
              {bar.ctaLabel} <span className="arr">→</span>
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
                <Link
                  key={l.href}
                  href={l.href}
                  className={isActive(l.href) ? 'active' : undefined}
                  aria-label={l.homeIcon ? l.label : undefined}
                  title={l.homeIcon ? l.label : undefined}
                >
                  {l.homeIcon ? <HomeIcon /> : l.label}
                </Link>
              ))}
            </div>

            <div className="nav-cta">
              <SocialLinks variant="nav" />
              <Link href="/#pricing" className="btn btn-ghost">
                Pricing
              </Link>
              <Link href={bar.contactHref} className="btn btn-primary">
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
          <Link href={bar.contactHref} className="btn btn-primary" onClick={close}>
            Book a call <ArrowSvg strokeWidth={1.7} className="arr-svg" />
          </Link>
          <SocialLinks variant="drawer" />
          <p className="m-mail">
            or email <a href="mailto:hello@martek.studio">hello@martek.studio</a>
          </p>
        </div>
      </aside>
    </>
  )
}
