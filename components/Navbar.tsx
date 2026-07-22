'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import SocialLinks from './SocialLinks'
import SiteSearch from './SiteSearch'

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
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Contact Us', href: '/contact' },
]

const serviceLinks = [
  { label: 'Web Development', href: '/services/web-development' },
  { label: 'Data & Analytics', href: '/services/data-analytics' },
  { label: 'Social', href: '/services/social' },
  { label: 'SEO & Ads', href: '/services/seo-ads' },
  { label: 'Engineering & CAD', href: '/services/engineering' },
]

const caseStudyLinks = [
  { label: 'All Case Studies', href: '/case-studies' },
  { label: 'Web Development', href: '/projects/web-development' },
  { label: 'Data & Analytics', href: '/projects/analytics-tagging' },
  { label: 'Engineering & CAD', href: '/projects/engineering-drawings' },
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
        Currently taking on <b>new projects</b> - we keep slots limited to stay hands-on.
      </>
    ),
    ctaLabel: 'Grab a slot',
    ctaHref: '/contact#form',
    contactHref: '/contact#form',
  },
}

/* Admin-managed bar copy: **bold** segments render as <b> */
type BarCfg = { pill: string; text: string; ctaLabel: string; ctaHref: string; contactHref: string }
type AnnouncementCfg = { default: BarCfg; overrides: (BarCfg & { path: string })[] }

const renderBold = (s: string) =>
  s.split('**').map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>))

type CompanyCfg = { name: string; tagline: string; logoIcon: string }
type SocialCfg = { platform: string; label: string; href: string }

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [announcement, setAnnouncement] = useState<AnnouncementCfg | null>(null)
  const [company, setCompany] = useState<CompanyCfg | null>(null)
  const [socials, setSocials] = useState<SocialCfg[] | null>(null)
  const pathname = usePathname()

  // Pull admin-managed config; hardcoded copy stays as SSR fallback
  useEffect(() => {
    fetch('/api/public/site-config')
      .then((r) => r.json())
      .then((d) => {
        if (d.announcement?.default) setAnnouncement(d.announcement)
        if (d.company?.name) setCompany(d.company)
        if (Array.isArray(d.socials)) setSocials(d.socials)
      })
      .catch(() => {})
  }, [])

  const brandName = company?.name || 'Marrelay'
  const brandFirst = brandName.split(' ')[0]
  const brandRest = brandName.split(' ').slice(1).join(' ')

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
  const fallbackBar = (pathname && barByPath[pathname]) || defaultBar
  const managed = announcement
    ? announcement.overrides?.find((o) => o.path === pathname) || announcement.default
    : null
  const bar = managed
    ? { ...managed, text: renderBold(managed.text) as React.ReactNode }
    : fallbackBar

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
                <Image src={company?.logoIcon || '/assets/martek-mark.png'} alt={brandName} width={40} height={40} priority />
              </span>
              <span className="logo-name">
                <b>
                  {brandFirst} {brandRest && <span className="grp">{brandRest}</span>}
                </b>
                <span>{company?.tagline || 'Digital studio'}</span>
              </span>
            </Link>

            <div className="nav-links">
              <Link href="/" className={isActive('/') ? 'active' : undefined} aria-label="Home" title="Home">
                <HomeIcon />
              </Link>
              <Link href="/about" className={isActive('/about') ? 'active' : undefined}>
                About Us
              </Link>
              <div className="nav-drop">
                <button
                  type="button"
                  className={`nav-drop-btn${pathname?.startsWith('/services') ? ' active' : ''}`}
                  aria-haspopup="true"
                >
                  Services
                  <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M1 1 L5 5 L9 1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="nav-drop-panel" role="menu">
                  {serviceLinks.map((s) => (
                    <Link key={s.href} href={s.href} role="menuitem"
                      className={isActive(s.href) ? 'active' : undefined}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="nav-drop">
                <button
                  type="button"
                  className={`nav-drop-btn${pathname?.startsWith('/case-studies') || pathname?.startsWith('/projects') ? ' active' : ''}`}
                  aria-haspopup="true"
                >
                  Case Studies
                  <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M1 1 L5 5 L9 1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="nav-drop-panel" role="menu">
                  {caseStudyLinks.map((s) => (
                    <Link key={s.href} href={s.href} role="menuitem"
                      className={isActive(s.href) ? 'active' : undefined}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/contact" className={isActive('/contact') ? 'active' : undefined}>
                Contact Us
              </Link>
            </div>

            <div className="nav-cta">
              <SiteSearch />
              <SocialLinks variant="nav" socials={socials ?? undefined} />
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
              <Image src="/assets/martek-mark.png" alt="Marrelay" width={34} height={34} />
            </span>
            <span className="bt">Menu</span>
          </span>
          <button className="m-close" type="button" aria-label="Close menu" onClick={close}>
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4 L14 14 M14 4 L4 14" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          className="m-search"
          onClick={() => { close(); setTimeout(() => window.dispatchEvent(new Event('open-site-search')), 60) }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
            Search the site
          </span>
        </button>
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
          <SocialLinks variant="drawer" socials={socials ?? undefined} />
          <p className="m-mail">
            or email <a href="mailto:hello@marrelay.com">hello@marrelay.com</a>
          </p>
        </div>
      </aside>
    </>
  )
}
