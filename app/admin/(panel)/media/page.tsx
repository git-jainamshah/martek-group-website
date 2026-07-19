'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from 'react'
import { RefreshCw, Upload, FolderOpen, Replace, AlertTriangle } from 'lucide-react'
import { Modal, Section } from '@/components/admin/ui'

type MediaLink = { file: string; label: string; line: number }
type Media = {
  id: number; filename: string; relPath: string; kind: 'photo' | 'video'
  size: number; addedAt: string; modifiedAt: string; links: MediaLink[]
}
/** A slot = one media file used within one page/section of the site. */
type Slot = { pageLabel: string; media: Media }

const fmtSize = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`

/** Page grouping: site-wide items first, then Home, then the rest alphabetically. */
const PAGE_ORDER = (label: string) =>
  label.includes('every page') || label.includes('Social sharing') ? 0 :
  label.startsWith('Home') ? 1 : 2

/** URL hint per page group label. */
function pageUrl(label: string): string {
  if (label.includes('every page') || label.includes('Social sharing')) return 'shown across the whole site'
  const map: Record<string, string> = {
    'Home page': '/', 'Home page — hero video': '/', 'About Us page': '/about', 'Contact page': '/contact',
    'Pricing page': '/pricing', 'Blog page': '/blogs', 'Projects page': '/projects', 'Case Studies page': '/case-studies',
    'Web Development service page': '/services/web-development', 'Data & Analytics service page': '/services/data-analytics',
    'Social service page': '/services/social', 'SEO & Ads service page': '/services/seo-ads',
    'Engineering & CAD service page': '/services/engineering', 'Abstracts page': '/abstracts',
  }
  return map[label] ?? ''
}

/** Collapse hero-video style labels into their page group. */
function pageGroupOf(label: string): string {
  if (label.includes('every page') || label.includes('Social sharing') || label.includes('Promo pop-up')) return 'Site-wide (header, footer & shared elements)'
  if (label.startsWith('Home page')) return 'Home page'
  if (label.includes('used on several pages') || label.endsWith('section')) return 'Shared sections (used on several pages)'
  return label
}

export default function ManageMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [writable, setWritable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState<Slot | null>(null)
  const [mode, setMode] = useState<'library' | 'upload'>('library')
  const [chosen, setChosen] = useState<Media | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/media').then((r) => r.json()).then((d) => {
      setMedia(d.media || [])
      setWritable(d.storageWritable !== false)
    }).finally(() => setLoading(false))
  }
  useEffect(load, [])

  /** Group: page -> slots (each linked media on that page). */
  const pages = useMemo(() => {
    const map = new Map<string, Slot[]>()
    for (const m of media) {
      if (!m.links.length) continue
      const groups = new Set(m.links.map((l) => pageGroupOf(l.label)))
      for (const g of groups) {
        const arr = map.get(g) ?? []
        arr.push({ pageLabel: g, media: m })
        map.set(g, arr)
      }
    }
    return [...map.entries()].sort((a, b) => PAGE_ORDER(a[0]) - PAGE_ORDER(b[0]) || a[0].localeCompare(b[0]))
  }, [media])

  /** For the change modal: any media of same kind + format (reuse encouraged). */
  const choices = useMemo(() => {
    if (!changing) return []
    const ext = changing.media.relPath.split('.').pop()?.toLowerCase()
    return media.filter((m) =>
      m.kind === changing.media.kind &&
      m.relPath.split('.').pop()?.toLowerCase() === ext &&
      m.id !== changing.media.id
    )
  }, [media, changing])

  /** Other places (outside the current page group) sharing the same file. */
  const sharedElsewhere = (slot: Slot) =>
    [...new Set(slot.media.links.map((l) => pageGroupOf(l.label)))].filter((g) => g !== slot.pageLabel)

  function flash(kind: 'ok' | 'err', msg: string) {
    setToast({ kind, msg })
    setTimeout(() => setToast(null), 6000)
  }

  async function applyLibrary() {
    if (!changing || !chosen) return
    setBusy(true)
    const res = await fetch('/api/admin/media/replace-with', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetPath: changing.media.relPath, sourceId: chosen.id }),
    })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) return flash('err', data.error || 'Change failed.')
    flash('ok', `Updated — ${chosen.filename} is now live in this spot.`)
    setChanging(null); setChosen(null)
    load()
  }

  async function applyUpload(file: File) {
    if (!changing) return
    setBusy(true)
    const fd = new FormData()
    fd.append('targetPath', changing.media.relPath)
    fd.append('file', file)
    const res = await fetch('/api/admin/media/replace', { method: 'POST', body: fd })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) return flash('err', data.error || 'Upload failed.')
    flash('ok', 'Uploaded and live. Previous version archived.')
    setChanging(null)
    load()
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>
        <div>
          <div className="ad-kicker">Content</div>
          <h1>Manage <span className="it">media</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 8, maxWidth: 580 }}>
            Organized by page. Open a page to see every picture and video it uses, and change any of them —
            reuse something from Storage or upload new. Media can live in many places at once.
          </p>
        </div>
        <button onClick={load} className="ad-btn-ghost"><RefreshCw size={15} /> Rescan site</button>
      </div>

      {toast && <div className={`ad-alert ${toast.kind}`} style={{ marginBottom: 16 }}>{toast.msg}</div>}
      {loading && <p className="ad-mut" style={{ fontSize: 14 }}>Scanning the site…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {pages.map(([page, slots], idx) => (
          <Section
            key={page}
            title={page}
            kicker={pageUrl(page) ? (pageUrl(page).startsWith('/') ? `Page URL: ${pageUrl(page)}` : pageUrl(page)) : undefined}
            subtitle={`${slots.length} media item${slots.length === 1 ? '' : 's'}`}
            defaultOpen={idx === 0}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {slots.map((slot) => {
                const shared = sharedElsewhere(slot)
                const sectionLabels = [...new Set(
                  slot.media.links.filter((l) => pageGroupOf(l.label) === slot.pageLabel).map((l) => l.label)
                )]
                return (
                  <div key={slot.media.id} style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', padding: '10px 0', borderBottom: '1px solid var(--rule)' }}>
                    <div style={{ width: 130, height: 78, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: 'var(--ink)' }}>
                      {slot.media.kind === 'video'
                        ? <video src={slot.media.relPath} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline preload="metadata" />
                        : <img src={slot.media.relPath} alt={slot.media.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <b style={{ fontSize: 14 }}>{sectionLabels.join(' · ')}</b>
                        <span className="ad-badge grey">{slot.media.kind === 'video' ? 'Video' : 'Picture'}</span>
                      </div>
                      <div className="ad-soft" style={{ fontSize: 12, marginTop: 3 }}>
                        {slot.media.filename} · {fmtSize(slot.media.size)}
                      </div>
                      {shared.length > 0 && (
                        <div className="ad-mut" style={{ fontSize: 11.5, marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <AlertTriangle size={12} style={{ color: '#8a6116' }} />
                          Also used on: {shared.join(', ')} — changing it here updates those too.
                        </div>
                      )}
                    </div>
                    <button className="ad-btn" style={{ padding: '8px 16px', fontSize: 12.5 }}
                      onClick={() => { setChanging(slot); setMode('library'); setChosen(null) }}>
                      <Replace size={14} /> Change
                    </button>
                  </div>
                )
              })}
            </div>
          </Section>
        ))}
      </div>

      {changing && (
        <Modal wide onClose={() => !busy && setChanging(null)}>
          <h3>Change media — {changing.pageLabel}</h3>
          <p className="ad-mut" style={{ fontSize: 13, marginBottom: 6 }}>
            Currently: <b>{changing.media.filename}</b>
          </p>
          {sharedElsewhere(changing).length > 0 && (
            <div className="ad-alert err" style={{ marginBottom: 12, background: '#fdf3dd', borderColor: '#f2cc8f', color: '#8a6116' }}>
              This file also appears on {sharedElsewhere(changing).join(', ')} — the change applies everywhere it&apos;s used.
            </div>
          )}
          {!writable && (
            <div className="ad-alert err" style={{ marginBottom: 12 }}>
              File storage is read-only on this deployment — media changes work on a persistent server or after the Blob storage upgrade.
            </div>
          )}
          <div className="ad-tabs" style={{ margin: '8px 0 16px' }}>
            <button className={`ad-tab ${mode === 'library' ? 'active' : ''}`} onClick={() => setMode('library')}><FolderOpen size={14} /> From Storage</button>
            <button className={`ad-tab ${mode === 'upload' ? 'active' : ''}`} onClick={() => setMode('upload')}><Upload size={14} /> Upload new</button>
          </div>

          {mode === 'library' ? (
            <>
              <p className="ad-mut" style={{ fontSize: 13, marginBottom: 10 }}>
                Any {changing.media.kind === 'video' ? 'video' : 'picture'} in {changing.media.relPath.split('.').pop()?.toUpperCase()} format — including ones already used elsewhere.
              </p>
              {choices.length === 0 ? (
                <p className="ad-soft" style={{ fontSize: 13 }}>Nothing suitable in Storage yet — upload one instead.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                  {choices.map((c) => (
                    <button key={c.id} onClick={() => setChosen(c)} className="ad-tile"
                      style={{ cursor: 'pointer', padding: 0, outline: chosen?.id === c.id ? '3px solid var(--brand)' : 'none' }}>
                      <div className="ad-thumb" style={{ aspectRatio: '4/3' }}>
                        {c.kind === 'video'
                          ? <video src={c.relPath} muted playsInline preload="metadata" />
                          : <img src={c.relPath} alt={c.filename} loading="lazy" />}
                      </div>
                      <div style={{ padding: '6px 8px', fontSize: 11, textAlign: 'left' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{c.filename}</div>
                        <div className="ad-soft">{c.links.length ? `used ${c.links.length}×` : 'unused'} · {fmtSize(c.size)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                <button disabled={busy} onClick={() => setChanging(null)} className="ad-btn-ghost">Cancel</button>
                <button disabled={busy || !chosen || !writable} className="ad-btn" onClick={applyLibrary}>
                  {busy ? 'Applying…' : chosen ? `Use ${chosen.filename}` : 'Pick a file'}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="ad-mut" style={{ fontSize: 13, marginBottom: 10 }}>
                Upload a {changing.media.relPath.split('.').pop()?.toUpperCase()} file — it replaces this spot immediately and the old version is archived.
              </p>
              <input ref={fileRef} type="file" accept={changing.media.kind === 'video' ? 'video/*' : 'image/*'} className="ad-input" style={{ padding: 8 }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                <button disabled={busy} onClick={() => setChanging(null)} className="ad-btn-ghost">Cancel</button>
                <button disabled={busy || !writable} className="ad-btn"
                  onClick={() => { const f = fileRef.current?.files?.[0]; if (f) applyUpload(f) }}>
                  {busy ? 'Uploading…' : 'Upload & apply'}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  )
}
