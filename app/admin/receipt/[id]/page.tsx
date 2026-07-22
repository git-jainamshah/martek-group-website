import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSessionUser } from '@/lib/admin/auth'
import { ensureDb } from '@/lib/admin/db'
import { q1 } from '@/lib/admin/pg'
import { getCompany } from '@/lib/site-config'
import { paymentState, INVOICE_STATUS_LABELS, InvoiceItem } from '@/lib/admin/billing'
import { CURRENCY_SYMBOL } from '@/lib/admin/finance'
import PrintButton from './PrintButton'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Receipt', robots: { index: false, follow: false } }

const money = (n: number, cur: string) => (CURRENCY_SYMBOL[cur] || cur + ' ') + (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
function fmtDate(v: unknown): string {
  if (!v) return '-'
  const d = v instanceof Date ? v : new Date(String(v).length <= 10 ? String(v) + 'T00:00:00' : String(v))
  if (isNaN(d.getTime())) return String(v).slice(0, 10)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user || !['admin', 'manager'].includes(user.role)) redirect(`/admin/login?next=/admin/receipt/${params.id}`)
  await ensureDb()

  const inv = await q1<any>(
    `SELECT i.*, c.name AS client_name, c.company AS client_company, c.email AS client_email, c.phone AS client_phone, c.address AS client_address,
       p.name AS project_name, p.public_id AS project_public_id
     FROM invoices i JOIN clients c ON c.id = i.client_id LEFT JOIN client_projects p ON p.id = i.project_id
     WHERE i.id = $1`, [Number(params.id)]
  )
  if (!inv) notFound()
  const company = await getCompany()

  const items: InvoiceItem[] = (() => { try { return JSON.parse(inv.items || '[]') } catch { return [] } })()
  const cur = inv.currency || 'CAD'
  const total = Number(inv.total) || 0
  const paid = Number(inv.amount_paid) || 0
  const balance = Math.round((total - paid) * 100) / 100
  const state = paymentState(inv)
  const isPaid = state === 'paid'
  const docTitle = isPaid ? 'RECEIPT' : 'INVOICE'

  return (
    <div style={{ background: '#EEE9DD', minHeight: '100vh' }}>
      <style>{`
        @page { size: A4; margin: 14mm; }
        @media print { .noprint { display: none !important; } body { background: #fff !important; } .rcpt-wrap { box-shadow: none !important; margin: 0 !important; } }
        .rcpt-wrap { font-family: var(--font-dm-sans, ui-sans-serif), system-ui, sans-serif; color: #1A1A1E; }
        .rcpt-serif { font-family: var(--font-fraunces, Georgia), serif; }
        .rcpt-t th { text-align: left; font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: #6E6A62; padding: 8px 10px; border-bottom: 1.5px solid #1A1A1E; }
        .rcpt-t td { padding: 10px; border-bottom: 1px solid #E2D9C4; font-size: 13.5px; vertical-align: top; }
      `}</style>

      <PrintButton />

      <div className="rcpt-wrap" style={{ maxWidth: 800, margin: '0 auto 40px', background: '#fff', border: '1px solid #E2D9C4', borderRadius: 8, boxShadow: '0 10px 40px rgba(0,0,0,.12)', padding: '44px 48px' }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #ED1C24', paddingBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={company.logoIcon || '/assets/martek-mark.png'} alt={company.name} width={44} height={44} />
            <div>
              <div className="rcpt-serif" style={{ fontSize: 24, fontWeight: 700 }}>{company.name || 'Marrelay'}</div>
              <div style={{ fontSize: 12, color: '#6E6A62' }}>{company.tagline || 'Digital studio'}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="rcpt-serif" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '.02em' }}>{docTitle}</div>
            <div style={{ fontSize: 13, color: '#6E6A62' }}>{inv.invoice_number}</div>
            <span style={{ display: 'inline-block', marginTop: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', padding: '4px 12px', borderRadius: 999, background: isPaid ? '#DFF0E4' : balance > 0 ? '#FBD9DA' : '#EFEAE0', color: isPaid ? '#1F7a3f' : balance > 0 ? '#C8141B' : '#6E6A62' }}>{INVOICE_STATUS_LABELS[state] || state}</span>
          </div>
        </div>

        {/* parties */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 30, marginTop: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.08em', color: '#6E6A62', marginBottom: 6 }}>From</div>
            <div style={{ fontWeight: 700 }}>{company.name || 'Marrelay'}</div>
            {[company.addressLine1, company.addressLine2].filter(Boolean).map((l, i) => <div key={i} style={{ fontSize: 13, color: '#2B2B30' }}>{l}</div>)}
            {company.email && <div style={{ fontSize: 13, color: '#2B2B30' }}>{company.email}</div>}
            {company.phone && <div style={{ fontSize: 13, color: '#2B2B30' }}>{company.phone}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.08em', color: '#6E6A62', marginBottom: 6 }}>Bill to</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{inv.client_company || inv.client_name}</div>
            {inv.client_company && <div style={{ fontSize: 13, color: '#2B2B30', marginTop: 3 }}>Billed to: {inv.client_name}</div>}
            {inv.client_address && <div style={{ fontSize: 13, color: '#2B2B30', whiteSpace: 'pre-wrap', marginTop: 3 }}>{inv.client_address}</div>}
            {inv.client_email && <div style={{ fontSize: 13, color: '#2B2B30', marginTop: 3 }}>{inv.client_email}</div>}
            {inv.client_phone && <div style={{ fontSize: 13, color: '#2B2B30' }}>{inv.client_phone}</div>}
          </div>
          <div style={{ textAlign: 'right', fontSize: 13, minWidth: 150 }}>
            {inv.project_name && <div style={{ marginBottom: 6 }}><span style={{ color: '#6E6A62' }}>Project</span><br /><b>{inv.project_name}</b></div>}
            <div><span style={{ color: '#6E6A62' }}>Issued</span><br />{fmtDate(inv.issue_date)}</div>
            {inv.due_date && <div style={{ marginTop: 6 }}><span style={{ color: '#6E6A62' }}>Due</span><br />{fmtDate(inv.due_date)}</div>}
          </div>
        </div>

        {/* items */}
        <table className="rcpt-t" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 26 }}>
          <thead><tr><th>Description</th><th style={{ textAlign: 'right', width: 70 }}>Qty</th><th style={{ textAlign: 'right', width: 110 }}>Unit price</th><th style={{ textAlign: 'right', width: 120 }}>Amount</th></tr></thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td>{it.description}</td>
                <td style={{ textAlign: 'right' }}>{it.quantity}</td>
                <td style={{ textAlign: 'right' }}>{money(it.unit_price, cur)}</td>
                <td style={{ textAlign: 'right' }}>{money((Number(it.quantity) || 0) * (Number(it.unit_price) || 0), cur)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <div style={{ width: 300 }}>
            <TotalRow k="Subtotal" v={money(Number(inv.subtotal), cur)} />
            {Number(inv.discount_amount) > 0 && <TotalRow k={`Discount${inv.discount_type === 'percent' ? ` (${Number(inv.discount_value)}%)` : ''}`} v={'- ' + money(Number(inv.discount_amount), cur)} />}
            <TotalRow k={`HST / Tax (${Number(inv.tax_rate)}%)`} v={money(Number(inv.tax_amount), cur)} />
            <div style={{ borderTop: '2px solid #1A1A1E', margin: '8px 0' }} />
            <TotalRow k="Total" v={money(total, cur)} big />
            <TotalRow k="Amount paid" v={money(paid, cur)} />
            <TotalRow k="Balance due" v={money(balance, cur)} big accent={balance > 0.005} />
          </div>
        </div>

        {inv.notes && <div style={{ marginTop: 24, fontSize: 13, color: '#2B2B30', textAlign: 'center' }}><b>Notes:</b> {inv.notes}</div>}

        {/* barcode of the invoice number */}
        <div style={{ textAlign: 'center', marginTop: 26 }}>
          <Barcode value={inv.invoice_number} />
          <div style={{ fontFamily: 'var(--font-jetbrains, monospace)', fontSize: 11, letterSpacing: '.18em', color: '#6E6A62', marginTop: 4 }}>{inv.invoice_number}</div>
        </div>

        <div style={{ marginTop: 26, paddingTop: 16, borderTop: '1px solid #E2D9C4', fontSize: 12, color: '#6E6A62', textAlign: 'center' }}>
          {isPaid ? 'Thank you - this invoice has been paid in full.' : balance > 0 ? `Please remit ${money(balance, cur)} by ${inv.due_date ? fmtDate(inv.due_date) : 'the due date'}.` : 'Thank you for your business.'}
          <br />Questions? {company.email || 'hello@marrelay.com'}{company.phone ? ` · ${company.phone}` : ''}
        </div>
      </div>
    </div>
  )
}

// Code 39 barcode (self-contained, no dependencies). Encodes the invoice number.
const CODE39: Record<string, string> = {
  '0': 'NNNWWNWNN', '1': 'WNNWNNNNW', '2': 'NNWWNNNNW', '3': 'WNWWNNNNN', '4': 'NNNWWNNNW',
  '5': 'WNNWWNNNN', '6': 'NNWWWNNNN', '7': 'NNNWNNWNW', '8': 'WNNWNNWNN', '9': 'NNWWNNWNN',
  'A': 'WNNNNWNNW', 'B': 'NNWNNWNNW', 'C': 'WNWNNWNNN', 'D': 'NNNNWWNNW', 'E': 'WNNNWWNNN',
  'F': 'NNWNWWNNN', 'G': 'NNNNNWWNW', 'H': 'WNNNNWWNN', 'I': 'NNWNNWWNN', 'J': 'NNNNWWWNN',
  'K': 'WNNNNNNWW', 'L': 'NNWNNNNWW', 'M': 'WNWNNNNWN', 'N': 'NNNNWNNWW', 'O': 'WNNNWNNWN',
  'P': 'NNWNWNNWN', 'Q': 'NNNNNNWWW', 'R': 'WNNNNNWWN', 'S': 'NNWNNNWWN', 'T': 'NNNNWNWWN',
  'U': 'WWNNNNNNW', 'V': 'NWWNNNNNW', 'W': 'WWWNNNNNN', 'X': 'NWNNWNNNW', 'Y': 'WWNNWNNNN',
  'Z': 'NWWNWNNNN', '-': 'NWNNNNWNW', '.': 'WWNNNNWNN', ' ': 'NWWNNNWNN', '*': 'NWNNWNWNN',
}
function Barcode({ value }: { value: string }) {
  const text = '*' + String(value).toUpperCase().replace(/[^0-9A-Z\- .]/g, '') + '*'
  const mod = 1.5, h = 42
  let x = 0
  const bars: { x: number; w: number }[] = []
  for (const ch of text) {
    const p = CODE39[ch]
    if (!p) continue
    for (let i = 0; i < 9; i++) {
      const w = (p[i] === 'W' ? 3 : 1) * mod
      if (i % 2 === 0) bars.push({ x, w }) // bars sit on even indices
      x += w
    }
    x += mod // narrow inter-character gap
  }
  return (
    <svg width={x} height={h} viewBox={`0 0 ${x} ${h}`} role="img" aria-label={`Barcode ${value}`} style={{ maxWidth: '100%' }}>
      {bars.map((b, i) => <rect key={i} x={b.x} y={0} width={b.w} height={h} fill="#1A1A1E" />)}
    </svg>
  )
}

function TotalRow({ k, v, big, accent }: { k: string; v: string; big?: boolean; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: big ? 16 : 13, fontWeight: big ? 700 : 400, color: accent ? '#C8141B' : '#1A1A1E' }}>
      <span style={{ color: big ? undefined : '#6E6A62' }}>{k}</span><span>{v}</span>
    </div>
  )
}
