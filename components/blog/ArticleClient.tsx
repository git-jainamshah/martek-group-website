'use client'

import { useEffect, useRef, useState } from 'react'
import { dlPush } from '@/analytics/datalayer'

type Props = { slug: string; title: string; category: string; readMinutes: number }

/**
 * Client-side article behaviour:
 *  - counts the read (once per hour per visitor, enforced server-side)
 *  - reading progress bar
 *  - scroll-depth milestones + a "read" event, pushed to the dataLayer
 *  - copy-link / share buttons
 */
export default function ArticleClient({ slug, title, category, readMinutes }: Props) {
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const fired = useRef<Set<number>>(new Set())
  const counted = useRef(false)

  // Count the view + fire blog_view once per mount.
  useEffect(() => {
    if (counted.current) return
    counted.current = true

    dlPush('blog_view', {
      blog_slug: slug,
      blog_title: title,
      blog_category: category,
      blog_read_minutes: readMinutes,
    })

    fetch('/api/blog/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {})
  }, [slug, title, category, readMinutes])

  // Reading progress + scroll depth milestones.
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0
        setProgress(pct)

        for (const mark of [25, 50, 75, 100]) {
          if (pct >= mark && !fired.current.has(mark)) {
            fired.current.add(mark)
            dlPush('blog_read_progress', { blog_slug: slug, blog_title: title, percent_scrolled: mark })
            if (mark === 100) {
              dlPush('blog_read_complete', { blog_slug: slug, blog_title: title })
            }
          }
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [slug, title])

  const share = (network: 'linkedin' | 'x' | 'copy') => {
    const url = window.location.href
    dlPush('blog_share', { blog_slug: slug, blog_title: title, share_method: network })

    if (network === 'copy') {
      navigator.clipboard?.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {})
      return
    }
    const target =
      network === 'linkedin'
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        : `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(target, '_blank', 'noopener,noreferrer,width=600,height=520')
  }

  return (
    <>
      <div className="bp-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="bp-share" role="group" aria-label="Share this article">
        <span className="bp-share-label">Share</span>
        <button onClick={() => share('linkedin')} aria-label="Share on LinkedIn" title="Share on LinkedIn">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="3" width="14" height="14" rx="2" />
            <path d="M6 8.5 V14 M6 5.6 V5.7 M9.5 14 V10.6 Q9.5 8.6 11.4 8.6 T13.4 10.6 V14" strokeLinecap="round" />
          </svg>
        </button>
        <button onClick={() => share('x')} aria-label="Share on X" title="Share on X">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M4 4 L16 16 M16 4 L4 16" strokeLinecap="round" />
          </svg>
        </button>
        <button onClick={() => share('copy')} aria-label="Copy link" title="Copy link">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="7" y="7" width="9" height="9" rx="2" />
            <path d="M13 7 V5 a2 2 0 0 0-2-2 H5 a2 2 0 0 0-2 2 v6 a2 2 0 0 0 2 2 h2" />
          </svg>
        </button>
        {copied && <span className="bp-copied">Link copied</span>}
      </div>
    </>
  )
}

/** CTA whose clicks are attributed to the article that produced them. */
export function ArticleCta({ slug, title }: { slug: string; title: string }) {
  return (
    <a
      href="/contact"
      className="bp-cta-btn"
      onClick={() => dlPush('blog_cta_click', { blog_slug: slug, blog_title: title, cta: 'book_discovery_call' })}
    >
      Book a discovery call
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M3 11 L11 3 M5 3 H11 V9" />
      </svg>
    </a>
  )
}
