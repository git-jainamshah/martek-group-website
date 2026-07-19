import Link from 'next/link'

const GoArrow = () => (
  <span className="go">
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11 L11 3 M5 3 H11 V9" />
    </svg>
  </span>
)

export default function WhatWeDo() {
  return (
    <section className="what" id="what">
      <div className="wrap">
        <div className="what-head" data-reveal>
          <h2>
            Five things,
            <br />
            done <span className="hl">honestly</span> <span className="it">well</span>.
          </h2>
          <p className="right">
            We pick the tools, write the words, build the thing, ship it, and then help you grow it.{' '}
            <b>One team, end to end.</b> No handoffs. No surprise invoices.{' '}
            <span style={{ color: 'var(--ink-mut)' }}>Tap any card to see how that service works →</span>
          </p>
        </div>

        <div className="svc-grid" data-reveal-stagger>
          {/* WEB DEV */}
          <Link href="/services/web-development" className="svc s-web">
            <div className="num">
              <span>01 ·</span>
              <span>Web</span>
            </div>
            <h3>
              Websites that <span className="it">earn their pixels</span>
            </h3>
            <p>Marketing sites, product UIs, e-commerce. We design and code in the same room.</p>
            <svg className="art art-web" viewBox="0 0 140 110" fill="none" stroke="var(--ink)" strokeWidth="2">
              <rect x="6" y="8" width="128" height="92" rx="10" fill="var(--paper)" />
              <rect x="6" y="8" width="128" height="18" rx="10" fill="var(--terra)" />
              <circle cx="16" cy="17" r="2.4" fill="var(--ink)" />
              <circle cx="24" cy="17" r="2.4" fill="var(--ink)" />
              <circle cx="32" cy="17" r="2.4" fill="var(--ink)" />
              <rect x="14" y="34" width="60" height="6" rx="3" fill="var(--ink)" />
              <rect x="14" y="46" width="100" height="3" rx="1.5" fill="var(--ink-mut)" />
              <rect x="14" y="54" width="80" height="3" rx="1.5" fill="var(--ink-mut)" />
              <rect x="14" y="68" width="44" height="20" rx="10" fill="var(--butter)" />
              <rect x="64" y="68" width="60" height="20" rx="6" fill="var(--sage-soft)" stroke="var(--ink)" />
            </svg>
            <div className="features">
              <span>Next.js</span>
              <span>Webflow</span>
              <span>Shopify</span>
              <span>Figma</span>
            </div>
            <GoArrow />
          </Link>

          {/* DATA */}
          <Link href="/services/data-analytics" className="svc s-data">
            <div className="num">
              <span>02 ·</span>
              <span>Data</span>
            </div>
            <h3>
              Dashboards that <span className="it">someone reads</span>
            </h3>
            <p>We tag, track, and turn your messy data into 1-pager weekly reports.</p>
            <svg className="art art-data" viewBox="0 0 160 110" fill="none" stroke="var(--ink)" strokeWidth="2">
              <rect x="4" y="8" width="152" height="98" rx="12" fill="var(--paper)" />
              <path
                d="M14 86 Q 40 56, 64 64 T 112 36 T 148 24"
                stroke="var(--terra)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="64" cy="64" r="4" fill="var(--terra)" stroke="var(--ink)" />
              <circle cx="112" cy="36" r="4" fill="var(--terra)" stroke="var(--ink)" />
              <line x1="14" y1="86" x2="148" y2="86" stroke="var(--ink-mut)" strokeDasharray="3 3" />
              <rect x="14" y="20" width="42" height="10" rx="5" fill="var(--sage)" />
              <rect x="120" y="20" width="28" height="10" rx="5" fill="var(--butter)" stroke="var(--ink)" />
            </svg>
            <div className="features">
              <span>GA4</span>
              <span>Mixpanel</span>
              <span>Looker</span>
              <span>SQL</span>
            </div>
            <GoArrow />
          </Link>

          {/* SEO + ADS */}
          <Link href="/services/seo-ads" className="svc s-seo">
            <div className="num">
              <span>03 ·</span>
              <span>SEO &amp; Ads</span>
            </div>
            <h3>
              Be the <span className="it">first result</span>, not the loudest
            </h3>
            <p>Technical SEO, content, paid search &amp; social. We move the cost-per-acquire down, week by week.</p>
            <svg className="art art-seo" viewBox="0 0 130 130" fill="none" stroke="var(--ink)" strokeWidth="2">
              <circle cx="58" cy="56" r="34" fill="var(--paper)" />
              <line x1="84" y1="82" x2="116" y2="116" strokeWidth="6" strokeLinecap="round" />
              <circle cx="58" cy="56" r="34" fill="none" />
              <text
                x="58"
                y="62"
                fontFamily="var(--mono)"
                fontSize="10"
                textAnchor="middle"
                fill="var(--ink)"
                stroke="none"
                fontWeight="500"
              >
                #1
              </text>
              <circle cx="36" cy="40" r="5" fill="var(--terra)" />
              <circle cx="80" cy="36" r="3" fill="var(--sage)" />
              <circle cx="74" cy="76" r="3" fill="var(--butter)" />
            </svg>
            <div className="features">
              <span>Technical SEO</span>
              <span>Google Ads</span>
              <span>Meta</span>
              <span>Content</span>
            </div>
            <GoArrow />
          </Link>

          {/* SOCIAL */}
          <Link href="/services/social" className="svc s-social">
            <div className="num">
              <span>04 ·</span>
              <span>Social</span>
            </div>
            <h3>
              Voice &amp; <span className="it">community</span> for tiny brands
            </h3>
            <p>
              We become your in-house content team. Posting, replying, and turning DMs into customers, with monthly
              creative drops you actually want to share.
            </p>
            <svg className="art art-social" viewBox="0 0 280 180" fill="none" stroke="var(--ink)" strokeWidth="2">
              <rect x="80" y="14" width="120" height="160" rx="22" fill="var(--paper)" />
              <rect x="92" y="36" width="96" height="22" rx="6" fill="var(--terra-soft)" />
              <rect x="92" y="68" width="96" height="48" rx="6" fill="var(--paper-2)" strokeDasharray="3 3" />
              <rect x="92" y="124" width="60" height="14" rx="7" fill="var(--ink)" />
              <rect x="92" y="146" width="80" height="6" rx="3" fill="var(--ink-mut)" />
              <rect x="14" y="36" width="60" height="28" rx="14" fill="var(--paper)" />
              <text x="44" y="55" fontFamily="var(--mono)" fontSize="11" textAnchor="middle" fill="var(--ink)" stroke="none">
                love this
              </text>
              <rect x="20" y="92" width="50" height="26" rx="13" fill="var(--terra)" />
              <text x="45" y="109" fontFamily="var(--mono)" fontSize="11" textAnchor="middle" fill="var(--paper)" stroke="none">
                +1
              </text>
              <rect x="210" y="60" width="56" height="26" rx="13" fill="var(--paper)" />
              <text x="238" y="78" fontFamily="var(--mono)" fontSize="11" textAnchor="middle" fill="var(--ink)" stroke="none">
                share!
              </text>
              <rect x="208" y="118" width="60" height="26" rx="13" fill="var(--ink)" />
              <text x="238" y="135" fontFamily="var(--mono)" fontSize="11" textAnchor="middle" fill="var(--paper)" stroke="none">
                DM us
              </text>
            </svg>
            <div className="features">
              <span>Strategy</span>
              <span>Content</span>
              <span>Community</span>
              <span>Creator deals</span>
            </div>
            <GoArrow />
          </Link>

          {/* ENGINEERING / CAD */}
          <Link href="/services/engineering" className="svc s-eng">
            <div className="num">
              <span>05 ·</span>
              <span>Engineering</span>
            </div>
            <h3>
              Drawings, drafts &amp; <span className="it">technical docs</span>
            </h3>
            <p>
              Yes, we also do CAD. Mechanical drafting, blueprints, and 3D modelling for hardware founders and
              contractors. The team built this side of the business first.
            </p>
            <svg className="art art-eng" viewBox="0 0 260 180" fill="none" stroke="var(--ink)" strokeWidth="1.5">
              <rect x="20" y="10" width="220" height="160" rx="6" fill="var(--paper)" />
              <g stroke="var(--plum-soft)" strokeWidth="1">
                <line x1="20" y1="40" x2="240" y2="40" />
                <line x1="20" y1="70" x2="240" y2="70" />
                <line x1="20" y1="100" x2="240" y2="100" />
                <line x1="20" y1="130" x2="240" y2="130" />
                <line x1="20" y1="160" x2="240" y2="160" />
                <line x1="60" y1="10" x2="60" y2="170" />
                <line x1="100" y1="10" x2="100" y2="170" />
                <line x1="140" y1="10" x2="140" y2="170" />
                <line x1="180" y1="10" x2="180" y2="170" />
                <line x1="220" y1="10" x2="220" y2="170" />
              </g>
              <g stroke="var(--ink)" strokeWidth="2" fill="none">
                <path d="M80 100 L130 80 L180 100 L130 120 Z" fill="var(--plum-soft)" />
                <path d="M80 100 L80 140 L130 160 L130 120 Z" fill="var(--paper)" />
                <path d="M180 100 L180 140 L130 160 L130 120 Z" fill="var(--paper-2)" />
              </g>
              <g stroke="var(--terra)" strokeWidth="1.5">
                <line x1="80" y1="150" x2="130" y2="170" strokeDasharray="2 2" />
                <text x="100" y="165" fontFamily="var(--mono)" fontSize="10" fill="var(--terra)" stroke="none">
                  42mm
                </text>
              </g>
              <text x="30" y="30" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mut)" stroke="none">
                SHEET 01 / REV B
              </text>
            </svg>
            <div className="features">
              <span>AutoCAD</span>
              <span>SolidWorks</span>
              <span>Fusion 360</span>
              <span>3D modeling</span>
            </div>
            <GoArrow />
          </Link>
        </div>
      </div>
    </section>
  )
}
