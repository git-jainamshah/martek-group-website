import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { CURRENCIES } from '@/lib/admin/finance'
import { computeTotals, DISCOUNT_TYPES, INVOICE_STATUSES, InvoiceItem } from '@/lib/admin/billing'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const dt = (v: unknown) => { const s = String(v ?? '').trim(); return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null }
function cleanItems(raw: any): InvoiceItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((it) => ({ description: String(it?.description ?? '').trim().slice(0, 300), quantity: Number(it?.quantity) || 0, unit_price: Number(it?.unit_price) || 0 }))
    .filter((it) => it.description && (it.quantity > 0 || it.unit_price !== 0))
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const inv = await q1<any>(
    `SELECT i.*, c.name AS client_name, c.company AS client_company, c.email AS client_email, c.phone AS client_phone, c.address AS client_address,
       p.name AS project_name, p.public_id AS project_public_id
     FROM invoices i JOIN clients c ON c.id = i.client_id LEFT JOIN client_projects p ON p.id = i.project_id
     WHERE i.id = $1`, [Number(params.id)]
  )
  if (!inv) return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
  return NextResponse.json({ invoice: inv })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  const row = await q1<any>('SELECT * FROM invoices WHERE id = $1', [id])
  if (!row) return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
  const b = await req.json().catch(() => ({}))

  const items = b.items !== undefined ? cleanItems(b.items) : (JSON.parse(row.items || '[]') as InvoiceItem[])
  const discount_type = b.discountType !== undefined ? (DISCOUNT_TYPES.includes(b.discountType) ? b.discountType : 'none') : row.discount_type
  const discount_value = discount_type === 'none' ? 0 : (b.discountValue !== undefined ? Number(b.discountValue) || 0 : Number(row.discount_value))
  const tax_rate = b.taxRate !== undefined ? (Number(b.taxRate) || 0) : Number(row.tax_rate)
  const totals = computeTotals(items, discount_type, discount_value, tax_rate)
  const status = INVOICE_STATUSES.includes(b.status) ? b.status : row.status
  const currency = CURRENCIES.includes(b.currency) ? b.currency : row.currency
  const amount_paid = b.amountPaid !== undefined ? Math.max(0, Number(b.amountPaid) || 0) : Number(row.amount_paid)
  const issue_date = b.issueDate !== undefined ? dt(b.issueDate) : row.issue_date
  const due_date = b.dueDate !== undefined ? dt(b.dueDate) : row.due_date
  const notes = b.notes !== undefined ? String(b.notes).trim().slice(0, 2000) || null : row.notes

  await run(
    `UPDATE invoices SET issue_date=$1, due_date=$2, status=$3, currency=$4, items=$5,
       discount_type=$6, discount_value=$7, tax_rate=$8, subtotal=$9, discount_amount=$10, tax_amount=$11, total=$12, amount_paid=$13, notes=$14
     WHERE id=$15`,
    [issue_date, due_date, status, currency, JSON.stringify(items), discount_type, discount_value, tax_rate,
      totals.subtotal, totals.discount, totals.tax, totals.total, amount_paid, notes, id]
  )
  await audit(auth.user.email, 'invoice_update', `#${id} → ${status}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  await run('DELETE FROM invoices WHERE id = $1', [id])
  await audit(auth.user.email, 'invoice_delete', `#${id}`)
  return NextResponse.json({ ok: true })
}
