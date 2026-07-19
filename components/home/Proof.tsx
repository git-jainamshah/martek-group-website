/* eslint-disable @next/next/no-img-element */
export default function Proof({ imageSrc = '/assets/office-dark-hero.png' }: { imageSrc?: string } = {}) {
  return (
    <section className="proof" id="work">
      <div className="wrap">
        <div className="proof-grid">
          <div data-reveal>
            <span className="kicker">Why work with us</span>
            <h2 style={{ marginTop: 14 }}>
              Built by <span className="hl">founders</span>
              <br />
              <span className="it">for founders</span>.
            </h2>
            <p className="lede">
              We started Martek because every agency we&apos;d dealt with charged like a multinational and showed up
              like a junior. When you work with us, you talk directly to the people doing the work - no account
              managers, no handoffs, no surprise invoices.
            </p>

            <div className="numbers">
              <div className="n">
                <div className="v">
                  100<sup>%</sup>
                </div>
                <div className="k">
                  you own the code,
                  <br />
                  files &amp; accounts
                </div>
              </div>
              <div className="n">
                <div className="v">
                  3<sup>days</sup>
                </div>
                <div className="k">
                  to a one-page
                  <br />
                  fixed-price proposal
                </div>
              </div>
              <div className="n">
                <div className="v">
                  0<sup>+</sup>
                </div>
                <div className="k">
                  lock-in contracts -
                  <br />
                  pause or cancel anytime
                </div>
              </div>
            </div>

            <div className="media-frame" style={{ marginTop: 32, aspectRatio: '16/9' }}>
              <span className="img-slot" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                <img src={imageSrc} alt="Martek Group at work" />
              </span>
              <span className="media-tag">built in Toronto ✷</span>
            </div>
          </div>

          <div className="quote-card" data-reveal>
            <span className="qmark">✦</span>
            <div className="stars">Our promise</div>
            <p className="q-text">
              Every project gets a <em>fixed, one-page quote</em> before any money changes hands, a demo every Friday,
              and free fixes after launch. If we&apos;re the wrong fit, we&apos;ll say so on the first call.
            </p>
            <div className="author">
              <div className="av">MG</div>
              <div className="ad">
                <b>The founders, Martek Group</b>
                <span>Toronto, Canada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
