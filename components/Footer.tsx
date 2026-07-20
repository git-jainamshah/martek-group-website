'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { SOCIALS } from '@/lib/social'

type Company = {
  name: string; tagline: string; addressLine1: string; addressLine2: string
  email: string; phone: string; logoIcon: string
}
type Social = { platform: string; href: string }

const COMPANY_FALLBACK: Company = {
  name: 'Marrelay', tagline: 'Digital studio', addressLine1: '', addressLine2: '',
  email: '', phone: '', logoIcon: '/assets/martek-mark.png',
}

export default function Footer() {
  const [company, setCompany] = useState<Company>(COMPANY_FALLBACK)
  const [socials, setSocials] = useState<Social[]>(SOCIALS.map((s) => ({ platform: s.name, href: s.href })))

  useEffect(() => {
    fetch('/api/public/site-config')
      .then((r) => r.json())
      .then((d) => {
        if (d.company?.name) setCompany({ ...COMPANY_FALLBACK, ...d.company })
        if (Array.isArray(d.socials)) setSocials(d.socials)
      })
      .catch(() => {})
  }, [])

  const first = company.name.split(' ')[0]
  const rest = company.name.split(' ').slice(1).join(' ')

  return (
    <footer className="mk">
      <div className="wrap">
        <div className="grid">
          <div className="brand">
            <Link href="/" className="logo">
              <span className="logo-mark">
                <Image src={company.logoIcon || '/assets/martek-mark.png'} alt={company.name} width={40} height={40} />
              </span>
              <span className="logo-name">
                <b style={{ color: 'var(--paper)' }}>
                  {first} {rest && <span className="grp" style={{ color: 'var(--paper-3)' }}>{rest}</span>}
                </b>
                <span style={{ color: 'var(--ink-soft)' }}>{company.tagline}</span>
              </span>
            </Link>
            <p>
              A small studio that ships big things for early-stage founders. Hand-built, mostly by humans, occasionally
              with help from a robot.
            </p>
            {(company.email || company.phone || company.addressLine1) && (
              <p style={{ marginTop: 10 }}>
                {company.addressLine1}{company.addressLine2 ? `, ${company.addressLine2}` : ''}
                {company.email && (
                  <>
                    <br />
                    <a href={`mailto:${company.email}`}>{company.email}</a>
                  </>
                )}
                {company.phone && (
                  <>
                    <br />
                    <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</a>
                  </>
                )}
              </p>
            )}
          </div>
          <div>
            <h5>Services</h5>
            <ul>
              <li>
                <Link href="/services/web-development">Web development</Link>
              </li>
              <li>
                <Link href="/services/data-analytics">Data &amp; analytics</Link>
              </li>
              <li>
                <Link href="/services/social">Social</Link>
              </li>
              <li>
                <Link href="/services/seo-ads">SEO &amp; ads</Link>
              </li>
              <li>
                <Link href="/services/engineering">Engineering &amp; CAD</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Studio</h5>
            <ul>
              <li>
                <Link href="/#how">How we work</Link>
              </li>
              <li>
                <Link href="/#pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/#work">Work</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Elsewhere</h5>
            <ul>
              {socials.map((s) => (
                <li key={s.platform}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bottom">
          <span>© {new Date().getFullYear()} {company.name}. Made with care, not by Robot.</span>
          <span>
            <Link href="/privacy" style={{ color: 'var(--ink-soft)' }}>
              Privacy
            </Link>{' '}
            ·{' '}
            <Link href="/terms" style={{ color: 'var(--ink-soft)' }}>
              Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
