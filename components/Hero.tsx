'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

/** Local path works in dev if the file exists; production can override via NEXT_PUBLIC_HERO_VIDEO_URL. */
const heroVideoSrc =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim() || '/assets/hero-loop.mp4'

const ArrowSvg = () => (
  <svg className="arr-svg" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 11 L11 3 M5 3 H11 V9" />
  </svg>
)

/* drifting embers / city lights (ported from "Marrelay Reimagined.html") */
const particles = [
  { left: '8%', duration: '13s', delay: '-2s' },
  { left: '15%', duration: '17s', delay: '-9s', terra: true },
  { left: '23%', duration: '15s', delay: '-5s' },
  { left: '31%', duration: '19s', delay: '-12s' },
  { left: '39%', duration: '14s', delay: '-1s', terra: true },
  { left: '47%', duration: '21s', delay: '-7s' },
  { left: '55%', duration: '16s', delay: '-3s' },
  { left: '62%', duration: '18s', delay: '-11s', terra: true },
  { left: '70%', duration: '13s', delay: '-6s' },
  { left: '78%', duration: '20s', delay: '-14s' },
  { left: '85%', duration: '15s', delay: '-4s', terra: true },
  { left: '92%', duration: '17s', delay: '-8s' },
]

export default function Hero({ videoSrc }: { videoSrc?: string } = {}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // robust muted autoplay + reveal (ported from the reference inline script)
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    vid.muted = true
    vid.defaultMuted = true
    vid.setAttribute('muted', '')

    const reveal = () => {
      if (vid.videoWidth) {
        vid.classList.add('ready')
        vid.style.setProperty('opacity', '0.6', 'important')
      }
    }
    const tryPlay = () => {
      const p = vid.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          /* autoplay blocked; scrim stays */
        })
      }
    }
    const onMedia = () => {
      reveal()
      tryPlay()
    }
    const events = ['loadeddata', 'canplay', 'canplaythrough']
    events.forEach((ev) => vid.addEventListener(ev, onMedia))
    if (vid.readyState >= 2) onMedia()
    window.addEventListener('pageshow', tryPlay)
    return () => {
      events.forEach((ev) => vid.removeEventListener(ev, onMedia))
      window.removeEventListener('pageshow', tryPlay)
    }
  }, [])

  return (
    <section className="cine-hero" id="top">
      <div className="cine-bg">
        <video ref={videoRef} className="cine-video" autoPlay muted loop playsInline preload="auto">
          <source src={videoSrc || heroVideoSrc} type="video/mp4" />
        </video>

        {/* drifting embers / city lights */}
        <div className="cine-particles" aria-hidden="true">
          {particles.map((p, i) => (
            <i
              key={i}
              style={{
                left: p.left,
                animationDuration: p.duration,
                animationDelay: p.delay,
                ...(p.terra ? { background: 'rgba(224,122,95,.8)' } : {}),
              }}
            ></i>
          ))}
        </div>

        <div className="cine-scrim"></div>
      </div>

      <div className="wrap cine-inner">
        <div className="cine-meta">
          <span className="where">Founder-led · Based in Toronto, Canada</span>
        </div>
        <h1 className="cine-title">
          A small studio that ships <span className="it">big things</span>.
        </h1>
        <p className="cine-lede">
          We&apos;re <b>Marrelay</b>, a founder-led studio designing, building, and growing products for teams
          who sweat the details, around the clock.
        </p>
        <div className="cine-cta">
          <Link href="/#start" className="btn btn-paper">
            Tell us about your idea
            <ArrowSvg />
          </Link>
          <Link href="/#work" className="btn btn-line">
            Why work with us
          </Link>
          <span className="meta">
            <b>Fixed-price quotes</b>
            <span>weekly demos · you own everything</span>
          </span>
        </div>
      </div>

      <Link href="/#what" className="cine-scroll" aria-label="Scroll to explore">
        <span className="mouse"></span>
        Scroll
      </Link>
      <div className="cine-fade"></div>
    </section>
  )
}
