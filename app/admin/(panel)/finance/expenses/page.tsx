'use client'

import { useEffect, useMemo, useState } from 'react'
import { Receipt, Trash2 } from 'lucide-react'
import {
  CURRENCIES, FREQUENCIES, RECURRING_CATEGORIES, EXPENSE_CATEGORIES, TOOL_PRESETS,
  MARKETING_CATEGORY, MARKETING_TYPES, MARKETING_PLATFORMS,
  fmtMoney, toCAD, annualCAD, nextRenewal, FREQ_PER_YEAR, FxRates, DEFAULT_FX,
} from '@/lib/admin/finance'

type Expense = Record<string, any>
type Account = { id: number; bank_name: string; account_type: string; last4: string | null; currency: string; active: number }
type Tab = 'list' | 'recurring' | 'oneoff'

const recBlank = { kind: 'recurring', category: RECURRING_CATEGORIES[0] as string, toolName: '', vendor: '', amount: '', currency: 'CAD', frequency: 'monthly', startDate: '', expiryDate: '', billingAccountId: '', receiptId: '', marketingType: MARKETING_TYPES[0] as string, marketingPlatform: MARKETING_PLATFORMS[0] as string, marketingPlatformOther: '', description: '', notes: '' }
const offBlank = { kind: 'one_off', category: EXPENSE_CATEGORIES[0] as string, vendor: '', amount: '', currency: 'CAD', expenseDate: new Date().toISOString().slice(0, 10), billingAccountId: '', receiptId: '', marketingType: MARKETING_TYPES[0] as string, marketingPlatform: MARKETING_PLATFORMS[0] as string, marketingPlatformOther: '', description: '', notes: '' }

