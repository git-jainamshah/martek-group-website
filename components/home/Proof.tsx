/* eslint-disable @next/next/no-img-element */
export default function Proof() {
  return (
    <section className="proof" id="work">
      <div className="wrap">
        <div className="proof-grid">
          <div data-reveal>
            <span className="kicker">Why founders pick us</span>
            <h2 style={{ marginTop: 14 }}>
              Built by <span className="hl">a startup</span>
              <br />
              <span className="it">for startups</span>.
            </h2>
            <p className="lede">
              We started Martek in 2024 because every agency we&apos;d hired charged like a multinational and showed up
              like a junior. We&apos;re cheaper, faster, and we still pick up the phone three years from now.
            </p>

            <div className="numbers">
              <div className="n">
                <div className="v">
                  17<sup>+</sup>
                </div>
                <div className="k">
                  products shipped
                  <br />
                  since launch
                </div>
              </div>
              <div className="n">
                <div className="v">
                  4.9<sup>/5</sup>
                </div>
                <div className="k">
                  avg. founder rating
                  <br />
                  on Clutch
                </div>
              </div>
              <div className="n">
                <div className="v">
                  28<sup>days</sup>
                </div>
                <div className="k">
                  median time
                  <br />
                  to first launch
                </div>
              </div>
            </div>

            <div className="media-frame" style={{ marginTop: 32, aspectRatio: '16/9' }}>
              <span className="img-slot" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                <img src="/assets/office-dark-hero.png" alt="The Martek crew at work" />
              </span>
              <span className="media-tag">the crew, mid-sprint ✷</span>
            </div>
          </div>

          <div className="quote-card" data-reveal>
            <span className="qmark">&quot;</span>
            <div className="stars">★★★★★</div>
            <p className="q-text">
              They felt like our co-founders for two months. Shipped our marketing site, set up analytics, ran our
              launch ads, <em>all for less than one senior PM</em>.
            </p>
            <div className="author">
              <div className="av">RT</div>
              <div className="ad">
                <b>Reena Tandon</b>
                <span>Founder, Brookhaven · seed-stage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
