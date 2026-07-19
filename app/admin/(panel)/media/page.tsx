'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from 'react'
import { RefreshCw, Upload, FolderOpen, Replace } from 'lucide-react'
import { Modal, Section } from '@/components/admin/ui'
import { SLOT_DEFS, SlotDef } from '@/lib/media-slots'

type Media = {
  id: number; filename: string; relPath: string; kind: 'photo' | 'video'
  size: number; addedAt: string; modifiedAt: string
  links: { file: string; label: string; line: number }[]
}

const fmtSize = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`
const TRANSPARENT_EXTS = ['png', 'svg', 'webp', 'avif', 'gif']
const isTransparentCapable = (p: string) => TRANSPARENT_EXTS.includes(p.split('.').pop()?.toLowerCase() ?? '')

/** Pages in display order, derived from the slot registry. */
const PAGES = [...new Map(SLOT_DEFS.map((s) => [s.page, s.pageUrl])).entries()]

function Thumb({ path, kind, size = 78 }: { path: string; kind: 'photo' | 'video'; size?: number }) {
  return (
    <div className={isTransparentCapable(path) ? 'ad-checker' : ''}
      style={{ width: size * 1.66, height: size, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: isTransparentCapable(path) ? undefined : 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {kind === 'video'
        ? <video src={path} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline preload="metadata" />
        : <img src={path} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
    </div>
  )
}

export default function ManageMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [slots, setSlots] = useState<Record<string, string>>({})
  const [writable, setWritable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [changing, setChanging] = useState<SlotDef | null>(null)
  const [mode, setMode] = useState<'library' | 'upload'>('library')
  const [chosenPath, setChosenPath] = useState<string | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/media').then((r) => r.json()).then((d) => {
      setMedia(d.media || [])
      setSlots(d.slots || {})
      setWritable(d.storageWritable !== false)
    }).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const usageCount = useMemo(() => {
    const counts = new Map<string, number>()
    for (const def of SLOT_DEFS) {
      const v = slots[def.key] ?? def.defaultPath
      counts.set(v, (counts.get(v) ?? 0) + 1)
    }
    return counts
  }, [slots])

  /** Any media of the same kind - format doesn't matter, it's just a path. */
  const choices = useMemo(() => {
    if (!changing) return []
    return media.filter((m) => m.kind === changing.kind)
  }, [media, changing])

  function flash(kind: 'ok' | 'err', msg: string) {
    setToast({ kind, msg })
    setTimeout(() => setToast(null), 6000)
  }

  async function saveSlot(def: SlotDef, path: string) {
    setBusy(true)
    // store overrides only; setting back to default removes the override
    const overrides: Record<string, string> = {}
    for (const s of SLOT_DEFS) {
      const v = s.key === def.key ? path : (slots[s.key] ?? s.defaultPath)
      if (v !== s.defaultPath) overrides[s.key] = v
    }
    const res = await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'media_slots', value: overrides }),
    })
    setBusy(false)
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      return flash('err', d.error || 'Could not save.')
    }
    setSlots({ ...slots, [def.key]: path })
    setChanging(null); setChosenPath(null)
    flash('ok', `${def.page} - ${def.section} now uses ${path.split('/').pop()}. Live within a minute.`)
  }

  async function uploadAndAssign(def: SlotDef, file: File) {
    setBusy(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
    const d = await res.json()
    if (!res.ok) {
      setBusy(false)
      return flash('err', d.error || 'Upload failed.')
    }
    await saveSlot(def, d.relPath)
    load()
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>
        <div>
          <div className="ad-kicker">Content</div>
          <h1>Manage <span className="it">Media</span></h1>
          <p className="ad-mut" style={{ fontSize: 14, marginTop: 8, maxWidth: 580 }}>
            Every media spot on the site, page by page. Point any spot at any file from Storage -
            the same file can be used in as many places as you like, and changes are live within a minute.
          </p>
        </div>
        <button onClick={load} className="ad-btn-ghost"><RefreshCw size={15} /> Refresh</button>
      </div>

      {toast && <div className={`ad-alert ${toast.kind}`} style={{ marginBottom: 16 }}>{toast.msg}</div>}
      {loading && <p className="ad-mut" style={{ fontSize: 14 }}>Loading…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PAGES.map(([page, url], idx) => {
          const defs = SLOT_DEFS.filter((s) => s.page === page)
          return (
            <Section key={page} title={page} kicker={`Page URL: ${url}`}
              subtitle={`${defs.length} media spot${defs.length === 1 ? '' : 's'}`} defaultOpen={idx === 0}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {defs.map((def) => {
                  const current = slots[def.key] ?? def.defaultPath
                  const uses = usageCount.get(current) ?? 1
                  return (
                    <div key={def.key} style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', padding: '12px 0', borderBottom: '1px solid var(--rule)' }}>
                      <Thumb path={current} kind={def.kind} />
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <b style={{ fontSize: 14 }}>{def.section}</b>
                          <span className="ad-badge grey">{def.kind === 'video' ? 'Video' : 'Picture'}</span>
                        </div>
                        <div className="ad-soft" style={{ fontSize: 12, marginTop: 3 }}>
                          {current.split('/').pop()}
                          {uses > 1 && <span> · this file also serves {uses - 1} other spot{uses > 2 ? 's' : ''}</span>}
                        </div>
                      </div>
                      <button className="ad-btn" style={{ padding: '8px 16px', fontSize: 12.5 }}
                        onClick={() => { setChanging(def); setMode('library'); setChosenPath(null) }}>
                        <Replace size={14} /> Change
                      </button>
                    </div>
                  )
                })}
              </div>
            </Section>
          )
        })}
        <p className="ad-soft" style={{ fontSize: 12.5 }}>
          Site logos and the social sharing image are managed in Company Profile.
        </p>
      </div>

      {changing && (
        <Modal wide onClose={() => !busy && setChanging(null)}>
          <h3>{changing.page} - {changing.section}</h3>
          <p className="ad-mut" style={{ fontSize: 13, marginBottom: 12 }}>
            Currently: <b>{(slots[changing.key] ?? changing.defaultPath).split('/').pop()}</b>.
            Pick any {changing.kind === 'video' ? 'video' : 'picture'} - reuse is fine, a file can live in many spots.
          </p>
          <div className="ad-tabs" style={{ margin: '4px 0 16px' }}>
            <button className={`ad-tab ${mode === 'library' ? 'active' : ''}`} onClick={() => setMode('library')}><FolderOpen size={14} /> From Storage</button>
            <button className={`ad-tab ${mode === 'upload' ? 'active' : ''}`} onClick={() => setMode('upload')}><Upload size={14} /> Upload new</button>
          </div>

          {mode === 'library' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                {choices.map((c) => {
                  const selected = chosenPath === c.relPath
                  const isCurrent = (slots[changing.key] ?? changing.defaultPath) === c.relPath
                  return (
                    <button key={c.id} onClick={() => setChosenPath(c.relPath)} className="ad-tile"
                      style={{ cursor: 'pointer', padding: 0, outline: selected ? '3px solid var(--brand)' : 'none', opacity: isCurrent ? 0.55 : 1 }}>
                      <div className={`ad-thumb ${isTransparentCapable(c.relPath) ? 'ad-checker' : ''}`} style={{ aspectRatio: '4/3', background: isTransparentCapable(c.relPath) ? undefined : 'var(--ink)' }}>
                        {c.kind === 'video'
                          ? <video src={c.relPath} muted playsInline preload="metadata" />
                          : <img src={c.relPath} alt={c.filename} loading="lazy" style={{ objectFit: 'contain' }} />}
                      </div>
                      <div style={{ padding: '6px 8px', fontSize: 11, textAlign: 'left' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{c.filename}</div>
                        <div className="ad-soft">
                          {isCurrent ? 'current' : c.links.length ? `used ${c.links.length}x` : 'unused'} · {fmtSize(c.size)}
                        </div>
                      </div>
                    </button>
                  )
                })}
                {choices.length === 0 && <p className="ad-soft" style={{ fontSize: 13 }}>No {changing.kind === 'video' ? 'videos' : 'pictures'} in Storage yet.</p>}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                <button disabled={busy} onClick={() => setChanging(null)} className="ad-btn-ghost">Cancel</button>
                <button disabled={busy || !chosenPath} className="ad-btn"
                  onClick={() => chosenPath && saveSlot(changing, chosenPath)}>
                  {busy ? 'Saving…' : chosenPath ? `Use ${chosenPath.split('/').pop()}` : 'Pick a file'}
                </button>
              </div>
            </>
          ) : (
            <>
              {!writable && (
                <div className="ad-alert err" style={{ marginBottom: 12 }}>
                  Uploading new files needs writable storage (works on a persistent server, or after the Blob storage upgrade).
                  Re-pointing to existing Storage files works everywhere.
                </div>
              )}
              <input ref={fileRef} type="file" accept={changing.kind === 'video' ? 'video/*' : 'image/*'} className="ad-input" style={{ padding: 8 }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                <button disabled={busy} onClick={() => setChanging(null)} className="ad-btn-ghost">Cancel</button>
                <button disabled={busy || !writable} className="ad-btn"
                  onClick={() => { const f = fileRef.current?.files?.[0]; if (f) uploadAndAssign(changing, f) }}>
                  {busy ? 'Uploading…' : 'Upload & use here'}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  )
}