function MarketingFields({ f, set }: { f: any; set: (p: any) => void }) {
  return (
    <>
      <Field label="Marketing type *">
        <select className="ad-input" value={f.marketingType} onChange={(e) => set({ marketingType: e.target.value })}>
          {MARKETING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Platform *">
        <select className="ad-input" value={f.marketingPlatform} onChange={(e) => set({ marketingPlatform: e.target.value })}>
          {MARKETING_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </Field>
      {f.marketingPlatform === 'Other' && (
        <Field label="Other platform *"><input className="ad-input" value={f.marketingPlatformOther} onChange={(e) => set({ marketingPlatformOther: e.target.value })} placeholder="Name the platform" /></Field>
      )}
    </>
  )
}

export default function ExpensesPage() {
  const [tab, setTab] = useState<Tab>('list')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [fx, setFx] = useState<FxRates>(DEFAULT_FX)
  const [period, setPeriod] = useState<string>('monthly')
  const [filters, setFilters] = useState({ kind: 'all', category: 'all', currency: 'all', account: 'all', frequency: 'all', platform: 'all', from: '', to: '', q: '' })
  const [msg, setMsg] = useState('')

  const qs = useMemo(() => {
    const p = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'all') p.set(k, v) })
    return p.toString()
  }, [filters])

  const loadList = () => fetch('/api/admin/finance/expenses?' + qs).then((r) => r.json()).then((d) => setExpenses(d.expenses || [])).catch(() => {})
  useEffect(() => { loadList() }, [qs]) // eslint-disable-line
  useEffect(() => {
    fetch('/api/admin/finance/accounts').then((r) => r.json()).then((d) => setAccounts(d.accounts || [])).catch(() => {})
    fetch('/api/admin/finance/fx').then((r) => r.json()).then((d) => d.fx && setFx(d.fx)).catch(() => {})
  }, [])

  async function remove(id: number) {
    if (!confirm('Delete this expense?')) return
    await fetch(`/api/admin/finance/expenses/${id}`, { method: 'DELETE' }); loadList()
  }

  // normalise a recurring expense's CAD cost to the selected period
  const perPeriodCAD = (e: Expense) => e.kind === 'recurring' ? annualCAD(e as any, fx) / (FREQ_PER_YEAR[period] || 12) : toCAD(Number(e.amount), e.currency, fx)
  const totalRecurring = expenses.filter((e) => e.kind === 'recurring').reduce((s, e) => s + perPeriodCAD(e), 0)
  const totalOneOff = expenses.filter((e) => e.kind === 'one_off').reduce((s, e) => s + toCAD(Number(e.amount), e.currency, fx), 0)

  return (
    <div className="max-w-6xl">
      <div className="ad-kicker">Finance</div>
      <h1 className="text-2xl font-bold tracking-tight" style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Receipt size={22} /> Expenses</h1>
      <p className="ad-mut" style={{ fontSize: 14, marginTop: 6 }}>Recurring subscriptions and one-off company expenses in one place. Amounts convert to CAD for totals.</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, borderBottom: '1px solid var(--rule)' }}>
        {([['list', 'All Expenses'], ['recurring', 'Add Recurring'], ['oneoff', 'Add One-off']] as [Tab, string][]).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 14px', border: 0, background: 'none', cursor: 'pointer', fontWeight: tab === t ? 700 : 400, color: tab === t ? 'var(--ink)' : 'var(--ink-mut)', borderBottom: tab === t ? '2px solid var(--brand)' : '2px solid transparent' }}>{l}</button>
        ))}
      </div>

      {msg && <div className="ad-alert ok" style={{ marginTop: 14 }}>{msg}</div>}

      {tab === 'recurring' && <RecurringForm accounts={accounts} onDone={() => { setMsg('Recurring expense added.'); setTab('list'); loadList() }} />}
      {tab === 'oneoff' && <OneOffForm accounts={accounts} onDone={() => { setMsg('Expense added.'); setTab('list'); loadList() }} />}

      {tab === 'list' && (
        <>
          {/* filters */}
          <div className="ad-card" style={{ marginTop: 16, padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
            <input className="ad-input" placeholder="Search vendor, tool, id…" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
            <select className="ad-input" value={filters.kind} onChange={(e) => setFilters({ ...filters, kind: e.target.value })}><option value="all">All types</option><option value="recurring">Recurring</option><option value="one_off">One-off</option></select>
            <select className="ad-input" value={filters.currency} onChange={(e) => setFilters({ ...filters, currency: e.target.value })}><option value="all">All currencies</option>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            <select className="ad-input" value={filters.frequency} onChange={(e) => setFilters({ ...filters, frequency: e.target.value })}><option value="all">Any frequency</option>{FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}</select>
            <select className="ad-input" value={filters.account} onChange={(e) => setFilters({ ...filters, account: e.target.value })}><option value="all">All accounts</option>{accounts.map((a) => <option key={a.id} value={a.id}>{a.bank_name}{a.last4 ? ` ····${a.last4}` : ''}</option>)}</select>
            <select className="ad-input" value={filters.platform} onChange={(e) => setFilters({ ...filters, platform: e.target.value })}><option value="all">All ad platforms</option>{MARKETING_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}</select>
            <input className="ad-input" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} title="From date" />
            <input className="ad-input" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} title="To date" />
            <select className="ad-input" value={period} onChange={(e) => setPeriod(e.target.value)} title="Normalise recurring to period">
              {FREQUENCIES.map((f) => <option key={f} value={f}>view per {f}</option>)}
            </select>
          </div>

          {/* totals */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14 }}>
            <Summary label={`Recurring (per ${period}, CAD)`} value={fmtMoney(totalRecurring, 'CAD')} />
            <Summary label="One-off in view (CAD)" value={fmtMoney(totalOneOff, 'CAD')} />
            <Summary label="Rows" value={String(expenses.length)} />
          </div>

          <div className="ad-table-wrap" style={{ overflowX: 'auto', marginTop: 14 }}>
            <table className="ad-table" style={{ minWidth: 1000 }}>
              <thead><tr><th>Expense</th><th>Type</th><th>Amount</th><th>CAD / {period}</th><th>Account</th><th>Date</th><th>Receipt</th><th>Added by</th><th></th></tr></thead>
              <tbody>
                {expenses.map((e) => {
                  const renew = e.kind === 'recurring' ? nextRenewal(e.start_date, e.frequency, e.expiry_date) : null
                  return (
                    <tr key={e.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{e.marketing_platform || e.tool_name || e.vendor || e.description || '-'}</div>
                        <div className="ad-soft" style={{ fontSize: 12 }}>{e.expense_id}{e.category ? ` · ${e.category}` : ''}{e.marketing_type ? ` · ${e.marketing_type}` : ''}{e.marketing_platform && (e.tool_name || e.vendor) ? ` · ${e.vendor || e.tool_name}` : ''}</div>
                      </td>
                      <td style={{ fontSize: 12 }}>{e.kind === 'recurring'
                        ? <span className="ad-badge grey">Recurring · {e.frequency}</span>
                        : <span className="ad-badge grey">One-off</span>}</td>
                      <td style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>{fmtMoney(Number(e.amount), e.currency)}</td>
                      <td style={{ fontSize: 12.5, whiteSpace: 'nowrap', fontWeight: 600 }}>{fmtMoney(perPeriodCAD(e), 'CAD')}{e.kind === 'one_off' && <span className="ad-soft" style={{ fontWeight: 400, fontSize: 10.5 }}> (one-off)</span>}</td>
                      <td className="ad-mut" style={{ fontSize: 12 }}>{e.account_name ? `${e.account_name}${e.account_last4 ? ` ····${e.account_last4}` : ''}` : '-'}</td>
                      <td className="ad-soft" style={{ fontSize: 11.5, whiteSpace: 'nowrap' }}>
                        {e.kind === 'recurring'
                          ? <>Since {e.start_date}{renew ? <><br />Renews {renew}</> : ''}{e.expiry_date ? <><br />Expires {e.expiry_date}</> : ''}</>
                          : e.expense_date}
                      </td>
                      <td className="ad-soft" style={{ fontSize: 11.5 }}>{e.receipt_id || '-'}</td>
                      <td className="ad-soft" style={{ fontSize: 11.5 }} title={e.created_by || ''}>{e.created_by ? String(e.created_by).split('@')[0] : '-'}</td>
                      <td style={{ textAlign: 'right' }}><button className="ad-icon-btn" title="Delete" onClick={() => remove(e.id)}><Trash2 size={14} /></button></td>
                    </tr>
                  )
                })}
                {!expenses.length && <tr><td colSpan={9} style={{ textAlign: 'center', padding: 30 }} className="ad-soft">No expenses match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div className="ad-card" style={{ padding: '12px 16px', minWidth: 180 }}><div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--serif)' }}>{value}</div><div className="ad-soft" style={{ fontSize: 11.5 }}>{label}</div></div>
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}><span className="ad-soft" style={{ fontSize: 12 }}>{label}</span>{children}</label>
}
function AccountSelect({ accounts, value, onChange }: { accounts: Account[]; value: string; onChange: (v: string) => void }) {
  return (
    <select className="ad-input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">No account</option>
      {accounts.filter((a) => a.active).map((a) => <option key={a.id} value={a.id}>{a.bank_name}{a.last4 ? ` ····${a.last4}` : ''} ({a.currency})</option>)}
    </select>
  )
}

