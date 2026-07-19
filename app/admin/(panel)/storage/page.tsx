'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Trash2, Lock, Upload, Film, Image as ImageIcon } from 'lucide-react'

type Media = {
  id: number; filename: string; relPath: string; kind: 'photo' | 'video'
  size: number; addedAt: string; modifiedAt: string
  links: { file: string; label: string; line: number }[]
}

type SortKey = 'addedAt' | 'modifiedAt' | 'size' | 'filename'
type GroupKey = 'none' | 'addedAt' | 'modifiedAt'

const fmtSize = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`
const dayOf = (iso: string) => new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

export default function StoragePage() {
  const [media, setMedia] = useState<Media[]>([])
  const [tab, setTab] = useState<'photo' | 'video'>('photo')
  const [sortKey, setSortKey] = useState<SortKey>('addedAt')
  const [dir, setDir] = useState<'desc' | 'asc'>('desc')
  const [group, setGroup] = useState<GroupKey>('none')
  const [confirmDel, setConfirmDel] = useState<Media | null>(null)
  const [blocked, setBlocked] = useState<{ msg: string; links: { label: string }[] } | null>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => fetch('/api/admin/media').then((r) => r.json()).then((d) => setMedia(d.media || []))
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const list = media.filter((m) => m.kind === tab)
    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'size') cmp = a.size - b.size
      else if (sortKey === 'filename') cmp = a.filename.localeCompare(b.filename)
      else cmp = new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime()
      return dir === 'asc' ? cmp : -cmp
    })
    return list
  }, [media, tab, sortKey, dir])

  const groups = useMemo(() => {
    if (group === 'none') return [{ title: '', items: filtered }]
    const map = new Map<string, Media[]>()
    for (const m of filtered) {
      const k = dayOf(m[group])
      map.set(k, [...(map.get(k) ?? []), m])
    }
    return [...map.entries()].map(([title, items]) => ({ title, items }))
  }, [filtered, group])

  async function doDelete(m: Media) {
    setBusy(true)
    const res = await fetch(`/api/admin/media/${m.id}`, { method: 'DELETE' })
    const data = await res.json()
    setBusy(false)
    setConfirmDel(null)
    if (res.status === 409) {
      setBlocked({ msg: data.error, links: data.links || [] })
    } else if (!res.ok) {
      setBlocked({ msg: data.error || 'Delete failed.', links: [] })
    } else {
      load()
    }
  }

  async function doUpload(f: File) {
    setBusy(true)
    const fd = new FormData()
    fd.append('file', f)
    await fetch('/api/admin/media', { method: 'POST', body: fd })
    setBusy(false)
    load()
  }

  const totals = {
    photo: media.filter((m) => m.kind === 'photo').length,
    video: media.filter((m) => m.kind === 'video').length,
    bytes: media.reduce((s, m) => s + m.size, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Storage</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {totals.photo} photos · {totals.video} videos · {fmtSize(totals.bytes)} total. Files linked on the live site are protected from deletion.
          </p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = '' }} />
          <button onClick={() => fileRef.current?.click()} disabled={busy}
            className="flex items-center gap-2 text-sm bg-white text-black font-semibold rounded-lg px-4 py-2 hover:bg-neutral-200 disabled:opacity-50">
            <Upload className="w-4 h-4" /> {busy ? 'Working…' : 'Upload media'}
          </button>
        </div>
      </div>

      {/* Tabs + filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex rounded-lg border border-neutral-700 overflow-hidden">
          {(['photo', 'video'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 text-sm ${tab === t ? 'bg-white text-black font-semibold' : 'text-neutral-300 hover:bg-neutral-900'}`}>
              {t === 'photo' ? <ImageIcon className="w-4 h-4" /> : <Film className="w-4 h-4" />}
              {t === 'photo' ? `Photos (${totals.photo})` : `Videos (${totals.video})`}
            </button>
          ))}
        </div>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm">
          <option value="addedAt">Sort: Date added</option>
          <option value="modifiedAt">Sort: Date modified</option>
          <option value="size">Sort: File size</option>
          <option value="filename">Sort: Name</option>
        </select>
        <select value={dir} onChange={(e) => setDir(e.target.value as 'asc' | 'desc')}
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <select value={group} onChange={(e) => setGroup(e.target.value as GroupKey)}
          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm">
          <option value="none">Group: None</option>
          <option value="addedAt">Group: Date added</option>
          <option value="modifiedAt">Group: Date modified</option>
        </select>
      </div>

      {/* Gallery */}
      {groups.map((g) => (
        <div key={g.title || 'all'}>
          {g.title && <div className="text-sm font-semibold text-neutral-400 mb-3">{g.title}</div>}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {g.items.map((m) => {
              const isLinked = m.links.length > 0
              return (
                <div key={m.id} className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="aspect-square bg-black flex items-center justify-center">
                    {m.kind === 'video'
                      ? <video src={m.relPath} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                      : /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={m.relPath} alt={m.filename} loading="lazy" className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-2.5">
                    <div className="text-xs font-medium truncate">{m.filename}</div>
                    <div className="text-[11px] text-neutral-500">{fmtSize(m.size)} · {new Date(m.addedAt).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => isLinked
                      ? setBlocked({ msg: `"${m.filename}" is linked on the production site and can't be deleted. Replace it from Manage Media instead.`, links: m.links })
                      : setConfirmDel(m)}
                    title={isLinked ? 'Linked on the live site — deletion blocked' : 'Delete'}
                    className={`absolute top-2 right-2 p-2 rounded-lg transition ${
                      isLinked
                        ? 'bg-neutral-800/90 text-neutral-500 cursor-not-allowed'
                        : 'bg-red-600/90 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500'
                    }`}>
                    {isLinked ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                  {isLinked && (
                    <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-emerald-900/90 text-emerald-300 px-2 py-0.5 rounded">
                      Live
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          {g.items.length === 0 && <p className="text-sm text-neutral-500">Nothing here yet.</p>}
        </div>
      ))}

      {/* Confirm delete */}
      {confirmDel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setConfirmDel(null)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-bold">Delete {confirmDel.filename}?</div>
            <p className="text-sm text-neutral-400">This permanently removes the file from storage. This can&apos;t be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDel(null)} className="text-sm px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800">Cancel</button>
              <button disabled={busy} onClick={() => doDelete(confirmDel)} className="text-sm px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 disabled:opacity-50">
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked error popup */}
      {blocked && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setBlocked(null)}>
          <div className="bg-neutral-900 border border-red-900 rounded-2xl p-6 w-full max-w-md space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-bold text-red-400">Can&apos;t delete — file is in use</div>
            <p className="text-sm text-neutral-300">{blocked.msg}</p>
            {blocked.links.length > 0 && (
              <ul className="text-sm text-neutral-400 list-disc pl-5 space-y-1">
                {blocked.links.map((l, i) => <li key={i}>{l.label}</li>)}
              </ul>
            )}
            <div className="flex justify-end">
              <button onClick={() => setBlocked(null)} className="text-sm px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200">Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
