'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, GripVertical, Pencil } from 'lucide-react'

type TM = { id: number; provider: string; container_id: string; environment: string; enabled: number }
type Script = {
  id: number; title: string; code: string; location: string
  timing: string; sort_order: number; enabled: number; environment: string
}

const ENVS = ['production', 'qa', 'dev'] as const
const LOCATIONS = [
  { key: 'head', label: 'Site-wide header (<head>)' },
  { key: 'body', label: 'Body start' },
  { key: 'footer', label: 'Footer (before </body>)' },
] as const

export default function AnalyticsSeoPage() {
  // ---- tag managers ----
  const [tms, setTms] = useState<TM[]>([])
  const [tmForm, setTmForm] = useState({ provider: 'gtm', containerId: '', environment: 'production' })
  // ---- scripts ----
  const [scripts, setScripts] = useState<Script[]>([])
  const [editing, setEditing] = useState<Partial<Script> | null>(null)
  const [dragId, setDragId] = useState<number | null>(null)
  // ---- seo settings ----
  const [robots, setRobots] = useState<{ extraDisallow: string[]; extraRules: string }>({ extraDisallow: [], extraRules: '' })
  const [seo, setSeo] = useState<{ siteUrl: string; googleVerification: string; bingVerification: string }>({ siteUrl: '', googleVerification: '', bingVerification: '' })
  const [toast, setToast] = useState('')
  const [err, setErr] = useState('')

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 4000) }
  const fail = (m: string) => { setErr(m); setTimeout(() => setErr(''), 6000) }

  const loadAll = () => {
    fetch('/api/admin/tag-managers').then((r) => r.json()).then((d) => setTms(d.tagManagers || []))
    fetch('/api/admin/scripts').then((r) => r.json()).then((d) => setScripts(d.scripts || []))
    fetch('/api/admin/settings?key=robots_txt').then((r) => r.json()).then((d) => d.value && setRobots(d.value))
    fetch('/api/admin/settings?key=seo').then((r) => r.json()).then((d) => d.value && setSeo({ siteUrl: '', googleVerification: '', bingVerification: '', ...d.value }))
  }
  useEffect(loadAll, [])

  async function addTm() {
    const res = await fetch('/api/admin/tag-managers', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tmForm),
    })
    const d = await res.json()
    if (!res.ok) return fail(d.error)
    setTmForm({ ...tmForm, containerId: '' })
    flash('Tag manager linked.')
    loadAll()
  }

  async function saveScript() {
    if (!editing) return
    const isNew = !editing.id
    const res = await fetch(isNew ? '/api/admin/scripts' : `/api/admin/scripts/${editing.id}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editing.title, code: editing.code,
        location: editing.location || 'head', timing: editing.timing || 'after_tm',
        environment: editing.environment || 'all', enabled: editing.enabled !== 0,
      }),
    })
    const d = await res.json()
    if (!res.ok) return fail(d.error)
    setEditing(null)
    flash('Script saved.')
    loadAll()
  }

  function onDrop(target: Script) {
    if (dragId === null || dragId === target.id) return
    const inLoc = scripts.filter((s) => s.location === target.location)
    const others = scripts.filter((s) => s.location !== target.location)
    const dragged = inLoc.find((s) => s.id === dragId)
    if (!dragged) return
    const rest = inLoc.filter((s) => s.id !== dragId)
    const idx = rest.findIndex((s) => s.id === target.id)
    rest.splice(idx, 0, dragged)
    setScripts([...others, ...rest.map((s, i) => ({ ...s, sort_order: i }))])
    fetch('/api/admin/scripts', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: target.location, ids: rest.map((s) => s.id) }),
    }).then(() => flash('Load order updated.'))
    setDragId(null)
  }

  async function saveSetting(key: string, value: unknown, msg: string) {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }),
    })
    if (res.ok) flash(msg); else fail('Save failed.')
  }

  const input = 'ad-input'

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics & SEO</h1>
        <p className="text-sm ad-mut mt-1">
          Tag managers, custom scripts, and site-level SEO. Only linked tag managers ever load — if Tealium isn&apos;t linked, nothing Tealium-related is even requested.
        </p>
      </div>

      {toast && <div className="ad-alert ok">{toast}</div>}
      {err && <div className="ad-alert err">{err}</div>}

      {/* ---- Tag managers ---- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Tag managers</h2>
        {ENVS.map((env) => (
          <div key={env} className="ad-card">
            <div className="text-xs uppercase tracking-widest ad-mut mb-3">{env}</div>
            {tms.filter((t) => t.environment === env).map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2 border-b border-[#E2D9C4] last:border-0">
                <span className="text-sm font-semibold uppercase w-20">{t.provider}</span>
                <code className="text-sm text-[#2B2B30] flex-1">{t.container_id}</code>
                <label className="flex items-center gap-2 text-xs ad-mut">
                  <input type="checkbox" checked={!!t.enabled}
                    onChange={async (e) => {
                      await fetch(`/api/admin/tag-managers/${t.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: e.target.checked }) })
                      loadAll()
                    }} />
                  enabled
                </label>
                <button onClick={async () => { await fetch(`/api/admin/tag-managers/${t.id}`, { method: 'DELETE' }); loadAll() }}
                  className="ad-soft hover:text-[#C8141B]"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {tms.filter((t) => t.environment === env).length === 0 && (
              <p className="text-xs ad-soft">No tag managers linked to {env} — none will load there.</p>
            )}
          </div>
        ))}
        <div className="flex gap-3 items-end flex-wrap ad-card">
          <div className="space-y-1">
            <label className="text-xs ad-mut">Provider</label>
            <select className={input} value={tmForm.provider} onChange={(e) => setTmForm({ ...tmForm, provider: e.target.value })}>
              <option value="gtm">Google Tag Manager</option>
              <option value="tealium">Tealium iQ</option>
            </select>
          </div>
          <div className="space-y-1 flex-1 min-w-48">
            <label className="text-xs ad-mut">{tmForm.provider === 'gtm' ? 'Container ID (GTM-XXXXXXX)' : 'account/profile/env (e.g. martek/main/prod)'}</label>
            <input className={`${input} w-full`} value={tmForm.containerId} onChange={(e) => setTmForm({ ...tmForm, containerId: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs ad-mut">Environment</label>
            <select className={input} value={tmForm.environment} onChange={(e) => setTmForm({ ...tmForm, environment: e.target.value })}>
              {ENVS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <button onClick={addTm} className="ad-btn">
            <Plus className="w-4 h-4" /> Link
          </button>
        </div>
      </section>

      {/* ---- Custom scripts ---- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Custom scripts</h2>
            <p className="text-xs ad-soft mt-0.5">Drag to set load order within each placement. Each script can fire before or right after the tag managers.</p>
          </div>
          <button onClick={() => setEditing({ location: 'head', timing: 'after_tm', environment: 'all', enabled: 1 })}
            className="ad-btn">
            <Plus className="w-4 h-4" /> Add script
          </button>
        </div>
        {LOCATIONS.map((loc) => {
          const rows = scripts.filter((s) => s.location === loc.key).sort((a, b) => a.sort_order - b.sort_order)
          return (
            <div key={loc.key} className="ad-card">
              <div className="text-xs uppercase tracking-widest ad-mut mb-3">{loc.label}</div>
              {rows.map((s) => (
                <div key={s.id} draggable
                  onDragStart={() => setDragId(s.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(s)}
                  className={`flex items-center gap-3 py-2 border-b border-[#E2D9C4] last:border-0 cursor-grab ${dragId === s.id ? 'opacity-40' : ''}`}>
                  <GripVertical className="w-4 h-4 ad-soft" />
                  <span className="text-sm font-medium flex-1">{s.title}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${s.timing === 'before_tm' ? 'border-amber-700 text-[#8a6116]' : 'border-[#C9BEA3] ad-mut'}`}>
                    {s.timing === 'before_tm' ? 'before tag managers' : 'after tag managers'}
                  </span>
                  <span className="text-[11px] ad-soft">{s.environment}</span>
                  <label className="flex items-center gap-1.5 text-xs ad-mut">
                    <input type="checkbox" checked={!!s.enabled}
                      onChange={async (e) => {
                        await fetch(`/api/admin/scripts/${s.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: e.target.checked }) })
                        loadAll()
                      }} />
                    on
                  </label>
                  <button onClick={() => setEditing(s)} className="ad-soft hover:text-[#1A1A1E]"><Pencil className="w-4 h-4" /></button>
                  <button onClick={async () => { await fetch(`/api/admin/scripts/${s.id}`, { method: 'DELETE' }); loadAll() }}
                    className="ad-soft hover:text-[#C8141B]"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {rows.length === 0 && <p className="text-xs ad-soft">No scripts here.</p>}
            </div>
          )
        })}
      </section>

      {/* ---- SEO ---- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">SEO & robots.txt</h2>
        <div className="ad-card space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs ad-mut">Google site verification token</label>
              <input className={`${input} w-full`} value={seo.googleVerification} onChange={(e) => setSeo({ ...seo, googleVerification: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs ad-mut">Bing site verification token</label>
              <input className={`${input} w-full`} value={seo.bingVerification} onChange={(e) => setSeo({ ...seo, bingVerification: e.target.value })} />
            </div>
          </div>
          <button onClick={() => saveSetting('seo', seo, 'SEO settings saved.')}
            className="ad-btn">Save SEO settings</button>
        </div>
        <div className="ad-card space-y-4">
          <div className="space-y-1">
            <label className="text-xs ad-mut">Extra robots.txt Disallow paths (one per line)</label>
            <textarea rows={3} className={`${input} w-full font-mono`} value={robots.extraDisallow.join('\n')}
              onChange={(e) => setRobots({ ...robots, extraDisallow: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })} />
            <p className="text-[11px] ad-soft">The admin panel is already hidden via auth + noindex headers and is deliberately not listed here (listing it would advertise it).</p>
          </div>
          <button onClick={() => saveSetting('robots_txt', robots, 'robots.txt updated.')}
            className="ad-btn">Save robots.txt</button>
        </div>
      </section>

      {/* ---- Script editor modal ---- */}
      {editing && (
        <div className="ad-overlay" onClick={() => setEditing(null)}>
          <div className="ad-modal p-6 w-full max-w-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-bold">{editing.id ? 'Edit script' : 'Add script'}</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs ad-mut">Script title</label>
                <input className={`${input} w-full`} value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="e.g. Hotjar tracking" />
              </div>
              <div className="space-y-1">
                <label className="text-xs ad-mut">Placement</label>
                <select className={`${input} w-full`} value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })}>
                  {LOCATIONS.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs ad-mut">Timing vs tag managers</label>
                <select className={`${input} w-full`} value={editing.timing} onChange={(e) => setEditing({ ...editing, timing: e.target.value })}>
                  <option value="before_tm">Fire BEFORE tag managers</option>
                  <option value="after_tm">Fire right AFTER tag managers</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs ad-mut">Environment</label>
                <select className={`${input} w-full`} value={editing.environment} onChange={(e) => setEditing({ ...editing, environment: e.target.value })}>
                  <option value="all">All environments</option>
                  {ENVS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs ad-mut">Script code (raw JS or a full &lt;script&gt; tag)</label>
              <textarea rows={8} className={`${input} w-full font-mono text-xs`} value={editing.code || ''} onChange={(e) => setEditing({ ...editing, code: e.target.value })} />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditing(null)} className="ad-btn-ghost">Cancel</button>
              <button onClick={saveScript} className="ad-btn">Save script</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
