import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import ContactLeadForm from '@/components/ContactLeadForm'

export const metadata: Metadata = {
  title: 'Launch Offer',
  description:
    'Our launch offer: a flat 30% off for the first 3 clients. Web, data & analytics, social, SEO & ads, and engineering/CAD. Founder-led, fixed-price, Toronto-based. Claim a spot below.',
  alternates: { canonical: '/lp/launch' },
  openGraph: {
    title: 'Marrelay - Launch Offer',
    description: 'Flat 30% off for the first 3 clients. Claim a spot. Founder-led, fixed-price, Toronto-based.',
    url: '/lp/launch',
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

const PHOTOS = [
  // pos = object-position, biased down so the subject (crowd / towers / skyline) is in frame,
  // not the ceiling or empty sky at the top of each square photo.
  { src: '/assets/lp/photo-1.jpg', alt: 'Commuters in motion', pos: '50% 60%' },
  { src: '/assets/lp/photo-2.jpg', alt: 'City light trails at night', pos: '50% 55%' },
  { src: '/assets/lp/photo-3.jpg', alt: 'City skyline at dusk', pos: '50% 60%' },
]

export default function LaunchPage({ searchParams }: { searchParams?: { hero?: string } }) {
  // Feature flag to A/B the hero: default = three-photo panorama.
  //   ?hero=single  -> one image (defaults to photo 2, the colourful city shot)
  //   ?hero=1|2|3   -> single, using that specific photo
  const heroFlag = (searchParams?.hero || '').toLowerCase()
  // Default hero = the single skyline photo (photo-3).
  //   ?hero=three (or panorama|all) -> the 3-photo panorama
  //   ?hero=1|2                     -> preview the other single photos
  const triptych = heroFlag === 'three' || heroFlag === 'panorama' || heroFlag === 'all'
  const single = !triptych
  const singleIndex = heroFlag === '1' ? 0 : heroFlag === '2' ? 1 : 2

  return (
    <>
      {/* HERO: three photos combined into one panorama (or a single image via ?hero flag) */}
      <section className="lp-hero-wrap">
        <div className="lp-hero">
          <div className={`lp-hero-imgs${single ? ' one' : ''}`}>
            {single ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={PHOTOS[singleIndex].src} alt={PHOTOS[singleIndex].alt} style={{ objectPosition: PHOTOS[singleIndex].pos }} />
            ) : (
              PHOTOS.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={p.src} src={p.src} alt={p.alt} style={{ objectPosition: p.pos }} />
              ))
            )}
          </div>
          <div className="lp-hero-scrim" />
          <div className="wrap lp-hero-inner">
            <div className="lp-hero-copy" data-reveal>
              <span className="lp-badge">Launch offer · limited to 3 clients</span>
              <h1>
                Get <span className="lp-hl">30% off</span><br />your first project.
              </h1>
              <p>
                The first <b>3 clients</b> get a flat <b>30% off</b> any project, across every service we offer.
                Founder-led, fixed-price, Toronto-based.
              </p>
            </div>
          </div>
        </div>

        {/* form starts mid-hero and overflows below it */}
        <div className="wrap">
          <div className="lp-overlap">
            <div className="lp-form-card" id="form">
              <Suspense fallback={null}>
                <ContactLeadForm />
              </Suspense>
            </div>
            <aside className="lp-offer-aside">
              <div className="lp-facts">
                {[
                  { n: '30%', t: 'Flat discount', d: 'A straight 30% off your project total. No tiers, no fine print.' },
                  { n: '3', t: 'Clients only', d: 'Capped at the first three clients who book with us.' },
                  { n: 'All', t: 'Services eligible', d: 'Web, data, social, SEO & ads, or engineering/CAD.' },
                ].map((c) => (
                  <div key={c.t} className="lp-fact">
                    <div className="n">{c.n}</div>
                    <div className="t">{c.t}</div>
                    <p>{c.d}</p>
                  </div>
                ))}
              </div>
              <p className="lp-aside-note">
                Mention the launch offer in your message and we will lock in your 30% while spots last.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* PRODUCTS, SIDE BY SIDE */}
      <div className="wrap" style={{ marginTop: 8 }}>
        <div className="head" data-reveal style={{ maxWidth: 640 }}>
          <div className="kicker">What you can put the 30% toward</div>
          <h2 style={{ fontFamily: 'var(--display)', fontWeight: 400, fontSize: 'clamp(28px,3.6vw,44px)', lineHeight: 1.02, letterSpacing: '-.02em', marginTop: 8 }}>
            Everything we build, side by side.
          </h2>
        </div>

        <div className="lp-products" data-reveal>
          {PRODUCTS.map((p) => (
            <div key={p.title} className="lp-product">
              <span className="lp-product-tag" style={{ background: p.color }}>{p.tag}</span>
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

        <p className="lp-closing" data-reveal>
          Ready when you are. <a href="#form">Claim your 30% above</a>, or{' '}
          <Link href="/contact">reach us here</Link>. Offer valid for the first three new clients only.
        </p>
      </div>

      {/* page-scoped styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .lp-hero-wrap{position:relative}
        .lp-hero{position:relative; height:clamp(440px,54vw,640px); overflow:hidden}
        .lp-hero-imgs{position:absolute; inset:0; display:grid; grid-template-columns:1fr 1fr 1fr}
        .lp-hero-imgs.one{grid-template-columns:1fr}
        .lp-hero-imgs img{width:100%; height:100%; object-fit:cover; display:block}
        .lp-hero-imgs img + img{box-shadow:-1px 0 0 rgba(0,0,0,.28)}
        .lp-hero-scrim{position:absolute; inset:0;
          background:linear-gradient(90deg, rgba(10,10,14,.62) 0%, rgba(10,10,14,.28) 34%, rgba(10,10,14,0) 60%)}
        .lp-hero-inner{position:relative; height:100%; display:flex; align-items:center}
        .lp-hero-copy{color:var(--paper); max-width:620px; padding:32px 0}
        .lp-badge{display:inline-block; font-family:var(--mono); font-size:11.5px; letter-spacing:.14em;
          text-transform:uppercase; color:var(--paper); background:var(--brand); padding:6px 12px; border-radius:999px}
        .lp-hero-copy h1{font-family:var(--display); font-weight:400; font-size:clamp(40px,6vw,80px); line-height:.96;
          letter-spacing:-.025em; margin-top:16px; color:var(--paper)}
        .lp-hl{background:var(--brand); color:var(--paper); padding:0 .12em; border-radius:10px;
          display:inline-block; transform:rotate(-1.5deg); font-style:italic}
        .lp-hero-copy p{margin-top:18px; font-size:18px; line-height:1.5; color:rgba(255,255,255,.9); max-width:520px}
        .lp-hero-copy p b{color:var(--paper)}

        /* overlap: pull the form up into the hero so it starts mid-hero and overflows downward */
        .lp-overlap{position:relative; z-index:3; margin-top:clamp(-240px,-22vw,-160px);
          display:grid; grid-template-columns:1.15fr .85fr; gap:26px; align-items:start; padding-bottom:56px}
        .lp-form-card{background:var(--paper); border:1.5px solid var(--ink); border-radius:22px;
          box-shadow:8px 8px 0 var(--ink); overflow:hidden}
        .lp-offer-aside{position:sticky; top:24px; margin-top:0}
        .lp-facts{display:grid; gap:12px}
        .lp-fact{background:var(--paper-2); border:1.5px solid var(--ink); border-radius:16px; padding:16px;
          display:grid; grid-template-columns:auto 1fr; column-gap:14px; align-items:baseline}
        .lp-fact .n{grid-row:1 / span 2; font-family:var(--display); font-size:40px; line-height:1; color:var(--brand-ink)}
        .lp-fact .t{font-weight:600; font-size:14px}
        .lp-fact p{margin-top:4px; font-size:12.5px; color:var(--ink-2); line-height:1.45}
        .lp-aside-note{margin-top:14px; font-family:var(--mono); font-size:12px; color:var(--ink-mut); line-height:1.5}

        .lp-products{margin-top:22px; display:grid; grid-template-columns:repeat(5,1fr); gap:14px}
        .lp-product{background:var(--paper-2); border:1.5px solid var(--ink); border-radius:18px; padding:18px;
          box-shadow:5px 5px 0 var(--ink); display:flex; flex-direction:column}
        .lp-product-tag{align-self:flex-start; font-family:var(--mono); font-size:10.5px; letter-spacing:.12em;
          text-transform:uppercase; color:var(--paper); padding:4px 10px; border-radius:999px}
        .lp-product h3{font-family:var(--display); font-style:italic; font-weight:400; font-size:22px; margin-top:12px}
        .lp-product p{margin-top:7px; font-size:13px; color:var(--ink-2); line-height:1.5}
        .lp-product ul{margin-top:12px; list-style:none; padding:0; display:grid; gap:8px}
        .lp-product li{display:flex; align-items:center; gap:9px; font-size:12px; color:var(--ink-mut)}
        .lp-product li span{width:6px; height:6px; border-radius:999px; flex-shrink:0}
        .lp-closing{margin:26px 0 64px; font-family:var(--mono); font-size:13px; color:var(--ink-mut)}
        .lp-closing a{text-decoration:underline}

        @media (max-width:960px){
          .lp-hero{height:clamp(360px,64vw,460px)}
          .lp-overlap{grid-template-columns:1fr; margin-top:-90px; gap:20px}
          .lp-offer-aside{position:static; margin-top:0}
          .lp-facts{grid-template-columns:1fr 1fr 1fr}
          .lp-products{grid-template-columns:repeat(2,1fr)}
        }
        @media (max-width:640px){
          .lp-hero-imgs{grid-template-columns:1fr}
          .lp-hero-imgs img + img{display:none}
          .lp-overlap{margin-top:-70px}
          .lp-facts{grid-template-columns:1fr}
          .lp-products{grid-template-columns:1fr}
        }
      `,
        }}
      />
    </>
  )
}
