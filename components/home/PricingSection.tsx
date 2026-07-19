import Link from 'next/link'
import { getPackageOverrides } from '@/lib/pricing'

// Styled headings stay design-owned; everything else is admin-managed.
const H3S: React.ReactNode[] = [
  <>One <span className="it">thing</span>, fast</>,
  <>Ship the <span className="it">whole thing</span></>,
  <>Your <span className="it">fractional</span> team</>,
]
const VARIANTS = ['c-starter', 'c-growth', 'c-scale']

export default async function PricingSection() {
  const cards = await getPackageOverrides('home')

  return (
    <section className="price" id="pricing">
      <div className="wrap">
        <div className="price-head" data-reveal>
          <div>
            <span className="kicker">Pricing</span>
            <h2 style={{ marginTop: 14 }}>
              Three ways
              <br />
              to <span className="it">start small</span>.
            </h2>
          </div>
          <div className="note">
            <b>No sales calls required.</b> Pick a starting point, tell us about the project, and we&apos;ll send a
            1-page proposal in 3 working days. Custom scopes welcome.
          </div>
        </div>

        <div className="cards" data-reveal-stagger>
          {cards.map((c, i) => (
            <div key={c.idx} className={`card ${VARIANTS[i] ?? 'c-starter'}${c.featured ? ' featured' : ''}`}>
              {c.featured && c.tag && <div className="tag">{c.tag}</div>}
              <div className="pname">
                <span className="dot"></span>
                <b>{c.name}</b>
              </div>
              <h3>{H3S[i] ?? c.name}</h3>
              <p className="desc">{c.description}</p>
              <div className="price-line">
                {c.price} {c.priceNote && <small>{c.priceNote}</small>}
              </div>
              {c.billing && <div className="billing">{c.billing}</div>}
              <ul>
                {(c.items ?? []).map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
              <Link href="/contact" className="cta">
                {c.ctaLabel ?? 'Get started →'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
