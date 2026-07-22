'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { FileText, Trash2, Plus, ExternalLink } from 'lucide-react'
import { CURRENCIES, fmtMoney } from '@/lib/admin/finance'
import { computeTotals, paymentState, INVOICE_STATUSES, INVOICE_STATUS_LABELS, INVOICE_STATUS_COLOR, DEFAULT_TAX_RATE, InvoiceItem } from '@/lib/admin/billing'

type Client = { id: number; name: string; company: string | null }
type Project = { id: number; name: string; currency: string }
type Invoice = Record<string, any>
type Tab = 'list' | 'new'

const badge: Record<string, string> = { grey: 'grey', blue: 'blue', amber: 'amber', green: 'green', red: 'red' }

export default function InvoicesPage() {
  const [tab, setTab] = useState<Tab>('list')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [filters, setFilters] = useState({ status: 'all', client: 'all', from: '', to: '', q: '' })
  const [editId, setEditId] = useState<number | null>(null)
  const [msg, setMsg] = useState('')

  const qs = useMemo(() => { const p = new URLSearchParams(); Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'all') p.set(k, v) }); return p.toString() }, [filters])
  const loadList = useCallback(() => fetch('/api/admin/finance/invoices?' + qs).then((r) => r.json()).then((d) => setInvoices(d.invoices || [])).catch(() => {}), [qs])
  useEffect(() => { loadList() }, [loadList])
  useEffect(() => { fetch('/api/admin/finance/clients').then((r) => r.json()).then((d) => setClients(d.clients || [])).catch(() => {}) }, [])
  useEffect(() => { if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('project')) setTab('new') }, [])

  async function del(id: number) { if (!confirm('Delete this invoice?')) return; await fetch(`/api/admin/finance/invoices/${id}`, { method: 'DELETE' }); loadList() }

  return (
    <div className="max-w-6xl">
      <div className="ad-kicker">Finance</div>
      <h1 className="text-2xl font-bold tracking-tight" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><FileText size={22} /> Invoices & Receipts</h1>
      <p className="ad-mut" style={{ fontSize: 14, marginTop: 6 }}>Bill clients per project. Each invoice generates a live branded receipt you can print to PDF and email. Track payment and balance here.</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, borderBottom: '1px solid var(--rule)' }}>
        {([['list', 'All Invoices'], ['new', 'New Invoice']] as [Tab, string][]).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 14px', border: 0, background: 'none', cursor: 'pointer', fontWeight: tab === t ? 700 : 400, color: tab === t ? 'var(--ink)' : 'var(--ink-mut)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent' }}>{l}</button>
        ))}
      </div>
      {msg && <div className="ad-alert ok" style={{ marginTop: 14 }}>{msg}</div>}

      {tab === 'new' && <InvoiceBuilder clients={clients} onDone={() => { setMsg('Invoice created.'); setTab('list'); loadList() }} />}

      {tab === 'list' && (
        <>
          <div className="ad-card" style={{ marginTop: 16, padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
            <input className="ad-input" placeholder="Search number, client…" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
            <select className="ad-input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="all">All statuses</option>{INVOICE_STATUSES.map((s) => <option key={s} value={s}>{INVOICE_STATUS_LABELS[s]}</option>)}</select>
            <select className="ad-input" value={filters.client} onChange={(e) => setFilters({ ...filters, client: e.target.value })}><option value="all">All clients</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <input className="ad-input" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} title="Issued from" />
            <input className="ad-input" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} title="Issued to" />
          </div>

          <div className="ad-table-wrap" style={{ overflowX: 'auto', marginTop: 14 }}>
            <table className="ad-table" style={{ minWidth: 940 }}>
              <thead><tr><th>Invoice</th><th>Client / project</th><th>Issued</th><th>Status</th><th style={{ textAlign: 'right' }}>Total</th><th style={{ textAlign: 'right' }}>Paid</th><th style={{ textAlign: 'right' }}>Balance</th><th></th></tr></thead>
              <tbody>
                {invoices.map((inv) => {
                  const st = paymentState(inv as any)
                  const bal = (Number(inv.total) || 0) - (Number(inv.amount_paid) || 0)
                  return (
                    <>
                      <tr key={inv.id}>
                        <td><div style={{ fontWeight: 600 }}>{inv.invoice_number}</div><div className="ad-soft" style={{ fontSize: 11 }}>{inv.issue_date}{inv.due_date ? ` · due ${inv.due_date}` : ''}</div></td>
                        <td className="ad-mut" style={{ fontSize: 12.5 }}>{inv.client_name}{inv.project_name ? <div className="ad-soft" style={{ fontSize: 11 }}>{inv.project_name}</div> : null}</td>
                        <td className="ad-soft" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{inv.issue_date}</td>
                        <td><span className={`ad-badge ${badge[INVOICE_STATUS_COLOR[st]] || 'grey'}`}>{INVOICE_STATUS_LABELS[st] || st}</span></td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 600 }}>{fmtMoney(Number(inv.total), inv.currency)}</td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{fmtMoney(Number(inv.amount_paid), inv.currency)}</td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap', color: bal > 0.005 ? 'var(--brand-ink)' : 'var(--ink-mut)' }}>{fmtMoney(bal, inv.currency)}</td>
                        <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                          <a href={`/admin/receipt/${inv.id}`} target="_blank" className="ad-btn-ghost" style={{ fontSize: 12 }}>Receipt <ExternalLink size={11} /></a>
                          <button className="ad-btn-ghost" style={{ fontSize: 12, marginLeft: 6 }} onClick={() => setEditId(editId === inv.id ? null : inv.id)}>Payment</button>
                          <button className="ad-icon-btn" title="Delete" onClick={() => del(inv.id)} style={{ marginLeft: 6 }}><Trash2 size={14} /></button>
                        </td>
                      </tr>
                      {editId === inv.id && <PaymentRow inv={inv} onSaved={() => { setEditId(null); loadList() }} />}
                    </>
                  )
                })}
                {!invoices.length && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 30 }} className="ad-soft">No invoices match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function PaymentRow({ inv, onSaved }: { inv: Invoice; onSaved: () => void }) {
  const [status, setStatus] = useState(inv.status)
  const [paid, setPaid] = useState(String(inv.amount_paid ?? ''))
  const [busy, setBusy] = useState(false)
  async function save() {
    setBusy(true)
    await fetch(`/api/admin/finance/invoices/${inv.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, amountPaid: Number(paid) || 0 }) })
    setBusy(false); onSaved()
  }
  return (
    <tr><td colSpan={8} style={{ background: 'var(--paper-2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '4px 2px' }}>
        <span className="ad-soft" style={{ fontSize: 12 }}>Record payment for {inv.invoice_number}:</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>Amount paid ({inv.currency})
          <input className="ad-input" style={{ width: 120 }} inputMode="decimal" value={paid} onChange={(e) => setPaid(e.target.value.replace(/[^\d.]/g, ''))} /></label>
        <button className="ad-btn-ghost" style={{ fontSize: 12 }} onClick={() => setPaid(String(inv.total))}>Mark full</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>Status
          <select className="ad-input" style={{ width: 150 }} value={status} onChange={(e) => setStatus(e.target.value)}>{INVOICE_STATUSES.map((s) => <option key={s} value={s}>{INVOICE_STATUS_LABELS[s]}</option>)}</select></label>
        <button className="ad-btn" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
      </div>
    </td></tr>
  )
}

function InvoiceBuilder({ clients, onDone }: { clients: Client[]; onDone: () => void }) {
  const [clientId, setClientId] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState('')
  const [currency, setCurrency] = useState('CAD')
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10))
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, unit_price: 0 }])
  const [discountType, setDiscountType] = useState('none')
  const [discountValue, setDiscountValue] = useState('0')
  const [taxRate, setTaxRate] = useState(String(DEFAULT_TAX_RATE))
  const [status, setStatus] = useState('draft')
  const [amountPaid, setAmountPaid] = useState('0')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pj = new URLSearchParams(window.location.search).get('project')
      if (pj) fetch('/api/admin/finance/projects').then((r) => r.json()).then((d) => {
        const p = (d.projects || []).find((x: any) => String(x.id) === pj)
        if (p) { setClientId(String(p.client_id)); setProjectId(pj); setCurrency(p.currency) }
      })
    }
  }, [])
  useEffect(() => { if (clientId) fetch('/api/admin/finance/projects?client=' + clientId).then((r) => r.json()).then((d) => setProjects(d.projects || [])).catch(() => {}) }, [clientId])

  const totals = useMemo(() => computeTotals(items, discountType, Number(discountValue) || 0, Number(taxRate) || 0), [items, discountType, discountValue, taxRate])
  const balance = totals.total - (Number(amountPaid) || 0)
  const setItem = (i: number, patch: Partial<InvoiceItem>) => setItems((prev) => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it))

  async function submit() {
    setErr(''); setBusy(true)
    const res = await fetch('/api/admin/finance/invoices', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, projectId: projectId || undefined, currency, issueDate, dueDate, items, discountType, discountValue: Number(discountValue) || 0, taxRate: Number(taxRate) || 0, status, amountPaid: Number(amountPaid) || 0, notes }),
    })
    const d = await res.json().catch(() => ({})); setBusy(false)
    if (!res.ok) return setErr(d.error || 'Could not save.'); onDone()
  }

  return (
    <div className="ad-card" style={{ marginTop: 16, padding: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
        <L label="Client *"><select className="ad-input" value={clientId} onChange={(e) => { setClientId(e.target.value); setProjectId('') }}><option value="">Select client</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}</select></L>
        <L label="Project"><select className="ad-input" value={projectId} onChange={(e) => { setProjectId(e.target.value); const p = projects.find((x) => String(x.id) === e.target.value); if (p) setCurrency(p.currency) }}><option value="">No project</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></L>
        <L label="Currency"><select className="ad-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></L>
        <L label="Issue date"><input className="ad-input" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} /></L>
        <L label="Due date"><input className="ad-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></L>
      </div>

      {/* line items */}
      <div className="ad-kicker" style={{ marginTop: 20, marginBottom: 8 }}>Work items</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 130px 120px 34px', gap: 8, fontSize: 11, color: 'var(--ink-mut)', fontFamily: 'var(--mono)' }}>
          <span>DESCRIPTION</span><span>QTY</span><span>UNIT PRICE</span><span style={{ textAlign: 'right' }}>AMOUNT</span><span></span>
        </div>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 130px 120px 34px', gap: 8, alignItems: 'center' }}>
            <input className="ad-input" placeholder="e.g. Landing page design" value={it.description} onChange={(e) => setItem(i, { description: e.target.value })} />
            <input className="ad-input" inputMode="decimal" value={String(it.quantity)} onChange={(e) => setItem(i, { quantity: Number(e.target.value.replace(/[^\d.]/g, '')) || 0 })} />
            <input className="ad-input" inputMode="decimal" value={String(it.unit_price)} onChange={(e) => setItem(i, { unit_price: Number(e.target.value.replace(/[^\d.]/g, '')) || 0 })} />
            <div style={{ textAlign: 'right', fontSize: 13 }}>{fmtMoney((it.quantity || 0) * (it.unit_price || 0), currency)}</div>
            <button className="ad-icon-btn" title="Remove" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))} disabled={items.length === 1}><Trash2 size={13} /></button>
          </div>
        ))}
        <button className="ad-btn-ghost" style={{ alignSelf: 'flex-start', fontSize: 12 }} onClick={() => setItems((p) => [...p, { description: '', quantity: 1, unit_price: 0 }])}><Plus size={13} /> Add item</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, marginTop: 18, alignItems: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14 }}>
          <L label="Discount"><select className="ad-input" value={discountType} onChange={(e) => setDiscountType(e.target.value)}><option value="none">No discount</option><option value="percent">Percent %</option><option value="fixed">Fixed amount</option></select></L>
          {discountType !== 'none' && <L label={discountType === 'percent' ? 'Discount %' : 'Discount amount'}><input className="ad-input" inputMode="decimal" value={discountValue} onChange={(e) => setDiscountValue(e.target.value.replace(/[^\d.]/g, ''))} /></L>}
          <L label="Tax rate % (HST)"><input className="ad-input" inputMode="decimal" value={taxRate} onChange={(e) => setTaxRate(e.target.value.replace(/[^\d.]/g, ''))} /></L>
          <L label="Status"><select className="ad-input" value={status} onChange={(e) => setStatus(e.target.value)}>{INVOICE_STATUSES.map((s) => <option key={s} value={s}>{INVOICE_STATUS_LABELS[s]}</option>)}</select></L>
          <L label="Amount paid"><input className="ad-input" inputMode="decimal" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value.replace(/[^\d.]/g, ''))} /></L>
          <L label="Notes (shown on receipt)"><input className="ad-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Thanks for your business" /></L>
        </div>
        <div className="ad-card" style={{ padding: 16, background: 'var(--paper-2)' }}>
          <Row k="Subtotal" v={fmtMoney(totals.subtotal, currency)} />
          {totals.discount > 0 && <Row k="Discount" v={'- ' + fmtMoney(totals.discount, currency)} />}
          <Row k={`Tax (${taxRate || 0}%)`} v={fmtMoney(totals.tax, currency)} />
          <div style={{ borderTop: '1.5px solid var(--ink)', margin: '8px 0' }} />
          <Row k="Total" v={fmtMoney(totals.total, currency)} big />
          <Row k="Paid" v={fmtMoney(Number(amountPaid) || 0, currency)} />
          <Row k="Balance due" v={fmtMoney(balance, currency)} big />
        </div>
      </div>

      {err && <div className="ad-alert" style={{ marginTop: 12, color: 'var(--brand-ink)' }}>{err}</div>}
      <button className="ad-btn" style={{ marginTop: 16 }} disabled={busy || !clientId} onClick={submit}>{busy ? 'Saving…' : 'Create invoice'}</button>
    </div>
  )
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><span className="ad-soft" style={{ fontSize: 12 }}>{label}</span>{children}</label>
}
function Row({ k, v, big }: { k: string; v: string; big?: boolean }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: big ? 15 : 12.5, fontWeight: big ? 700 : 400, padding: '3px 0' }}><span className="ad-mut">{k}</span><span>{v}</span></div>
}
