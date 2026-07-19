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

  const input = 'ad-input'

  const barFields = (bar: Bar, set: (patch: Partial<Bar>) => void, withPath?: { path: string; setPath: (p: string) => void }) => (
    <div className="grid md:grid-cols-2 gap-3">
      {withPath && (
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs ad-mut">Page path (e.g. /services/social)</label>
          <input className={input} value={withPath.path} onChange={(e) => withPath.setPath(e.target.value)} />
        </div>
      )}
      <div className="space-y-1"><label className="text-xs ad-mut">Pill label</label>
        <input className={input} value={bar.pill} onChange={(e) => set({ pill: e.target.value })} /></div>
      <div className="space-y-1"><label className="text-xs ad-mut">CTA label</label>
        <input className={input} value={bar.ctaLabel} onChange={(e) => set({ ctaLabel: e.target.value })} /></div>
      <div className="space-y-1 md:col-span-2"><label className="text-xs ad-mut">Copy — use **double asterisks** for bold</label>
        <input className={input} value={bar.text} onChange={(e) => set({ text: e.target.value })} /></div>
      <div className="space-y-1"><label className="text-xs ad-mut">CTA link</label>
        <input className={input} value={bar.ctaHref} onChange={(e) => set({ ctaHref: e.target.value })} /></div>
      <div className="space-y-1"><label className="text-xs ad-mut">Contact button link</label>
        <input className={input} value={bar.contactHref} onChange={(e) => set({ contactHref: e.target.value })} /></div>
    </div>
  )

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Announcements & Banners</h1>
        <p className="text-sm ad-mut mt-1">The black top bar copy across the site, plus optional promo pop-up banners.</p>
      </div>

      {toast && <div className="ad-alert ok">{toast}</div>}

      {/* ---- Announcement bar ---- */}
      {ann && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Top announcement bar</h2>
          <div className="ad-card space-y-3">
            <div className="text-xs uppercase tracking-widest ad-mut">Default (all pages)</div>
            {barFields(ann.default, (p) => setAnn({ ...ann, default: { ...ann.default, ...p } }))}
          </div>

          {ann.overrides.map((o, i) => (
            <div key={i} className="ad-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest ad-mut">Override — {o.path || 'new page'}</div>
                <button onClick={() => setAnn({ ...ann, overrides: ann.overrides.filter((_, j) => j !== i) })}
                  className="ad-soft hover:text-[#C8141B]"><Trash2 className="w-4 h-4" /></button>
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
              className="flex items-center gap-2 text-sm border border-[#C9BEA3] rounded-lg px-4 py-2 hover:bg-[#F4EDDD]">
              <Plus className="w-4 h-4" /> Add page override
            </button>
            <button onClick={() => save('announcement', ann, 'Announcement bar saved — live within a minute.')}
              className="ad-btn">
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
              <span className={promo.enabled ? 'text-[#35624d] font-semibold' : 'ad-mut'}>
                {promo.enabled ? 'Live on site' : 'Off'}
              </span>
            </label>
          </div>
          <div className="ad-card space-y-4">
            <div className="flex gap-2">
              {([
                ['copy', 'Simple copy'],
                ['picture', 'Picture + buttons'],
                ['signup', 'Sign-up form'],
              ] as const).map(([k, label]) => (
                <button key={k} onClick={() => setPromo({ ...promo, template: k })}
                  className={`text-sm px-3 py-1.5 rounded-full border ${promo.template === k ? 'bg-white text-black border-white font-semibold' : 'border-[#C9BEA3] text-[#2B2B30] hover:bg-[#F4EDDD]'}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-1 md:col-span-2"><label className="text-xs ad-mut">Title</label>
                <input className={input} value={promo.title} onChange={(e) => setPromo({ ...promo, title: e.target.value })} /></div>
              <div className="space-y-1 md:col-span-2"><label className="text-xs ad-mut">Body copy</label>
                <textarea rows={2} className={input} value={promo.body} onChange={(e) => setPromo({ ...promo, body: e.target.value })} /></div>
              {promo.template === 'picture' && (
                <div className="space-y-1 md:col-span-2"><label className="text-xs ad-mut">Image URL (upload in Storage first, e.g. /uploads/promo.jpg)</label>
                  <input className={input} value={promo.imageUrl} onChange={(e) => setPromo({ ...promo, imageUrl: e.target.value })} /></div>
              )}
              <div className="space-y-1"><label className="text-xs ad-mut">{promo.template === 'signup' ? 'Submit button label' : 'Primary button label'}</label>
                <input className={input} value={promo.primaryLabel} onChange={(e) => setPromo({ ...promo, primaryLabel: e.target.value })} /></div>
              {promo.template !== 'signup' && (
                <div className="space-y-1"><label className="text-xs ad-mut">Primary button link</label>
                  <input className={input} value={promo.primaryHref} onChange={(e) => setPromo({ ...promo, primaryHref: e.target.value })} /></div>
              )}
              {promo.template === 'picture' && (
                <>
                  <div className="space-y-1"><label className="text-xs ad-mut">Secondary button label (optional)</label>
                    <input className={input} value={promo.secondaryLabel} onChange={(e) => setPromo({ ...promo, secondaryLabel: e.target.value })} /></div>
                  <div className="space-y-1"><label className="text-xs ad-mut">Secondary button link</label>
                    <input className={input} value={promo.secondaryHref} onChange={(e) => setPromo({ ...promo, secondaryHref: e.target.value })} /></div>
                </>
              )}
              <div className="space-y-1"><label className="text-xs ad-mut">Show after (seconds)</label>
                <input type="number" min={0} className={input} value={promo.delaySeconds}
                  onChange={(e) => setPromo({ ...promo, delaySeconds: Number(e.target.value) })} /></div>
              <div className="space-y-1"><label className="text-xs ad-mut">Frequency</label>
                <select className={input} value={promo.frequency} onChange={(e) => setPromo({ ...promo, frequency: e.target.value as Promo['frequency'] })}>
                  <option value="once-per-session">Once per visit session</option>
                  <option value="every-visit">Every page load</option>
                </select></div>
            </div>
            <p className="text-xs ad-soft">Sign-up form submissions land in Leads automatically, tagged “promo-banner”.</p>
            <button onClick={() => save('promo_banner', promo, promo.enabled ? 'Promo banner saved and LIVE.' : 'Promo banner saved (currently off).')}
              className="ad-btn">
              <Save className="w-4 h-4" /> Save promo banner
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
