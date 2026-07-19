'use client'

import { useEffect, useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'

type Bar = { pill: string; text: string; ctaLabel: string; ctaHref: string; contactHref: string }
type Announcement = { default: Bar; overrides: (Bar & { path: string })[] }
type Promo = {
  enabled: boolean; template: 'copy' | 'picture' | 'signup'
  title: string; body: string; imageUrl: string
  primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string
  delaySeconds: number; frequency: 'once-per-session' | 'every-visit'
}

const EMPTY_BAR: Bar & { path: string } = { path: '', pill: '', text: '', ctaLabel: '', ctaHref: '', contactHref: '' }

export default function AnnouncementsPage() {
  const [ann, setAnn] = useState<Announcement | null>(null)
  const [promo, setPromo] = useState<Promo | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/admin/settings?key=announcement').then((r) => r.json()).then((d) => d.value && setAnn(d.value))
    fetch('/api/admin/settings?key=promo_banner').then((r) => r.json()).then((d) => d.value && setPromo(d.value))
  }, [])

  async function save(key: string, value: unknown, msg: string) {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }),
    })
    setToast(res.ok ? msg : 'Save failed.')
    setTimeout(() => setToast(''), 4000)
  }

  const input = 'bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-neutral-400'

  const barFields = (bar: Bar, set: (patch: Partial<Bar>) => void, withPath?: { path: string; setPath: (p: string) => void }) => (
    <div className="grid md:grid-cols-2 gap-3">
      {withPath && (
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs text-neutral-400">Page path (e.g. /services/social)</label>
          <input className={input} value={withPath.path} onChange={(e) => withPath.setPath(e.target.value)} />
        </div>
      )}
      <div className="space-y-1"><label className="text-xs text-neutral-400">Pill label</label>
        <input className={input} value={bar.pill} onChange={(e) => set({ pill: e.target.value })} /></div>
      <div className="space-y-1"><label className="text-xs text-neutral-400">CTA label</label>
        <input className={input} value={bar.ctaLabel} onChange={(e) => set({ ctaLabel: e.target.value })} /></div>
      <div className="space-y-1 md:col-span-2"><label className="text-xs text-neutral-400">Copy — use **double asterisks** for bold</label>
        <input className={input} value={bar.text} onChange={(e) => set({ text: e.target.value })} /></div>
      <div className="space-y-1"><label className="text-xs text-neutral-400">CTA link</label>
        <input className={input} value={bar.ctaHref} onChange={(e) => set({ ctaHref: e.target.value })} /></div>
      <div className="space-y-1"><label className="text-xs text-neutral-400">Contact button link</label>
        <input className={input} value={bar.contactHref} onChange={(e) => set({ contactHref: e.target.value })} /></div>
    </div>
  )

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Announcements & Banners</h1>
        <p className="text-sm text-neutral-400 mt-1">The black top bar copy across the site, plus optional promo pop-up banners.</p>
      </div>

      {toast && <div className="text-sm rounded-lg px-4 py-3 border bg-emerald-950/50 border-emerald-800 text-emerald-300">{toast}</div>}

      {/* ---- Announcement bar ---- */}
      {ann && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Top announcement bar</h2>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
            <div className="text-xs uppercase tracking-widest text-neutral-400">Default (all pages)</div>
            {barFields(ann.default, (p) => setAnn({ ...ann, default: { ...ann.default, ...p } }))}
          </div>

          {ann.overrides.map((o, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-neutral-400">Override — {o.path || 'new page'}</div>
                <button onClick={() => setAnn({ ...ann, overrides: ann.overrides.filter((_, j) => j !== i) })}
                  className="text-neutral-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
              {barFields(
                o,
                (p) => setAnn({ ...ann, overrides: ann.overrides.map((x, j) => (j === i ? { ...x, ...p } : x)) }),
                { path: o.path, setPath: (path) => setAnn({ ...ann, overrides: ann.overrides.map((x, j) => (j === i ? { ...x, path } : x)) }) }
              )}
            </div>
          ))}

          <div className="flex gap-3">
            <button onClick={() => setAnn({ ...ann, overrides: [...ann.overrides, { ...EMPTY_BAR }] })}
              className="flex items-center gap-2 text-sm border border-neutral-700 rounded-lg px-4 py-2 hover:bg-neutral-900">
              <Plus className="w-4 h-4" /> Add page override
            </button>
            <button onClick={() => save('announcement', ann, 'Announcement bar saved — live within a minute.')}
              className="flex items-center gap-2 text-sm bg-white text-black font-semibold rounded-lg px-4 py-2 hover:bg-neutral-200">
              <Save className="w-4 h-4" /> Save announcement bar
            </button>
          </div>
        </section>
      )}

      {/* ---- Promo banner ---- */}
      {promo && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Promo pop-up banner</h2>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={promo.enabled} onChange={(e) => setPromo({ ...promo, enabled: e.target.checked })} />
              <span className={promo.enabled ? 'text-emerald-400 font-semibold' : 'text-neutral-400'}>
                {promo.enabled ? 'Live on site' : 'Off'}
              </span>
            </label>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-4">
            <div className="flex gap-2">
              {([
                ['copy', 'Simple copy'],
                ['picture', 'Picture + buttons'],
                ['signup', 'Sign-up form'],
              ] as const).map(([k, label]) => (
                <button key={k} onClick={() => setPromo({ ...promo, template: k })}
                  className={`text-sm px-3 py-1.5 rounded-full border ${promo.template === k ? 'bg-white text-black border-white font-semibold' : 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2"><label className="text-xs text-neutral-400">Title</label>
                <input className={input} value={promo.title} onChange={(e) => setPromo({ ...promo, title: e.target.value })} /></div>
              <div className="space-y-1 md:col-span-2"><label className="text-xs text-neutral-400">Body copy</label>
                <textarea rows={2} className={input} value={promo.body} onChange={(e) => setPromo({ ...promo, body: e.target.value })} /></div>
              {promo.template === 'picture' && (
                <div className="space-y-1 md:col-span-2"><label className="text-xs text-neutral-400">Image URL (upload in Storage first, e.g. /uploads/promo.jpg)</label>
                  <input className={input} value={promo.imageUrl} onChange={(e) => setPromo({ ...promo, imageUrl: e.target.value })} /></div>
              )}
              <div className="space-y-1"><label className="text-xs text-neutral-400">{promo.template === 'signup' ? 'Submit button label' : 'Primary button label'}</label>
                <input className={input} value={promo.primaryLabel} onChange={(e) => setPromo({ ...promo, primaryLabel: e.target.value })} /></div>
              {promo.template !== 'signup' && (
                <div className="space-y-1"><label className="text-xs text-neutral-400">Primary button link</label>
                  <input className={input} value={promo.primaryHref} onChange={(e) => setPromo({ ...promo, primaryHref: e.target.value })} /></div>
              )}
              {promo.template === 'picture' && (
                <>
                  <div className="space-y-1"><label className="text-xs text-neutral-400">Secondary button label (optional)</label>
                    <input className={input} value={promo.secondaryLabel} onChange={(e) => setPromo({ ...promo, secondaryLabel: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-xs text-neutral-400">Secondary button link</label>
                    <input className={input} value={promo.secondaryHref} onChange={(e) => setPromo({ ...promo, secondaryHref: e.target.value })} /></div>
                </>
              )}
              <div className="space-y-1"><label className="text-xs text-neutral-400">Show after (seconds)</label>
                <input type="number" min={0} className={input} value={promo.delaySeconds}
                  onChange={(e) => setPromo({ ...promo, delaySeconds: Number(e.target.value) })} /></div>
              <div className="space-y-1"><label className="text-xs text-neutral-400">Frequency</label>
                <select className={input} value={promo.frequency} onChange={(e) => setPromo({ ...promo, frequency: e.target.value as Promo['frequency'] })}>
                  <option value="once-per-session">Once per visit session</option>
                  <option value="every-visit">Every page load</option>
                </select></div>
            </div>
            <p className="text-xs text-neutral-500">Sign-up form submissions land in Leads automatically, tagged “promo-banner”.</p>
            <button onClick={() => save('promo_banner', promo, promo.enabled ? 'Promo banner saved and LIVE.' : 'Promo banner saved (currently off).')}
              className="flex items-center gap-2 text-sm bg-white text-black font-semibold rounded-lg px-4 py-2 hover:bg-neutral-200">
              <Save className="w-4 h-4" /> Save promo banner
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
