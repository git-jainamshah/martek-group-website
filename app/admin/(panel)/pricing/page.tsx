'use client'

import { useEffect, useMemo, useState } from 'react'
import { Save, Star } from 'lucide-react'

type Pkg = {
  id: number; page_key: string; idx: number; name: string; price: string
  price_note: string | null; billing: string | null; description: string | null
  tag: string | null; featured: number; items: string; cta_label: string | null; updated_at: string
}

export default function PricingAdminPage() {
  const [all, setAll] = useState<Pkg[]>([])
  const [labels, setLabels] = useState<Record<string, string>>({})
  const [page, setPage] = useState('home')
  const [draft, setDraft] = useState<any[]>([])
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () =>
    fetch('/api/admin/packages').then((r) => r.json()).then((d) => {
      setAll(d.packages || [])
      setLabels(d.pageLabels || {})
    })
  useEffect(() => { load() }, [])

  useEffect(() => {
    setDraft(
      all.filter((p) => p.page_key === page).map((p) => ({
        idx: p.idx, name: p.name, price: p.price, priceNote: p.price_note ?? '',
        billing: p.billing ?? '', description: p.description ?? '', tag: p.tag ?? '',
        featured: !!p.featured, items: JSON.parse(p.items || '[]') as string[],
        ctaLabel: p.cta_label ?? '', updatedAt: p.updated_at,
      }))
    )
  }, [all, page])

  const pages = useMemo(() => Object.keys(labels), [labels])

  async function save() {
    setBusy(true)
    const res = await fetch('/api/admin/packages', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageKey: page, packages: draft }),
    })
    setBusy(false)
    setToast(res.ok ? 'Pricing saved - live on the site immediately.' : 'Save failed.')
    setTimeout(() => setToast(''), 4000)
    if (res.ok) load()
  }

  const set = (i: number, patch: Record<string, unknown>) =>
    setDraft((d) => d.map((p, j) => (j === i ? { ...p, ...patch } : p)))

  const input = 'ad-input'

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pricing & Packages</h1>
          <p className="text-sm ad-mut mt-1">Edit prices, features, and labels for every pricing section across the site.</p>
        </div>
        <button onClick={save} disabled={busy}
          className="ad-btn">
          <Save className="w-4 h-4" /> {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {toast && <div className="ad-alert ok">{toast}</div>}

      <div className="flex gap-2 flex-wrap">
        {pages.map((p) => (
          <button key={p} onClick={() => setPage(p)}
            className={`text-sm px-3 py-1.5 rounded-full border ${page === p ? 'bg-white text-black border-white font-semibold' : 'border-[#C9BEA3] text-[#2B2B30] hover:bg-[#F4EDDD]'}`}>
            {labels[p]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {draft.map((p, i) => (
          <div key={p.idx} className={`bg-[#FFFDF7] border rounded-xl p-5 space-y-3 ${p.featured ? 'border-[#E07A5F]' : 'border-[#E2D9C4]'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest ad-soft">Package {i + 1}</span>
              <button onClick={() => set(i, { featured: !p.featured })}
                title="Mark as featured / most popular"
                className={`p-1 rounded ${p.featured ? 'text-[#8a6116]' : 'ad-soft hover:ad-mut'}`}>
                <Star className="w-4 h-4" fill={p.featured ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="space-y-1"><label className="text-xs ad-mut">Name</label>
              <input className={input} value={p.name} onChange={(e) => set(i, { name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><label className="text-xs ad-mut">Price</label>
                <input className={input} value={p.price} onChange={(e) => set(i, { price: e.target.value })} /></div>
              <div className="space-y-1"><label className="text-xs ad-mut">Note (from, /mo…)</label>
                <input className={input} value={p.priceNote} onChange={(e) => set(i, { priceNote: e.target.value })} /></div>
            </div>
            <div className="space-y-1"><label className="text-xs ad-mut">Billing line</label>
              <input className={input} value={p.billing} onChange={(e) => set(i, { billing: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs ad-mut">Description</label>
              <textarea rows={2} className={input} value={p.description} onChange={(e) => set(i, { description: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs ad-mut">Badge (e.g. Best value)</label>
              <input className={input} value={p.tag} onChange={(e) => set(i, { tag: e.target.value })} /></div>
            <div className="space-y-1"><label className="text-xs ad-mut">Features (one per line)</label>
              <textarea rows={5} className={input} value={p.items.join('\n')}
                onChange={(e) => set(i, { items: e.target.value.split('\n').filter((s: string) => s.trim()) })} /></div>
            <div className="space-y-1"><label className="text-xs ad-mut">Button label</label>
              <input className={input} value={p.ctaLabel} onChange={(e) => set(i, { ctaLabel: e.target.value })} /></div>
            <div className="text-[11px] ad-soft">Last updated {new Date(p.updatedAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
