import Link from 'next/link'
import Image from 'next/image'
import { SOCIALS } from '@/lib/social'

export default function Footer() {
  return (
    <footer className="mk">
      <div className="wrap">
        <div className="grid">
          <div className="brand">
            <Link href="/" className="logo">
              <span className="logo-mark">
                <Image src="/assets/martek-mark.png" alt="Martek Group" width={40} height={40} />
              </span>
              <span className="logo-name">
                <b style={{ color: 'var(--paper)' }}>
                  Martek <span className="grp" style={{ color: 'var(--paper-3)' }}>Group</span>
                </b>
                <span style={{ color: 'var(--ink-soft)' }}>Digital studio</span>
              </span>
            </Link>
            <p>
              A small studio that ships big things for early-stage founders. Hand-built, mostly by humans, occasionally
              with help from a robot.
            </p>
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
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bottom">
          <span>© 2026 Martek Group. Made with care, not chatGPT.</span>
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
