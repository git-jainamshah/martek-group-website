import Link from 'next/link'

export default function PricingSection() {
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
          <div className="card c-starter">
            <div className="pname">
              <span className="dot"></span>
              <b>Sprint</b>
            </div>
            <h3>
              One <span className="it">thing</span>, fast
            </h3>
            <p className="desc">A landing page, an audit, a campaign. Fixed price, fixed scope, fixed timeline.</p>
            <div className="price-line">
              $2,400 <small>flat</small>
            </div>
            <div className="billing">14-day delivery</div>
            <ul>
              <li>1 deliverable, scoped up front</li>
              <li>Daily Slack updates</li>
              <li>2 rounds of feedback</li>
              <li>14-day post-launch fixes</li>
            </ul>
            <Link href="/contact" className="cta">
              Start a sprint →
            </Link>
          </div>

          <div className="card c-growth featured">
            <div className="tag">Best value</div>
            <div className="pname">
              <span className="dot"></span>
              <b>Build</b>
            </div>
            <h3>
              Ship the <span className="it">whole thing</span>
            </h3>
            <p className="desc">Site + brand + analytics + launch: your full launch kit, end to end.</p>
            <div className="price-line">
              $8,400 <small>from</small>
            </div>
            <div className="billing">4–6 week delivery</div>
            <ul>
              <li>Brand &amp; site, end to end</li>
              <li>Analytics &amp; tracking set up</li>
              <li>Launch campaign included</li>
              <li>Weekly Friday demos</li>
              <li>30-day post-launch support</li>
            </ul>
            <Link href="/contact" className="cta">
              Book a build →
            </Link>
          </div>

          <div className="card c-scale">
            <div className="pname">
              <span className="dot"></span>
              <b>Retainer</b>
            </div>
            <h3>
              Your <span className="it">fractional</span> team
            </h3>
            <p className="desc">A small slice of a full team, every month. Design, dev, growth, on tap.</p>
            <div className="price-line">
              $3,800 <small>/mo</small>
            </div>
            <div className="billing">3-month minimum</div>
            <ul>
              <li>40 hours / month, any service</li>
              <li>Slack channel, your own PM</li>
              <li>Weekly priorities call</li>
              <li>Pause or cancel anytime</li>
            </ul>
            <Link href="/contact" className="cta">
              Talk retainer →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
