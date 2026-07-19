export default function HowWeWork() {
  return (
    <section className="how" id="how">
      <div className="wrap">
        <div className="how-head" data-reveal>
          <h2>
            How a <span className="it">project</span> goes,
            <br />
            start to ship.
          </h2>
          <p>
            We keep the moving parts small. Most projects fit in 4-6 weeks. Bigger builds run in monthly sprints with a
            single Slack channel and a Friday demo.
          </p>
        </div>

        <div className="steps" data-reveal-stagger>
          <div className="step">
            <div className="step-art">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--ink)" strokeWidth="2">
                <circle cx="16" cy="16" r="12" />
                <path d="M10 16 L14 20 L22 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="num">STEP 01</div>
            <h4>Quick chat</h4>
            <p>30 minutes, no pitch deck. Tell us the goal and we&apos;ll tell you if we can help, or who can.</p>
            <div className="timing">
              <b>Same week</b> · free
            </div>
          </div>

          <div className="step">
            <div className="step-art">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--ink)" strokeWidth="2">
                <rect x="6" y="6" width="20" height="20" rx="3" />
                <line x1="6" y1="12" x2="26" y2="12" />
                <circle cx="10" cy="9" r="0.8" fill="var(--ink)" />
              </svg>
            </div>
            <div className="num">STEP 02</div>
            <h4>One-page plan</h4>
            <p>
              Scope, price, timeline, and what success looks like. All on a single Notion page you can share with your
              team.
            </p>
            <div className="timing">
              <b>3 working days</b> · free
            </div>
          </div>

          <div className="step">
            <div className="step-art">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--ink)" strokeWidth="2">
                <path d="M6 20 L12 14 L18 20 L26 10" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="14" r="2" fill="var(--ink)" />
                <circle cx="18" cy="20" r="2" fill="var(--ink)" />
              </svg>
            </div>
            <div className="num">STEP 03</div>
            <h4>Build &amp; demo</h4>
            <p>
              We work in 1-week sprints. Friday demo, Monday adjustment. You see progress every week, never just at the
              end.
            </p>
            <div className="timing">
              <b>4–6 weeks</b> · most projects
            </div>
          </div>

          <div className="step">
            <div className="step-art">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--ink)" strokeWidth="2">
                <path
                  d="M16 4 L20 12 L28 13 L22 19 L24 27 L16 23 L8 27 L10 19 L4 13 L12 12 Z"
                  fill="var(--terra)"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="num">STEP 04</div>
            <h4>Ship &amp; grow</h4>
            <p>Launch is the start, not the end. We stay on as a fractional team to iterate, measure, and grow.</p>
            <div className="timing">
              <b>Ongoing</b> · monthly retainer
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
