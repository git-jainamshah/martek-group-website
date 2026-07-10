'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

/** Local path works in dev if the file exists; production can override via NEXT_PUBLIC_HERO_VIDEO_URL. */
const heroVideoSrc =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim() || '/assets/hero-loop.mp4'

const ArrowSvg = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 11 L11 3 M5 3 H11 V9" />
  </svg>
)

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
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

  // immersive nav: transparent while the hero is covering it, solid after
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const navToggle = () => {
      const h = hero.offsetHeight
      document.body.classList.toggle('over-hero', window.scrollY < h - 120)
    }
    window.addEventListener('scroll', navToggle, { passive: true })
    window.addEventListener('resize', navToggle)
    navToggle()
    return () => {
      window.removeEventListener('scroll', navToggle)
      window.removeEventListener('resize', navToggle)
      document.body.classList.remove('over-hero')
    }
  }, [])

  return (
    <section className="cine-hero lux-hero" id="top" ref={heroRef}>
      <div className="cine-bg">
        <video ref={videoRef} className="cine-video" autoPlay muted loop playsInline preload="auto">
          <source src={heroVideoSrc} type="video/mp4" />
        </video>
        <div className="lux-scrim"></div>
        <div className="lux-vignette"></div>
        <div className="lux-grain" aria-hidden="true"></div>
      </div>

      <div className="lux-frame" aria-hidden="true">
        <span className="ct tl"></span>
        <span className="ct tr"></span>
        <span className="ct bl"></span>
        <span className="ct br"></span>
      </div>

      <div className="wrap lux-inner">
        <div className="lux-top lux-anim d1">
          <span className="lux-ey">Martek Group — Digital Studio</span>
          <span className="lux-avail">
            <i></i> Booking July
          </span>
        </div>

        <div className="lux-center">
          <h1 className="lux-title lux-anim d2">
            A small studio
            <br />
            that ships <span className="it">big things</span>.
          </h1>
          <p className="lux-lede lux-anim d3">
            We design, build and grow products for founders who sweat the details — quietly, across time zones,
            around the clock.
          </p>
          <div className="lux-cta lux-anim d4">
            <Link href="/#start" className="lux-btn">
              Start a project
              <ArrowSvg />
            </Link>
            <Link href="/#work" className="lux-link">
              View selected work
            </Link>
          </div>
        </div>

        <div className="lux-foot lux-anim d4">
          <div className="s">
            <span className="v">
              5.0<em>★</em>
            </span>
            <span className="k">Average rating</span>
          </div>
          <div className="s">
            <span className="v">17</span>
            <span className="k">Startups shipped</span>
          </div>
          <div className="s">
            <span className="v">0</span>
            <span className="k">Missed deadlines</span>
          </div>
          <div className="s wide">
            <span className="v" style={{ fontStyle: 'normal' }}>
              Remote-first
            </span>
            <span className="k">Mumbai · Toronto · Lisbon</span>
          </div>
        </div>
      </div>
      <div className="cine-fade"></div>
    </section>
  )
}
