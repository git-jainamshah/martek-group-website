import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About · Martek Group',
  description:
    'Martek Group is a founder-led digital studio in Toronto. We started in engineering drawings, grew into web, data, social, and SEO - and kept the honest, hands-on way of working.',
  alternates: { canonical: '/about' },
  openGraph: { url: '/about' },
}

const ArrowSvg = () => (
  <svg className="arr-svg" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 11 L11 3 M5 3 H11 V9" />
  </svg>
)

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 28 28" fill="none" stroke="var(--ink)" strokeWidth="1.8">
    {children}
  </svg>
)

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="svc-hero">
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">About</span>
          </div>
          <div className="svc-hero-grid" style={{ marginTop: 18 }}>
            <div data-reveal>
              <span className="svc-tag">
                <span className="no">✦</span>
                About Martek Group
              </span>
              <h1>
                A studio built
                <br />
                the <span className="hl">honest</span> <span className="it">way</span>.
              </h1>
              <p className="lede">
                We started Martek to sit in the gap between <b>fast-but-messy freelancers</b> and{' '}
                <b>perfect-but-slow agencies</b>. Founder-led, based in Toronto, and hands-on with every single
                project.
              </p>
              <div className="cta-row">
                <Link href="/contact" className="btn btn-primary">
                  Book a discovery call
                  <ArrowSvg />
                </Link>
                <Link href="/#what" className="btn btn-ghost">
                  See what we do
                </Link>
              </div>
              <div className="mini-stats">
                <div className="ms">
                  <div className="v">100%</div>
                  <div className="k">founder-led, every project</div>
                </div>
                <div className="ms">
                  <div className="v">1</div>
                  <div className="k">team, end to end</div>
                </div>
                <div className="ms">
                  <div className="v">YYZ</div>
                  <div className="k">based in Toronto, Canada</div>
                </div>
              </div>
            </div>

            <div data-reveal>
              <div className="hero-stage" style={{ background: 'var(--brand-soft)' }}>
                <div className="dotgrid"></div>
                <div
                  className="float-card float-a"
                  style={{ top: '16%', left: '10%', width: '58%', ['--rot' as string]: '-3deg' }}
                >
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mut)', marginBottom: 8 }}>
                    The recipe
                  </div>
                  <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 26, lineHeight: 1.05 }}>
                    Care more,
                    <br />
                    charge fair,
                    <br />
                    ship weekly.
                  </div>
                </div>
                <div
                  className="float-card float-b"
                  style={{ bottom: '14%', right: '8%', width: '46%', ['--rot' as string]: '4deg' }}
                >
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-mut)', marginBottom: 8 }}>
                    First love
                  </div>
                  <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.05 }}>
                    CAD drawings ✏️
                  </div>
                </div>
                <div className="badge float-c" style={{ top: '9%', right: '10%', ['--rot' as string]: '5deg' }}>
                  <span className="d" style={{ background: 'var(--brand)' }}></span>founder-led
                </div>
                <div className="badge float-b" style={{ bottom: '7%', left: '9%', ['--rot' as string]: '-4deg' }}>
                  📍 Toronto, CA
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="sec alt">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2>
              Where we <span className="it">come from</span>
            </h2>
            <p className="intro">
              Before we wrote a line of code, we drew. Martek started on the engineering side - CAD drawings,
              drafting, technical docs - where &quot;almost right&quot; doesn&apos;t exist. That precision habit
              followed us when we grew into websites, data, social, and search. We build digital things the way a
              draftsperson builds a drawing set: scoped up front, checked at every gate, and delivered so you can
              actually use it without us.
            </p>
          </div>
          <div className="flow" data-reveal-stagger>
            <div className="fstep">
              <span className="fn">1</span>
              <h4>Drafting roots</h4>
              <p>The studio begins with CAD, blueprints, and technical documentation - precision first.</p>
              <span className="ft">THE START</span>
            </div>
            <div className="fstep">
              <span className="fn">2</span>
              <h4>Going digital</h4>
              <p>Clients kept asking for websites and branding. We learned to ship pixels as carefully as parts.</p>
              <span className="ft">THE TURN</span>
            </div>
            <div className="fstep">
              <span className="fn">3</span>
              <h4>Full stack studio</h4>
              <p>Web, data, social, and SEO joined the bench - one team, end to end, no handoffs.</p>
              <span className="ft">TODAY</span>
            </div>
            <div className="fstep">
              <span className="fn">4</span>
              <h4>What&apos;s next</h4>
              <p>Growing carefully - freelance specialists when a project needs them, founders always in the room.</p>
              <span className="ft">TOMORROW</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <h2>
              What we <span className="hl">believe</span>
            </h2>
            <p className="intro">
              No mission-statement poetry - just the rules we actually run projects by. If we ever break one, call us
              on it.
            </p>
          </div>
          <div className="deliverables" data-reveal-stagger>
            <div className="deliv">
              <div className="ic" style={{ background: 'var(--brand-soft)' }}>
                <Icon>
                  <path d="M14 3 L24 8 V15 Q24 22 14 25 Q4 22 4 15 V8 Z" />
                  <path d="M10 14 L13 17 L18 11" strokeLinecap="round" strokeLinejoin="round" />
                </Icon>
              </div>
              <h4>Honesty first</h4>
              <p>If we&apos;re the wrong fit, we say so on the first call - and point you somewhere better.</p>
              <div className="tagrow">
                <span>No overselling</span>
                <span>Straight answers</span>
              </div>
            </div>
            <div className="deliv">
              <div className="ic" style={{ background: 'var(--butter-soft)' }}>
                <Icon>
                  <rect x="4" y="5" width="20" height="18" rx="3" />
                  <path d="M4 10 H24 M9 3 V7 M19 3 V7" strokeLinecap="round" />
                  <path d="M9 15 H15" strokeLinecap="round" />
                </Icon>
              </div>
              <h4>Fixed prices, no surprises</h4>
              <p>A one-page quote before any money moves. The number we say is the number you pay.</p>
              <div className="tagrow">
                <span>1-page quotes</span>
                <span>No scope creep bills</span>
              </div>
            </div>
            <div className="deliv">
              <div className="ic" style={{ background: 'var(--sage-soft)' }}>
                <Icon>
                  <circle cx="14" cy="10" r="4" />
                  <path d="M6 24 Q6 16 14 16 Q22 16 22 24" strokeLinecap="round" />
                </Icon>
              </div>
              <h4>Founders in the room</h4>
              <p>You talk to the people doing the work. No account managers, no telephone game.</p>
              <div className="tagrow">
                <span>Direct line</span>
                <span>No handoffs</span>
              </div>
            </div>
            <div className="deliv">
              <div className="ic" style={{ background: 'var(--terra-soft)' }}>
                <Icon>
                  <path d="M6 22 V10 L14 4 L22 10 V22 Z" />
                  <path d="M11 22 V15 H17 V22" />
                </Icon>
              </div>
              <h4>You own everything</h4>
              <p>Code, files, accounts, and keys - handed over on launch day. No lock-in, ever.</p>
              <div className="tagrow">
                <span>Your repo</span>
                <span>Your accounts</span>
              </div>
            </div>
            <div className="deliv">
              <div className="ic" style={{ background: 'var(--peri-soft)' }}>
                <Icon>
                  <circle cx="14" cy="14" r="10" />
                  <path d="M14 8 V14 L18 17" strokeLinecap="round" />
                </Icon>
              </div>
              <h4>Small on purpose</h4>
              <p>We keep the studio lean so every project gets senior attention - not the intern treatment.</p>
              <div className="tagrow">
                <span>Few projects</span>
                <span>Full attention</span>
              </div>
            </div>
            <div className="deliv">
              <div className="ic" style={{ background: 'var(--plum-soft)' }}>
                <Icon>
                  <path d="M6 20 L12 14 L18 20 L26 10" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="14" r="2" fill="var(--ink)" />
                </Icon>
              </div>
              <h4>Ship, then improve</h4>
              <p>Weekly demos, honest readouts, and iteration after launch - done beats perfect, then gets perfect.</p>
              <div className="tagrow">
                <span>Friday demos</span>
                <span>Post-launch fixes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="dot-bg"></div>
        <div className="wrap final-cta-inner">
          <div className="grid">
            <div data-reveal>
              <span className="kicker" style={{ color: 'var(--paper-3)' }}>
                Now you know us
              </span>
              <h2 style={{ marginTop: 14 }}>
                Let&apos;s get
                <br />
                <span className="stamp">acquainted</span>.
              </h2>
            </div>
            <div className="right" data-reveal>
              <p>
                Thirty minutes, no pitch deck, no obligation. Tell us what you&apos;re building and we&apos;ll tell
                you honestly how we&apos;d help - or who else could.
              </p>
              <div className="cta-row">
                <Link href="/contact" className="btn btn-primary">
                  Book a discovery call
                  <ArrowSvg />
                </Link>
                <a href="mailto:hello@martek.studio" className="btn btn-ghost">
                  hello@martek.studio
                </a>
              </div>
            </div>
          </div>
          <div className="signoff">
            <span>
              <b>Martek Group</b> · a founder-led digital studio.
            </span>
            <span>Toronto, Canada</span>
          </div>
        </div>
      </section>
    </>
  )
}
