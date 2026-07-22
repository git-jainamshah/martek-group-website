import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, q1, insertReturningId } from '@/lib/admin/pg'
import { CURRENCIES } from '@/lib/admin/finance'
import { generateInvoiceNumber, computeTotals, DISCOUNT_TYPES, INVOICE_STATUSES, DEFAULT_TAX_RATE, InvoiceItem } from '@/lib/admin/billing'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const dt = (v: unknown) => { const s = String(v ?? '').trim(); return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null }
function cleanItems(raw: any): InvoiceItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((it) => ({ description: String(it?.description ?? '').trim().slice(0, 300), quantity: Number(it?.quantity) || 0, unit_price: Number(it?.unit_price) || 0 }))
    .filter((it) => it.description && (it.quantity > 0 || it.unit_price !== 0))
}

export async function GET(req: NextRequest) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const p = req.nextUrl.searchParams
  const where: string[] = []
  const args: unknown[] = []
  const add = (clause: string, val: unknown) => { args.push(val); where.push(clause.replace('?', `$${args.length}`)) }
  if (p.get('status') && p.get('status') !== 'all') add('i.status = ?', p.get('status'))
  if (p.get('client') && p.get('client') !== 'all') add('i.client_id = ?', Number(p.get('client')))
  if (p.get('project') && p.get('project') !== 'all') add('i.project_id = ?', Number(p.get('project')))
  if (p.get('from')) add('i.issue_date >= ?', p.get('from'))
  if (p.get('to')) add('i.issue_date <= ?', p.get('to'))
  const search = (p.get('q') || '').trim()
  if (search) { args.push(`%${search.toLowerCase()}%`); where.push(`(LOWER(i.invoice_number) LIKE $${args.length} OR LOWER(c.name) LIKE $${args.length} OR LOWER(i.notes) LIKE $${args.length})`) }

  const rows = await q(
    `SELECT i.*, c.name AS client_name, c.company AS client_company, p.name AS project_name
     FROM invoices i JOIN clients c ON c.id = i.client_id LEFT JOIN client_projects p ON p.id = i.project_id
     ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     ORDER BY i.issue_date DESC NULLS LAST, i.id DESC`,
    args
  )
  return NextResponse.json({ invoices: rows })
}

export async function POST(req: NextRequest) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const b = await req.json().catch(() => ({}))

  let project_id = b.projectId ? Number(b.projectId) : null
  let client_id = b.clientId ? Number(b.clientId) : null
  let currency = CURRENCIES.includes(b.currency) ? b.currency : 'CAD'
  if (project_id) {
    const proj = await q1<any>('SELECT client_id, currency FROM client_projects WHERE id = $1', [project_id])
    if (!proj) return NextResponse.json({ error: 'Project not found.' }, { status: 400 })
    client_id = client_id || Number(proj.client_id)
    if (!b.currency) currency = proj.currency || 'CAD'
  }
  if (!client_id) return NextResponse.json({ error: 'A client (or project) is required.' }, { status: 400 })

  const items = cleanItems(b.items)
  if (!items.length) return NextResponse.json({ error: 'Add at least one line item.' }, { status: 400 })

  const discount_type = DISCOUNT_TYPES.includes(b.discountType) ? b.discountType : 'none'
  const discount_value = discount_type === 'none' ? 0 : Number(b.discountValue) || 0
  const tax_rate = b.taxRate !== undefined ? (Number(b.taxRate) || 0) : DEFAULT_TAX_RATE
  const totals = computeTotals(items, discount_type, discount_value, tax_rate)
  const status = INVOICE_STATUSES.includes(b.status) ? b.status : 'draft'
  const amount_paid = Math.max(0, Number(b.amountPaid) || 0)

  const id = await insertReturningId(
    `INSERT INTO invoices (invoice_number, project_id, client_id, issue_date, due_date, status, currency,
       items, discount_type, discount_value, tax_rate, subtotal, discount_amount, tax_amount, total, amount_paid, notes, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
    [
      generateInvoiceNumber(), project_id, client_id,
      dt(b.issueDate) || new Date().toISOString().slice(0, 10), dt(b.dueDate),
      status, currency, JSON.stringify(items), discount_type, discount_value, tax_rate,
      totals.subtotal, totals.discount, totals.tax, totals.total, amount_paid,
      String(b.notes ?? '').trim().slice(0, 2000) || null, auth.user.email,
    ]
  )
  await audit(auth.user.email, 'invoice_add', `${currency} ${totals.total}`)
  return NextResponse.json({ ok: true, id })
}
