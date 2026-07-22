'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { searchDocs, SEARCH_INDEX } from '@/lib/search-index'
import { trackSiteSearch, trackSiteSearchSelect } from '@/analytics/events'

const SearchIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
  </svg>
)

// A few handy suggestions shown before the visitor types.
const QUICK = ['Web Development', 'Data & Analytics', 'SEO & Ads', 'Engineering & CAD', 'Case Studies', 'Pricing', 'Contact Us']

export default function SiteSearch({ variant = 'icon' }: { variant?: 'icon' | 'drawer' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const results = useMemo(() => (query.trim() ? searchDocs(query, 8) : []), [query])
  const list = query.trim()
    ? results
    : QUICK.map((t) => SEARCH_INDEX.find((d) => d.title === t)).filter(Boolean) as typeof SEARCH_INDEX

  const openSearch = useCallback(() => setOpen(true), [])
  const close = useCallback(() => { setOpen(false); setQuery(''); setActive(0) }, [])

  // global open: Cmd/Ctrl+K, "/" (when not typing), and a custom event for the mobile trigger
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((v) => !v) }
      else if (e.key === '/' && !typing && !open) { e.preventDefault(); setOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-site-search', openSearch as EventListener)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-site-search', openSearch as EventListener)
    }
  }, [open, openSearch])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20)
  }, [open])
  useEffect(() => { setActive(0) }, [query])

  // fire a debounced `site_search` event so we capture what people search for,
  // even when they don't click a result
  const lastTracked = useRef('')
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) return
    const id = setTimeout(() => {
      if (q !== lastTracked.current) {
        lastTracked.current = q
        trackSiteSearch(q, searchDocs(q, 8).length)
      }
    }, 700)
    return () => clearTimeout(id)
  }, [query])

  const go = useCallback((url: string, position: number) => {
    trackSiteSearchSelect(query.trim(), url, position, results.length)
    close()
    router.push(url)
  }, [query, results.length, close, router])

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, list.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); const d = list[active]; if (d) go(d.url, active) }
    else if (e.key === 'Escape') { e.preventDefault(); close() }
  }

  return (
    <>
      {variant === 'icon' ? (
        <button type="button" className="nav-search" aria-label="Search the site" title="Search  ( / )" onClick={openSearch}>
          <SearchIcon />
        </button>
      ) : (
        <button type="button" className="m-search" onClick={openSearch}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><SearchIcon size={16} /> Search</span>
          <span className="ar"><SearchIcon size={14} /></span>
        </button>
      )}

      {open && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Site search" onClick={close}>
          <div className="search-panel" onClick={(e) => e.stopPropagation()}>
            <div className="search-input-row">
              <SearchIcon />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages, services, case studies…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                aria-label="Search query"
              />
              <button type="button" className="search-esc" onClick={close} aria-label="Close">Esc</button>
            </div>

            <div className="search-results">
              {!query.trim() && <div className="search-hint">Popular</div>}
              {query.trim() && results.length === 0 && (
                <div className="search-empty">No matches for “{query}”. Try “web”, “analytics”, “CAD”, or “pricing”.</div>
              )}
              {list.map((d, i) => (
                <button
                  key={d.url}
                  type="button"
                  className={`search-item${i === active ? ' active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(d.url, i)}
                >
                  <span className="search-item-main">
                    <b>{d.title}</b>
                    <small>{d.description}</small>
                  </span>
                  <span className="search-item-sec">{d.section}</span>
                </button>
              ))}
            </div>

            <div className="search-foot">
              <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
              <span><kbd>↵</kbd> to open</span>
              <span><kbd>esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
