'use client'

import { useEffect, useState } from 'react'
import { Wallet, Trash2 } from 'lucide-react'
import { ACCOUNT_TYPES, CURRENCIES, CURRENCY_SYMBOL } from '@/lib/admin/finance'

type Account = {
  id: number; public_id: string; bank_name: string; account_type: string; last4: string | null
  currency: string; owner_type: string; owner_name: string | null; active: number; expense_count: number
}

const blank = { bankName: '', accountType: ACCOUNT_TYPES[0] as string, last4: '', currency: 'CAD', ownerType: 'company', ownerName: '' }

export default function BillingAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [f, setF] = useState({ ...blank })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const load = () => fetch('/api/admin/finance/accounts').then((r) => r.json()).then((d) => setAccounts(d.accounts || [])).catch(() => {})
  useEffect(() => { load() }, [])
  const set = (patch: Partial<typeof blank>) => setF((p) => ({ ...p, ...patch }))

  async function submit() {
    setBusy(true); setErr(''); setMsg('')
    const res = await fetch('/api/admin/finance/accounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
    const d = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) return setErr(d.error || 'Could not save.')
    setF({ ...blank }); setMsg('Billing account added.'); load()
  }
  async function remove(id: number) {
    if (!confirm('Delete this billing account? Linked expenses are kept but detached.')) return
    await fetch(`/api/admin/finance/accounts/${id}`, { method: 'DELETE' }); load()
  }
  async function toggleActive(a: Account) {
    await fetch(`/api/admin/finance/accounts/${a.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: a.active ? 0 : 1 }) }); load()
  }

  return (
    <div className="max-w-5xl">
      <div className="ad-kicker">Finance</div>
      <h1 className="text-2xl font-bold tracking-tight" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Wallet size={22} /> Billing Accounts</h1>
      <p className="ad-mut" style={{ fontSize: 14, marginTop: 6 }}>The bank accounts and cards the company pays with. Expenses are linked to these.</p>

      {msg && <div className="ad-alert ok" style={{ marginTop: 14 }}>{msg}</div>}
      {err && <div className="ad-alert" style={{ marginTop: 14, color: 'var(--brand-ink)' }}>{err}</div>}

      {/* add form */}
      <div className="ad-card" style={{ marginTop: 16, padding: 20 }}>
        <div className="ad-kicker" style={{ marginBottom: 12 }}>Add account</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
          <Field label="Bank / account name *"><input className="ad-input" value={f.bankName} onChange={(e) => set({ bankName: e.target.value })} placeholder="e.g. RBC, Amex Business" /></Field>
          <Field label="Account type *">
            <select className="ad-input" value={f.accountType} onChange={(e) => set({ accountType: e.target.value })}>
              {ACCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Last 4 digits"><input className="ad-input" inputMode="numeric" maxLength={4} value={f.last4} onChange={(e) => set({ last4: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="1234" /></Field>
          <Field label="Currency *">
            <select className="ad-input" value={f.currency} onChange={(e) => set({ currency: e.target.value })}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Owner *">
            <select className="ad-input" value={f.ownerType} onChange={(e) => set({ ownerType: e.target.value })}>
              <option value="company">Marrelay (Company)</option>
              <option value="individual">Individual</option>
            </select>
          </Field>
          {f.ownerType === 'individual' && (
            <Field label="Individual's name *"><input className="ad-input" value={f.ownerName} onChange={(e) => set({ ownerName: e.target.value })} placeholder="Full name" /></Field>
          )}
        </div>
        <button className="ad-btn" style={{ marginTop: 14 }} disabled={busy || !f.bankName.trim()} onClick={submit}>{busy ? 'Saving…' : 'Add billing account'}</button>
      </div>

      {/* list */}
      <div className="ad-table-wrap" style={{ overflowX: 'auto', marginTop: 18 }}>
        <table className="ad-table" style={{ minWidth: 720 }}>
          <thead><tr><th>Account</th><th>Currency</th><th>Owner</th><th>Expenses</th><th></th></tr></thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.id} style={{ opacity: a.active ? 1 : 0.5 }}>
                <td>
                  <div style={{ fontWeight: 600 }}>{a.bank_name}</div>
                  <div className="ad-soft" style={{ fontSize: 12 }}>{a.account_type}{a.last4 ? ` ···· ${a.last4}` : ''} · {a.public_id}</div>
                </td>
                <td><span className="ad-badge grey">{CURRENCY_SYMBOL[a.currency] || ''} {a.currency}</span></td>
                <td className="ad-mut" style={{ fontSize: 12.5 }}>{a.owner_type === 'individual' ? (a.owner_name || 'Individual') : 'Marrelay (Company)'}</td>
                <td className="ad-mut" style={{ fontSize: 12.5 }}>{a.expense_count}</td>
                <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                  <button className="ad-btn-ghost" style={{ fontSize: 12 }} onClick={() => toggleActive(a)}>{a.active ? 'Deactivate' : 'Activate'}</button>
                  <button className="ad-icon-btn" title="Delete" onClick={() => remove(a.id)} style={{ marginLeft: 6 }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {!accounts.length && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30 }} className="ad-soft">No billing accounts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span className="ad-soft" style={{ fontSize: 12 }}>{label}</span>
      {children}
    </label>
  )
}