function RecurringForm({ accounts, onDone }: { accounts: Account[]; onDone: () => void }) {
  const [f, setF] = useState({ ...recBlank })
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const set = (p: Partial<typeof recBlank>) => setF((s) => ({ ...s, ...p }))
  const isTool = f.category === 'Tool / Software' || f.category === 'Hosting / Domain'
  const isMkt = f.category === MARKETING_CATEGORY
  async function submit() {
    setBusy(true); setErr('')
    const res = await fetch('/api/admin/finance/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
    const d = await res.json().catch(() => ({})); setBusy(false)
    if (!res.ok) return setErr(d.error || 'Could not save.'); onDone()
  }
  return (
    <div className="ad-card" style={{ marginTop: 16, padding: 20 }}>
      <div className="ad-kicker" style={{ marginBottom: 12 }}>Add recurring expense</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14 }}>
        <Field label="What kind *"><select className="ad-input" value={f.category} onChange={(e) => set({ category: e.target.value })}>{RECURRING_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
        {isMkt
          ? <><MarketingFields f={f} set={set} /><Field label="Campaign / vendor (optional)"><input className="ad-input" value={f.vendor} onChange={(e) => set({ vendor: e.target.value })} placeholder="e.g. Q3 retargeting" /></Field></>
          : isTool
            ? <Field label="Tool name *"><input className="ad-input" list="tool-presets" value={f.toolName} onChange={(e) => set({ toolName: e.target.value })} placeholder="Microsoft 365, Canva…" /><datalist id="tool-presets">{TOOL_PRESETS.map((t) => <option key={t} value={t} />)}</datalist></Field>
            : <Field label="Vendor / for *"><input className="ad-input" value={f.vendor} onChange={(e) => set({ vendor: e.target.value })} placeholder="e.g. Office rent" /></Field>}
        <Field label="Amount *"><input className="ad-input" inputMode="decimal" value={f.amount} onChange={(e) => set({ amount: e.target.value.replace(/[^\d.]/g, '') })} placeholder="0.00" /></Field>
        <Field label="Currency *"><select className="ad-input" value={f.currency} onChange={(e) => set({ currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
        <Field label="Frequency *"><select className="ad-input" value={f.frequency} onChange={(e) => set({ frequency: e.target.value })}>{FREQUENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
        <Field label="Start date *"><input className="ad-input" type="date" value={f.startDate} onChange={(e) => set({ startDate: e.target.value })} /></Field>
        <Field label="Expiry date (optional)"><input className="ad-input" type="date" value={f.expiryDate} onChange={(e) => set({ expiryDate: e.target.value })} /></Field>
        <Field label="Billing account"><AccountSelect accounts={accounts} value={f.billingAccountId} onChange={(v) => set({ billingAccountId: v })} /></Field>
        <Field label="Receipt / transaction id (optional)"><input className="ad-input" value={f.receiptId} onChange={(e) => set({ receiptId: e.target.value })} /></Field>
        <Field label="Note (optional)"><input className="ad-input" value={f.description} onChange={(e) => set({ description: e.target.value })} /></Field>
      </div>
      {err && <div className="ad-alert" style={{ marginTop: 12, color: 'var(--brand-ink)' }}>{err}</div>}
      <button className="ad-btn" style={{ marginTop: 14 }} disabled={busy} onClick={submit}>{busy ? 'Saving…' : 'Add recurring expense'}</button>
    </div>
  )
}

function OneOffForm({ accounts, onDone }: { accounts: Account[]; onDone: () => void }) {
  const [f, setF] = useState({ ...offBlank })
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  const set = (p: Partial<typeof offBlank>) => setF((s) => ({ ...s, ...p }))
  async function submit() {
    setBusy(true); setErr('')
    const res = await fetch('/api/admin/finance/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
    const d = await res.json().catch(() => ({})); setBusy(false)
    if (!res.ok) return setErr(d.error || 'Could not save.'); onDone()
  }
  return (
    <div className="ad-card" style={{ marginTop: 16, padding: 20 }}>
      <div className="ad-kicker" style={{ marginBottom: 12 }}>Add one-off expense</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14 }}>
        <Field label="Category *"><select className="ad-input" value={f.category} onChange={(e) => set({ category: e.target.value })}>{EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
        {f.category === MARKETING_CATEGORY && <MarketingFields f={f} set={set} />}
        <Field label={f.category === MARKETING_CATEGORY ? 'Campaign / vendor (optional)' : 'Vendor / for *'}><input className="ad-input" value={f.vendor} onChange={(e) => set({ vendor: e.target.value })} placeholder="e.g. Staples, flight" /></Field>
        <Field label="Amount *"><input className="ad-input" inputMode="decimal" value={f.amount} onChange={(e) => set({ amount: e.target.value.replace(/[^\d.]/g, '') })} placeholder="0.00" /></Field>
        <Field label="Currency *"><select className="ad-input" value={f.currency} onChange={(e) => set({ currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
        <Field label="Date *"><input className="ad-input" type="date" value={f.expenseDate} onChange={(e) => set({ expenseDate: e.target.value })} /></Field>
        <Field label="Billing account"><AccountSelect accounts={accounts} value={f.billingAccountId} onChange={(v) => set({ billingAccountId: v })} /></Field>
        <Field label="Receipt / transaction id (optional)"><input className="ad-input" value={f.receiptId} onChange={(e) => set({ receiptId: e.target.value })} /></Field>
        <Field label="Note (optional)"><input className="ad-input" value={f.description} onChange={(e) => set({ description: e.target.value })} /></Field>
      </div>
      {err && <div className="ad-alert" style={{ marginTop: 12, color: 'var(--brand-ink)' }}>{err}</div>}
      <button className="ad-btn" style={{ marginTop: 14 }} disabled={busy} onClick={submit}>{busy ? 'Saving…' : 'Add expense'}</button>
    </div>
  )
}
