'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Briefcase, Trash2, Plus } from 'lucide-react'
import { CURRENCIES, fmtMoney } from '@/lib/admin/finance'
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from '@/lib/admin/billing'

type Client = { id: number; public_id: string; name: string; company: string | null; email: string | null; phone: string | null; address: string | null; notes: string | null; project_count: number; billed: number; collected: number; invoice_count: number }
type Project = { id: number; public_id: string; name: string; description: string | null; status: string; currency: string; billed: number; collected: number; invoice_count: number }

const clientBlank = { name: '', company: '', email: '', phone: '', address: '', notes: '' }

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [sel, setSel] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [cf, setCf] = useState({ ...clientBlank })
  const [pf, setPf] = useState({ name: '', description: '', status: 'active', currency: 'CAD' })
  const [err, setErr] = useState('')

  const loadClients = useCallback(() => fetch('/api/admin/finance/clients').then((r) => r.json()).then((d) => setClients(d.clients || [])).catch(() => {}), [])
  const loadProjects = useCallback((cid: number) => fetch('/api/admin/finance/projects?client=' + cid).then((r) => r.json()).then((d) => setProjects(d.projects || [])).catch(() => {}), [])
  useEffect(() => { loadClients() }, [loadClients])
  useEffect(() => { if (sel) loadProjects(sel.id) }, [sel, loadProjects])

  async function addClient() {
    setErr('')
    const res = await fetch('/api/admin/finance/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cf) })
    const d = await res.json().catch(() => ({}))
    if (!res.ok) return setErr(d.error || 'Could not save.')
    setCf({ ...clientBlank }); setShowAdd(false); loadClients()
  }
  async function delClient(c: Client) {
    if (!confirm(`Delete client ${c.name}? Projects with no invoices are removed too.`)) return
    const res = await fetch(`/api/admin/finance/clients/${c.id}`, { method: 'DELETE' })
    const d = await res.json().catch(() => ({}))
    if (!res.ok) return alert(d.error || 'Could not delete.')
    if (sel?.id === c.id) setSel(null)
    loadClients()
  }
  async function addProject() {
    if (!sel) return
    setErr('')
    const res = await fetch('/api/admin/finance/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...pf, clientId: sel.id }) })
    const d = await res.json().catch(() => ({}))
    if (!res.ok) return setErr(d.error || 'Could not save.')
    setPf({ name: '', description: '', status: 'active', currency: 'CAD' }); loadProjects(sel.id); loadClients()
  }
  async function delProject(p: Project) {
    if (!confirm(`Delete project ${p.name}?`)) return
    const res = await fetch(`/api/admin/finance/projects/${p.id}`, { method: 'DELETE' })
    const d = await res.json().catch(() => ({}))
    if (!res.ok) return alert(d.error || 'Could not delete.')
    if (sel) { loadProjects(sel.id); loadClients() }
  }

  return (
    <div className="max-w-6xl">
      <div className="ad-kicker">Finance</div>
      <h1 className="text-2xl font-bold tracking-tight" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Briefcase size={22} /> Clients & Projects</h1>
      <p className="ad-mut" style={{ fontSize: 14, marginTop: 6 }}>Each client holds one or more projects. Invoices bill against a project, and totals roll up here and on the Revenue dashboard.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginTop: 18, alignItems: 'start' }}>
        {/* clients list */}
        <div>
          <button className="ad-btn" style={{ width: '100%' }} onClick={() => setShowAdd((v) => !v)}><Plus size={14} /> Add client</button>
          {showAdd && (
            <div className="ad-card" style={{ padding: 16, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="ad-input" placeholder="Client name *" value={cf.name} onChange={(e) => setCf({ ...cf, name: e.target.value })} />
              <input className="ad-input" placeholder="Company" value={cf.company} onChange={(e) => setCf({ ...cf, company: e.target.value })} />
              <input className="ad-input" placeholder="Email" value={cf.email} onChange={(e) => setCf({ ...cf, email: e.target.value })} />
              <input className="ad-input" placeholder="Phone" value={cf.phone} onChange={(e) => setCf({ ...cf, phone: e.target.value })} />
              <textarea className="ad-input" rows={2} placeholder="Billing address" value={cf.address} onChange={(e) => setCf({ ...cf, address: e.target.value })} />
              {err && <div style={{ color: 'var(--brand-ink)', fontSize: 12.5 }}>{err}</div>}
              <button className="ad-btn" disabled={!cf.name.trim()} onClick={addClient}>Save client</button>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {clients.map((c) => (
              <div key={c.id} onClick={() => setSel(c)}
                className="ad-card" style={{ padding: 14, cursor: 'pointer', borderColor: sel?.id === c.id ? 'var(--brand)' : undefined, borderWidth: sel?.id === c.id ? 1.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <span className="ad-soft" style={{ fontSize: 11 }}>{c.public_id}</span>
                </div>
                {c.company && <div className="ad-soft" style={{ fontSize: 12 }}>{c.company}</div>}
                <div className="ad-mut" style={{ fontSize: 11.5, marginTop: 6, display: 'flex', gap: 12 }}>
                  <span>{c.project_count} project{c.project_count === 1 ? '' : 's'}</span>
                  <span>Billed {fmtMoney(c.billed)}</span>
                  <span>Paid {fmtMoney(c.collected)}</span>
                </div>
              </div>
            ))}
            {!clients.length && <p className="ad-soft" style={{ fontSize: 13, padding: 10 }}>No clients yet. Add your first above.</p>}
          </div>
        </div>

        {/* selected client detail */}
        <div>
          {!sel ? (
            <div className="ad-card" style={{ padding: 30, textAlign: 'center' }} ><p className="ad-soft">Select a client to see and add projects.</p></div>
          ) : (
            <div>
              <div className="ad-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ margin: 0 }}>{sel.name}</h2>
                    <div className="ad-soft" style={{ fontSize: 12.5 }}>{[sel.company, sel.email, sel.phone].filter(Boolean).join(' · ')}</div>
                    {sel.address && <div className="ad-mut" style={{ fontSize: 12.5, marginTop: 4, whiteSpace: 'pre-wrap' }}>{sel.address}</div>}
                  </div>
                  <button className="ad-icon-btn" title="Delete client" onClick={() => delClient(sel)}><Trash2 size={15} /></button>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                  <Stat label="Billed" v={fmtMoney(sel.billed)} /><Stat label="Collected" v={fmtMoney(sel.collected)} /><Stat label="Outstanding" v={fmtMoney(sel.billed - sel.collected)} />
                </div>
              </div>

              {/* projects */}
              <div className="ad-kicker" style={{ marginTop: 20 }}>Projects</div>
              <div className="ad-card" style={{ padding: 16, marginTop: 8, display: 'grid', gridTemplateColumns: '1.4fr 1fr auto auto auto', gap: 10, alignItems: 'end' }}>
                <Labeled label="New project name"><input className="ad-input" value={pf.name} onChange={(e) => setPf({ ...pf, name: e.target.value })} placeholder="e.g. Website rebuild" /></Labeled>
                <Labeled label="Description"><input className="ad-input" value={pf.description} onChange={(e) => setPf({ ...pf, description: e.target.value })} /></Labeled>
                <Labeled label="Status"><select className="ad-input" value={pf.status} onChange={(e) => setPf({ ...pf, status: e.target.value })}>{PROJECT_STATUSES.map((s) => <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>)}</select></Labeled>
                <Labeled label="Currency"><select className="ad-input" value={pf.currency} onChange={(e) => setPf({ ...pf, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Labeled>
                <button className="ad-btn" disabled={!pf.name.trim()} onClick={addProject}>Add</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {projects.map((p) => (
                  <div key={p.id} className="ad-card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name} <span className="ad-badge grey" style={{ marginLeft: 6, fontSize: 10 }}>{PROJECT_STATUS_LABELS[p.status]}</span></div>
                      <div className="ad-soft" style={{ fontSize: 11.5 }}>{p.public_id} · {p.currency} · {p.invoice_count} invoice{p.invoice_count === 1 ? '' : 's'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{fmtMoney(p.billed, p.currency)}</div>
                        <div className="ad-soft" style={{ fontSize: 11 }}>paid {fmtMoney(p.collected, p.currency)}</div>
                      </div>
                      <Link href={`/admin/finance/invoices?project=${p.id}`} className="ad-btn-ghost" style={{ fontSize: 12 }}>New invoice</Link>
                      <button className="ad-icon-btn" title="Delete project" onClick={() => delProject(p)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {!projects.length && <p className="ad-soft" style={{ fontSize: 13, padding: 8 }}>No projects yet. Add one above.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, v }: { label: string; v: string }) {
  return <div><div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700 }}>{v}</div><div className="ad-soft" style={{ fontSize: 11 }}>{label}</div></div>
}
function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span className="ad-soft" style={{ fontSize: 11 }}>{label}</span>{children}</label>
}
