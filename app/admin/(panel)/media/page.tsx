'use client'

import { useEffect, useRef, useState } from 'react'
import { RefreshCw, Upload, MapPin } from 'lucide-react'

type Media = {
  id: number; filename: string; relPath: string; kind: 'photo' | 'video'
  size: number; addedAt: string; modifiedAt: string
  links: { file: string; label: string; line: number }[]
}

const fmtSize = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`

export default function ManageMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [replacing, setReplacing] = useState<Media | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/admin/media').then((r) => r.json()).then((d) => setMedia(d.media || [])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const linked = media.filter((m) => m.links.length > 0)

  async function doReplace(file: File) {
    if (!replacing) return
    setBusy(true)
    const fd = new FormData()
    fd.append('targetPath', replacing.relPath)
    fd.append('file', file)
    const res = await fetch('/api/admin/media/replace', { method: 'POST', body: fd })
    const data = await res.json()
    setBusy(false)
    if (!res.ok) {
      setToast({ kind: 'err', msg: data.error || 'Replace failed.' })
    } else {
      setToast({ kind: 'ok', msg: `Replaced ${replacing.filename} everywhere it's used. Previous version archived.` })
      setReplacing(null)
      load()
    }
    setTimeout(() => setToast(null), 6000)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Media</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Every media file that&apos;s live on the site, and exactly where it&apos;s linked. Replacing a file updates it everywhere instantly — the old version is archived.
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm border border-neutral-700 rounded-lg px-3 py-2 hover:bg-neutral-900">
          <RefreshCw className="w-4 h-4" /> Rescan site
        </button>
      </div>

      {toast && (
        <div className={`text-sm rounded-lg px-4 py-3 border ${toast.kind === 'ok' ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300' : 'bg-red-950/50 border-red-900 text-red-300'}`}>
          {toast.msg}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Scanning site for linked media…</p>
      ) : (
        <div className="space-y-4">
          {linked.map((m) => (
            <div key={m.id} className="flex gap-5 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="w-40 h-24 shrink-0 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                {m.kind === 'video'
                  ? <video src={m.relPath} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                  : /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={m.relPath} alt={m.filename} className="w-full h-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold truncate">{m.filename}</span>
                  <span className="text-xs text-neutral-500 uppercase">{m.kind}</span>
                  <span className="text-xs text-neutral-500">{fmtSize(m.size)}</span>
                </div>
                <div className="mt-2 space-y-1">
                  {m.links.map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-400">
                      <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                      <span>{l.label}</span>
                      <span className="text-neutral-600">({l.file}:{l.line})</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 self-center">
                <button onClick={() => setReplacing(m)}
                  className="flex items-center gap-2 text-sm bg-white text-black font-semibold rounded-lg px-3 py-2 hover:bg-neutral-200">
                  <Upload className="w-4 h-4" /> Replace
                </button>
              </div>
            </div>
          ))}
          {linked.length === 0 && <p className="text-sm text-neutral-500">No linked media found on the site.</p>}
        </div>
      )}

      {/* Replace modal */}
      {replacing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => !busy && setReplacing(null)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-bold">Replace {replacing.filename}</div>
            <p className="text-sm text-neutral-400">
              Upload a new <b>{replacing.relPath.split('.').pop()?.toUpperCase()}</b> file. It will go live at the same URL, so every page linking it updates immediately. The current version is archived automatically.
            </p>
            <input ref={fileRef} type="file" accept={replacing.kind === 'video' ? 'video/*' : 'image/*'}
              className="block w-full text-sm text-neutral-300 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:text-black file:px-3 file:py-2 file:text-sm file:font-semibold" />
            <div className="flex gap-3 justify-end">
              <button disabled={busy} onClick={() => setReplacing(null)} className="text-sm px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800">Cancel</button>
              <button disabled={busy} onClick={() => { const f = fileRef.current?.files?.[0]; if (f) doReplace(f) }}
                className="text-sm px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 disabled:opacity-50">
                {busy ? 'Uploading…' : 'Replace file'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
