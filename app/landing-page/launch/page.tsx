import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import ContactLeadForm from '@/components/ContactLeadForm'

export const metadata: Metadata = {
  title: 'Launch Offer - 30% Off Your First Project · Marrelay',
  description:
    'Our launch offer: a flat 30% off for the first 3 clients. Web, data & analytics, social, SEO & ads, and engineering/CAD. Founder-led, fixed-price, Toronto-based. Claim a spot below.',
  alternates: { canonical: '/landing-page/launch' },
  openGraph: {
    title: 'Launch Offer - 30% Off Your First Project · Marrelay',
    description: 'Flat 30% off for the first 3 clients. Claim a spot. Founder-led, fixed-price, Toronto-based.',
    url: '/landing-page/launch',
    images: [{ url: '/assets/martek-group-header.png', width: 1200, height: 630, alt: 'Marrelay launch offer' }],
  },
  // Paid-social landing. Kept out of the index so it does not compete with core pages.
  robots: { index: false, follow: true },
}

const PRODUCTS = [
  {
    tag: 'Web',
    color: 'var(--terra)',
    title: 'Web development',
    blurb: 'Fast, custom sites and web apps in React & Next.js. You own the code.',
    points: ['Marketing sites & landing pages', 'Custom web apps & dashboards', 'E-commerce & headless CMS'],
  },
  {
    tag: 'Data',
    color: '#3D7D6E',
    title: 'Data & analytics',
    blurb: 'Clean tracking and dashboards so you can actually see what is working.',
    points: ['GA4 & server-side tagging', 'Executive dashboards', 'Reporting & attribution'],
  },
  {
    tag: 'Social',
    color: '#C58A2E',
    title: 'Social media',
    blurb: 'Content and community management that keeps your brand consistent.',
    points: ['Content calendars', 'Creative & short-form video', 'Community management'],
  },
  {
    tag: 'SEO & Ads',
    color: '#5A6BC0',
    title: 'SEO & paid ads',
    blurb: 'Get found and convert with technical SEO plus Google & Meta ad management.',
    points: ['Technical SEO audits', 'Google & Meta ads', 'Landing-page optimisation'],
  },
  {
    tag: 'CAD',
    color: '#8A6FB0',
    title: 'Engineering & CAD',
    blurb: 'Precision drafting and 3D modelling for industrial and civil projects.',
    points: ['CAD / CAM drafting', '3D parametric modelling', 'Technical specifications'],
  },
]

