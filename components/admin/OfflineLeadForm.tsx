'use client'

import { useState } from 'react'
import { STATUSES, STATUS_LABELS, SERVICE_LABELS } from '@/components/admin/leads-shared'
import { COUNTRIES, PROVINCES } from '@/lib/locations'

const METHODS_OFFLINE = ['Phone Call', 'Email', 'Walk-in', 'Text / WhatsApp', 'Event / Networking', 'Video Call', 'Other']
const METHODS_PITCH = ['Cold Email', 'Cold Call', 'LinkedIn Outreach', 'Event / Networking', 'Proposal / RFP', 'Other']
const BUDGETS = ['', '<5k', '5-10k', '10-25k', '25k+']
const TIMELINES = ['', 'ASAP', '1-2 months', '3-6 months', 'Flexible']
const REMOTE = ['', 'Yes', 'No', 'Hybrid']

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div>
    <label className="ad-label">{label}</label>
    {children}
    {hint && <p className="ad-soft" style={{ fontSize: 11.5, margin: '4px 0 0' }}>{hint}</p>}
  </div>
)

const empty = {
  name: '', email: '', phone: '', company: '', companyUrl: '',
  companyCountry: '', companyProvince: '', companyRemote: '', contactMethod: '',
  contactDate: new Date().toISOString().slice(0, 10),
  budget: '', timeline: '', status: 'new', message: '', notes: '',
}

/** Shared manual-entry form for Offline Leads and Pitches. */
export default function OfflineLeadForm({ kind, onAdded }: { kind: 'offline' | 'pitch'; onAdded?: (name: string) => void }) {
  const methods = kind === 'pitch' ? METHODS_PITCH : METHODS_OFFLINE
  const [f, setF] = useState({ ...empty, contactMethod: methods[0] })
  const [services, setServices] = useState<string[]>([])
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const set = (patch: Partial<typeof f>) => setF({ ...f, ...patch })

  async function submit() {
    setMsg(null); setBusy(true)
    const name = f.name.trim()
    try {
      const res = await fetch('/api/admin/leads/offline', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: { ...f, kind, services } }),
      })
      // A 500 returns an HTML error page, not JSON. Parsing that threw and
      // escaped the function, so setBusy(false) never ran and the button sat
      // on "Saving..." forever. Never let response parsing decide that.
      const d = await res.json().catch(() => ({} as any))
      if (!res.ok) {
        setMsg({ kind: 'err', text: d.error || `Could not save the lead (server error ${res.status}).` })
        return
      }
      setF({ ...empty, contactMethod: methods[0] }); setServices([])
      onAdded?.(name)
    } catch {
      setMsg({ kind: 'err', text: 'Could not reach the server. The lead was not saved - please try again.' })
    } finally {
      // finally, so the button always recovers even if something above throws.
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {msg && <div className={`ad-alert ${msg.kind}`}>{msg.text}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <Field label="Full Name *">
          <input className="ad-input" value={f.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label="Email *">
          <input type="email" className="ad-input" value={f.email} onChange={(e) => set({ email: e.target.value })} />
        </Field>
        <Field label="Phone *">
          <input type="tel" className="ad-input" value={f.phone} onChange={(e) => set({ phone: e.target.value })} />
        </Field>
        <Field label="Company">
          <input className="ad-input" value={f.company} onChange={(e) => set({ company: e.target.value })} />
        </Field>
        <Field label="Company Website">
          <input type="url" className="ad-input" placeholder="https://company.com" value={f.companyUrl} onChange={(e) => set({ companyUrl: e.target.value })} />
        </Field>
        <Field label="Company Location">
          <select className="ad-input" value={f.companyCountry}
            onChange={(e) => set({ companyCountry: e.target.value, companyProvince: '' })}>
            <option value="">Select country…</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        {f.companyCountry && (
          <Field label={PROVINCES[f.companyCountry] ? 'Province / State' : 'Province / Region'}>
            {PROVINCES[f.companyCountry] ? (
              <select className="ad-input" value={f.companyProvince} onChange={(e) => set({ companyProvince: e.target.value })}>
                <option value="">Select…</option>
                {PROVINCES[f.companyCountry].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            ) : (
              <input className="ad-input" placeholder="Province or region" value={f.companyProvince} onChange={(e) => set({ companyProvince: e.target.value })} />
            )}
          </Field>
        )}
        <Field label="Is The Company Remote?">
          <select className="ad-input" value={f.companyRemote} onChange={(e) => set({ companyRemote: e.target.value })}>
            {REMOTE.map((r) => <option key={r} value={r}>{r || 'Unknown'}</option>)}
          </select>
        </Field>
        <Field label={kind === 'pitch' ? 'How Did We Pitch Them?' : 'How Did They Reach Us?'}>
          <select className="ad-input" value={f.contactMethod} onChange={(e) => set({ contactMethod: e.target.value })}>
            {methods.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label={kind === 'pitch' ? 'Pitch Date' : 'Contact Date'}>
          <input type="date" className="ad-input" value={f.contactDate} onChange={(e) => set({ contactDate: e.target.value })} />
        </Field>
        <Field label="Budget">
          <select className="ad-input" value={f.budget} onChange={(e) => set({ budget: e.target.value })}>
            {BUDGETS.map((b) => <option key={b} value={b}>{b || 'Unknown'}</option>)}
          </select>
        </Field>
        <Field label="Timeline">
          <select className="ad-input" value={f.timeline} onChange={(e) => set({ timeline: e.target.value })}>
            {TIMELINES.map((t) => <option key={t} value={t}>{t || 'Unknown'}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select className="ad-input" value={f.status} onChange={(e) => set({ status: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Services Interested In">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(SERVICE_LABELS).map(([key, label]) => (
            <button key={key} type="button" className={services.includes(key) ? 'ad-btn' : 'ad-btn-ghost'}
              style={{ padding: '7px 13px', fontSize: 12.5 }}
              onClick={() => setServices((s) => s.includes(key) ? s.filter((x) => x !== key) : [...s, key])}>
              {label}
            </button>
          ))}
        </div>
      </Field>

      <Field label={kind === 'pitch' ? 'What Did We Pitch?' : 'What Was The Conversation About?'}>
        <textarea rows={3} className="ad-input" value={f.message} onChange={(e) => set({ message: e.target.value })} />
      </Field>
      <Field label="Internal Notes">
        <textarea rows={2} className="ad-input" value={f.notes} onChange={(e) => set({ notes: e.target.value })} />
      </Field>

      <div>
        <button className="ad-btn" disabled={busy || !f.name.trim() || !f.email.trim() || (f.phone.match(/\d/g) ?? []).length < 7} onClick={submit}>
          {busy ? 'Saving…' : kind === 'pitch' ? 'Add Pitch Lead' : 'Add Offline Lead'}
        </button>
      </div>
    </div>
  )
}
