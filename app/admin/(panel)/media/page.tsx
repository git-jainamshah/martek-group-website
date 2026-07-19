'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from 'react'
import { RefreshCw, Upload, MapPin, FolderOpen, Film, Image as ImageIcon } from 'lucide-react'
import { Modal } from '@/components/admin/ui'

type Media = {
  id: number; filename: string; relPath: string; kind: 'photo' | 'video'
  size: number; addedAt: string; modifiedAt: string
  links: { file: string; label: string; line: number }[]
}

const fmtSize = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`

/** Sort weight so "every page" items appear first, then pages alphabetically. */
const groupWeight = (label: string) => (label.includes('every page') ? 0 : 1)

export default function ManageMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [writable, setWritable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [replacing, setReplacing] = useState<Media | null>(null)
  const [mode, setMode] = useState<'upload' | 'library'>('upload')
  const [chosen, setChosen] = useState<Media | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState<'all' | 'photo' | 'video'>('all')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/media').then((r) => r.json()).then((d) => {
      setMedia(d.media || [])
      setWritable(d.storageWritable !== false)
    }).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const linked = useMemo(
    () => media.filter((m) => m.links.length > 0 && (tab === 'all' || m.kind === tab)),
    [media, tab]
  )
  const counts = useMemo(() => ({
    photo: media.filter((m) => m.links.length && m.kind === 'photo').length,
    video: media.filter((m) => m.links.length && m.kind === 'video').length,
  }), [media])

  /** Library candidates: unlinked, same kind and same file format as the slot. */
  const libraryChoices = useMemo(() => {
    if (!replacing) return []
    const ext = replacing.relPath.split('.').pop()?.toLowerCase()
    return media.filter((m) =>
      m.links.length === 0 && m.kind === replacing.kind &&
      m.relPath.split('.').pop()?.toLowerCase() === ext && m.id !== replacing.id
    )
  }, [media, replacing])

  function flash(kind: 'ok' | 'err', msg: string) {
    setToast({ kind, msg })
    setTimeout(() => setToast(null), 6000)
  }

  async function doUploadReplace(file: File) {
    if (!replacing) return
    setBusy(true)
    const fd = new FormData()
    fd.append('targetPath', replacing.relPath)
    fd.append('file', file)
    const res = await fetch('/api/admin/media/replace', { method: 'POST', body: fd })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) return flash('err', data.error || 'Replace failed.')
    flash('ok', `Replaced ${replacing.filename} everywhere it appears. Previous version archived.`)
    setReplacing(null)
    load()
  }

  async function doLibraryReplace() {
    if (!replacing || !chosen) return
    setBusy(true)
    const res = await fetch('/api/admin/media/replace-with', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetPath: replacing.relPath, sourceId: chosen.id }),
    })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) return flash('err', data.error || 'Replace failed.')
    flash('ok', `Swapped in ${chosen.filename} — live everywhere ${replacing.filename} appears.`)
    setReplacing(null)
    setChosen(null)
    load()
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="ad-kicker">Content</div>
          <h1>Manage <span className="it">media</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 8, maxWidth: 560 }}>
            Everything that&apos;s live on the site and where it appears. Replacing keeps the same link,
            so the change shows up everywhere instantly — the old file is archived automatically.
          </p>
        </div>
        <button onClick={load} className="ad-btn-ghost"><RefreshCw size={15} /> Rescan site</button>
      </div>

      {toast && <div className={`ad-alert ${toast.kind}`} style={{ marginBottom: 16 }}>{toast.msg}</div>}

      <div className="ad-tabs" style={{ marginBottom: 20 }}>
        <button className={`ad-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All ({counts.photo + counts.video})</button>
        <button className={`ad-tab ${tab === 'photo' ? 'active' : ''}`} onClick={() => setTab('photo')}><ImageIcon size={14} /> Pictures ({counts.photo})</button>
        <button className={`ad-tab ${tab === 'video' ? 'active' : ''}`} onClick={() => setTab('video')}><Film size={14} /> Videos ({counts.video})</button>
      </div>

      {loading ? (
        <p className="ad-mut" style={{ fontSize: 14 }}>Scanning the site for linked media…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {linked.map((m) => {
            const labels = [...new Set(m.links.map((l) => l.label))].sort((a, b) => groupWeight(a) - groupWeight(b) || a.localeCompare(b))
            return (
              <div key={m.id} className="ad-card" style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 168, height: 100, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.kind === 'video'
                    ? <video src={m.relPath} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline preload="metadata" />
                    : <img src={m.relPath} alt={m.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <b style={{ fontSize: 15 }}>{m.filename}</b>
                    <span className="ad-badge grey">{m.kind === 'video' ? 'Video' : 'Picture'}</span>
                    <span className="ad-soft" style={{ fontSize: 12 }}>{fmtSize(m.size)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                    {labels.map((label) => (
                      <span key={label} className="ad-chip"><MapPin size={12} /> {label}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setReplacing(m); setMode('upload'); setChosen(null) }} className="ad-btn">
                  <Upload size={15} /> Replace
                </button>
              </div>
            )
          })}
          {linked.length === 0 && <p className="ad-mut" style={{ fontSize: 14 }}>No linked media in this view.</p>}
        </div>
      )}

      {replacing && (
        <Modal wide onClose={() => !busy && setReplacing(null)}>
          <h3>Replace {replacing.filename}</h3>
          <p className="ad-mut" style={{ fontSize: 13.5, marginBottom: 8 }}>
            Appears in: {[...new Set(replacing.links.map((l) => l.label))].join(' · ')}
          </p>
          {!writable && (
            <div className="ad-alert err" style={{ marginBottom: 14 }}>
              File storage is read-only on this deployment — replacements work on a persistent server or after the Blob storage upgrade.
            </div>
          )}
          <div className="ad-tabs" style={{ margin: '10px 0 18px' }}>
            <button className={`ad-tab ${mode === 'upload' ? 'active' : ''}`} onClick={() => setMode('upload')}><Upload size={14} /> Upload new</button>
            <button className={`ad-tab ${mode === 'library' ? 'active' : ''}`} onClick={() => setMode('library')}><FolderOpen size={14} /> Choose from Storage</button>
          </div>

          {mode === 'upload' ? (
            <div>
              <p className="ad-mut" style={{ fontSize: 13.5, marginBottom: 12 }}>
                Upload a new <b>{replacing.relPath.split('.').pop()?.toUpperCase()}</b> {replacing.kind === 'video' ? 'video' : 'picture'}. It goes live at the same link, so every page updates immediately.
              </p>
              <input ref={fileRef} type="file" accept={replacing.kind === 'video' ? 'video/*' : 'image/*'} className="ad-input" style={{ padding: 8 }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
                <button disabled={busy} onClick={() => setReplacing(null)} className="ad-btn-ghost">Cancel</button>
                <button disabled={busy || !writable} className="ad-btn"
                  onClick={() => { const f = fileRef.current?.files?.[0]; if (f) doUploadReplace(f) }}>
                  {busy ? 'Uploading…' : 'Replace file'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="ad-mut" style={{ fontSize: 13.5, marginBottom: 12 }}>
                Pick from files already in Storage that aren&apos;t used anywhere on the site
                (same type & format only, so links keep working).
              </p>
              {libraryChoices.length === 0 ? (
                <p className="ad-soft" style={{ fontSize: 13.5 }}>
                  No unused {replacing.kind === 'video' ? 'videos' : 'pictures'} in {replacing.relPath.split('.').pop()?.toUpperCase()} format.
                  Upload one to Storage first, then come back here.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                  {libraryChoices.map((c) => (
                    <button key={c.id} onClick={() => setChosen(c)} className="ad-tile"
                      style={{ cursor: 'pointer', outline: chosen?.id === c.id ? '3px solid var(--brand)' : 'none', border: chosen?.id === c.id ? '1px solid var(--brand)' : undefined, padding: 0 }}>
                      <div className="ad-thumb" style={{ aspectRatio: '4/3' }}>
                        {c.kind === 'video'
                          ? <video src={c.relPath} muted playsInline preload="metadata" />
                          : <img src={c.relPath} alt={c.filename} loading="lazy" />}
                      </div>
                      <div style={{ padding: '7px 9px', fontSize: 11.5, textAlign: 'left' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{c.filename}</div>
                        <div className="ad-soft">{fmtSize(c.size)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
                <button disabled={busy} onClick={() => setReplacing(null)} className="ad-btn-ghost">Cancel</button>
                <button disabled={busy || !chosen || !writable} className="ad-btn" onClick={doLibraryReplace}>
                  {busy ? 'Swapping…' : chosen ? `Use ${chosen.filename}` : 'Pick a file'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