export default function LaunchPage() {
  return (
    <>
      {/* HERO with image + FORM ON TOP */}
      <section className="contact-hero" style={{ paddingTop: 40, paddingBottom: 8 }}>
        <div className="wrap">
          <div className="launch-top">
            {/* LEFT: pitch + offer + image */}
            <div data-reveal>
              <div className="trust-strip" style={{ paddingTop: 0, marginBottom: 14 }}>
                <span className="launch-badge">Launch offer · limited to 3 clients</span>
              </div>
              <h1 style={{ fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(40px,5.4vw,72px)', lineHeight: '.98', letterSpacing: '-.025em' }}>
                Get <span className="hl">30% off</span> your first project.
              </h1>
              <p className="lede" style={{ marginTop: 18 }}>
                We are opening the doors, and the first <b style={{ color: 'var(--ink)' }}>3 clients</b> get a flat{' '}
                <b style={{ color: 'var(--ink)' }}>30% off</b> any project, across every service we offer. Founder-led,
                fixed-price, and Toronto-based. Once the 3 spots are gone, they are gone.
              </p>

              {/* hero image */}
              <div className="media-frame launch-hero-img" data-reveal>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/launch/skyline.jpg" alt="City skyline at dusk" />
              </div>

              {/* offer facts */}
              <div className="launch-facts" data-reveal>
                {[
                  { n: '30%', t: 'Flat discount', d: 'A straight 30% off your project total. No tiers, no fine print.' },
                  { n: '3', t: 'Clients only', d: 'Capped at the first three clients who book with us.' },
                  { n: 'All', t: 'Services eligible', d: 'Web, data, social, SEO & ads, or engineering/CAD.' },
                ].map((c) => (
                  <div key={c.t} className="launch-fact">
                    <div className="n">{c.n}</div>
                    <div className="t">{c.t}</div>
                    <p>{c.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: the form, on top, sticky on desktop */}
            <div className="launch-form-col" data-reveal>
              <div className="lead-wrap" id="form">
                <Suspense fallback={null}>
                  <ContactLeadForm />
                </Suspense>
              </div>
              <p className="launch-form-note">
                Mention the launch offer in your message and we will lock in your 30% while spots last.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS, SIDE BY SIDE */}
      <div className="wrap" style={{ marginTop: 40 }}>
        <div className="head" data-reveal style={{ maxWidth: 640 }}>
          <div className="kicker">What you can put the 30% toward</div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(28px,3.6vw,44px)', lineHeight: 1.02, letterSpacing: '-.02em', marginTop: 8 }}>
            Everything we build, side by side.
          </h2>
        </div>

        <div className="launch-products" data-reveal>
          {PRODUCTS.map((p) => (
            <div key={p.title} className="launch-product">
              <span className="launch-product-tag" style={{ background: p.color }}>{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <ul>
                {p.points.map((pt) => (
                  <li key={pt}>
                    <span style={{ background: p.color }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* IMAGE BAND */}
      <div className="wrap" style={{ marginTop: 48 }}>
        <div className="launch-band" data-reveal>
          <div className="media-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/launch/crowd.jpg" alt="Commuters in motion" />
          </div>
          <div className="media-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/launch/city-lights.jpg" alt="City light trails at night" />
          </div>
        </div>
        <p className="launch-closing" data-reveal>
          Ready when you are. <a href="#form">Claim your 30% above</a>, or{' '}
          <Link href="/contact">reach us here</Link>. Offer valid for the first three new clients only.
        </p>
      </div>

      {/* page-scoped styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .launch-badge{font-family:var(--mono); font-size:11.5px; letter-spacing:.14em; text-transform:uppercase;
          color:var(--paper); background:var(--brand); padding:6px 12px; border-radius:999px}
        .launch-top{display:grid; grid-template-columns:1.05fr .95fr; gap:38px; align-items:start}
        .launch-hero-img{margin-top:24px; aspect-ratio:16/9}
        .launch-hero-img img{width:100%; height:100%; object-fit:cover}
        .launch-facts{display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:24px}
        .launch-fact{background:var(--paper-2); border:1.5px solid var(--ink); border-radius:16px; padding:16px}
        .launch-fact .n{font-family:var(--display); font-size:36px; line-height:1; color:var(--brand-ink)}
        .launch-fact .t{font-weight:600; margin-top:8px; font-size:14px}
        .launch-fact p{margin-top:5px; font-size:12.5px; color:var(--ink-2); line-height:1.45}
        .launch-form-col{position:sticky; top:24px}
        .launch-form-note{margin-top:12px; font-family:var(--mono); font-size:12px; color:var(--ink-mut); line-height:1.5}
        .launch-products{margin-top:22px; display:grid; grid-template-columns:repeat(5,1fr); gap:14px}
        .launch-product{background:var(--paper-2); border:1.5px solid var(--ink); border-radius:18px; padding:18px;
          box-shadow:5px 5px 0 var(--ink); display:flex; flex-direction:column}
        .launch-product-tag{align-self:flex-start; font-family:var(--mono); font-size:10.5px; letter-spacing:.12em;
          text-transform:uppercase; color:var(--paper); padding:4px 10px; border-radius:999px}
        .launch-product h3{font-family:var(--display); font-style:italic; font-weight:400; font-size:22px; margin-top:12px}
        .launch-product p{margin-top:7px; font-size:13px; color:var(--ink-2); line-height:1.5}
        .launch-product ul{margin-top:12px; list-style:none; padding:0; display:grid; gap:8px}
        .launch-product li{display:flex; align-items:center; gap:9px; font-size:12px; color:var(--ink-mut)}
        .launch-product li span{width:6px; height:6px; border-radius:999px; flex-shrink:0}
        .launch-band{display:grid; grid-template-columns:1fr 1fr; gap:18px}
        .launch-band .media-frame{aspect-ratio:4/3}
        .launch-band .media-frame img{width:100%; height:100%; object-fit:cover}
        .launch-closing{margin:22px 0 64px; font-family:var(--mono); font-size:13px; color:var(--ink-mut)}
        .launch-closing a{text-decoration:underline}
        @media (max-width:960px){
          .launch-top{grid-template-columns:1fr; gap:26px}
          .launch-form-col{position:static}
          .launch-products{grid-template-columns:repeat(2,1fr)}
        }
        @media (max-width:640px){
          .launch-facts{grid-template-columns:1fr}
          .launch-products{grid-template-columns:1fr}
          .launch-band{grid-template-columns:1fr}
        }
      `,
        }}
      />
    </>
  )
}
