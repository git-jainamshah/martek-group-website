'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

export type LeadFilterState = {
  q: string; status: string; formType: string; service: string; budget: string
  from: string; to: string
  minBudget: string; maxBudget: string
  channel: string; source: string; medium: string; campaign: string
  clickId: string; landing: string; referrer: string
}

export const EMPTY_FILTERS: LeadFilterState = {
  q: '', status: '', formType: '', service: '', budget: '', from: '', to: '',
  minBudget: '', maxBudget: '', channel: '', source: '', medium: '', campaign: '',
  clickId: '', landing: '', referrer: '',
}

export function filtersToQs(f: LeadFilterState): string {
  const p = new URLSearchParams()
  Object.entries(f).forEach(([k, v]) => v && p.set(k, v))
  return p.toString()
}

const STATUSES: [string, string][] = [
  ['new', 'New'], ['contacted', 'Contacted'], ['qualified', 'Qualified'], ['won', 'Won'], ['lost', 'Lost'],
]
const SERVICES: [string, string][] = [
  ['web', 'Web Development'], ['data', 'Data & Analytics'], ['social', 'Social'], ['seo', 'SEO & Ads'], ['engineering', 'Engineering'],
]
const CHANNELS = ['Direct', 'Organic Search', 'Paid Search', 'Organic Social', 'Paid Social', 'Paid Video', 'Display', 'Email', 'Referral', 'Affiliates', 'Paid Other', 'Unassigned']
const CLICK_IDS = [
  ['any', 'Any click ID'], ['none', 'No click ID'], ['gclid', 'Google (gclid)'], ['fbclid', 'Meta (fbclid)'],
  ['li_fat_id', 'LinkedIn (li_fat_id)'], ['ttclid', 'TikTok (ttclid)'], ['epik', 'Pinterest (epik)'],
  ['msclkid', 'Microsoft (msclkid)'], ['twclid', 'X (twclid)'],
]

/** Quick chip presets for when you don't know what you're looking for. */
const PRESETS: { label: string; patch: Partial<LeadFilterState> }[] = [
  { label: 'New this week', patch: { status: 'new', from: new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10) } },
  { label: 'From ads', patch: { clickId: 'any' } },
  { label: 'Organic', patch: { channel: 'Organic Search' } },
  { label: 'Big budget ($15k+)', patch: { minBudget: '15000' } },
  { label: 'Has company', patch: { q: '' } },
]

export default function LeadFilters({
  value, onChange, showMarketing = true,
}: {
  value: LeadFilterState
  onChange: (f: LeadFilterState) => void
  showMarketing?: boolean
}) {
  const [advanced, setAdvanced] = useState(false)
  const set = (patch: Partial<LeadFilterState>) => onChange({ ...value, ...patch })
  const activeCount = Object.entries(value).filter(([k, v]) => v && k !== 'q').length

  return (
    <div className="ad-card" style={{ padding: 18 }}>
      {/* Row 1: search + core selects */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 2, minWidth: 220 }}>
          <label className="ad-label">Search anything</label>
          <input className="ad-input" placeholder="Name, email, company, message…" value={value.q}
            onChange={(e) => set({ q: e.target.value })} />
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <label className="ad-label">Status</label>
          <select className="ad-input" value={value.status} onChange={(e) => set({ status: e.target.value })}>
            <option value="">All</option>
            {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 130 }}>
          <label className="ad-label">Service</label>
          <select className="ad-input" value={value.service} onChange={(e) => set({ service: e.target.value })}>
            <option value="">All</option>
            {SERVICES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div style={{ minWidth: 140 }}>
          <label className="ad-label">From</label>
          <input type="date" className="ad-input" value={value.from} onChange={(e) => set({ from: e.target.value })} />
        </div>
        <div style={{ minWidth: 140 }}>
          <label className="ad-label">To</label>
          <input type="date" className="ad-input" value={value.to} onChange={(e) => set({ to: e.target.value })} />
        </div>
        <button className="ad-btn-ghost" style={{ padding: '9px 14px' }} onClick={() => setAdvanced(!advanced)}>
          <SlidersHorizontal size={14} /> {advanced ? 'Less' : 'More'} filters{activeCount ? ` (${activeCount})` : ''}
        </button>
        {activeCount + (value.q ? 1 : 0) > 0 && (
          <button className="ad-icon-btn" title="Clear all filters" onClick={() => onChange({ ...EMPTY_FILTERS })}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* Quick presets */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
        {PRESETS.map((pr) => (
          <button key={pr.label} className="ad-chip" style={{ cursor: 'pointer' }}
            onClick={() => onChange({ ...EMPTY_FILTERS, ...pr.patch })}>
            {pr.label}
          </button>
        ))}
      </div>

      {/* Advanced */}
      {advanced && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
          <div>
            <label className="ad-label">Budget min ($)</label>
            <input type="number" min={0} step={1000} className="ad-input" placeholder="e.g. 5000"
              value={value.minBudget} onChange={(e) => set({ minBudget: e.target.value })} />
          </div>
          <div>
            <label className="ad-label">Budget max ($)</label>
            <input type="number" min={0} step={1000} className="ad-input" placeholder="e.g. 40000"
              value={value.maxBudget} onChange={(e) => set({ maxBudget: e.target.value })} />
          </div>
          <div>
            <label className="ad-label">Form</label>
            <select className="ad-input" value={value.formType} onChange={(e) => set({ formType: e.target.value })}>
              <option value="">All</option>
              <option value="contact">Contact Form</option>
              <option value="promo-banner">Promo Banner</option>
              <option value="offline">Offline Lead</option>
              <option value="pitch">Pitch</option>
              <option value="other">Other</option>
            </select>
          </div>
          {showMarketing && (
            <>
              <div>
                <label className="ad-label">Channel group</label>
                <select className="ad-input" value={value.channel} onChange={(e) => set({ channel: e.target.value })}>
                  <option value="">All</option>
                  {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="ad-label">Click ID</label>
                <select className="ad-input" value={value.clickId} onChange={(e) => set({ clickId: e.target.value })}>
                  <option value="">All</option>
                  {CLICK_IDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="ad-label">Source contains</label>
                <input className="ad-input" placeholder="google, linkedin…" value={value.source} onChange={(e) => set({ source: e.target.value })} />
              </div>
              <div>
                <label className="ad-label">Medium contains</label>
                <input className="ad-input" placeholder="cpc, organic…" value={value.medium} onChange={(e) => set({ medium: e.target.value })} />
              </div>
              <div>
                <label className="ad-label">Campaign contains</label>
                <input className="ad-input" value={value.campaign} onChange={(e) => set({ campaign: e.target.value })} />
              </div>
              <div>
                <label className="ad-label">Landing page contains</label>
                <input className="ad-input" placeholder="/contact" value={value.landing} onChange={(e) => set({ landing: e.target.value })} />
              </div>
              <div>
                <label className="ad-label">Referrer contains</label>
                <input className="ad-input" placeholder="linkedin.com" value={value.referrer} onChange={(e) => set({ referrer: e.target.value })} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
