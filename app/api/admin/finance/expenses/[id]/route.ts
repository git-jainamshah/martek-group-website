import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { CURRENCIES, FREQUENCIES } from '@/lib/admin/finance'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const date = (v: unknown) => {
  const s = String(v ?? '').trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  const row = await q1<any>('SELECT * FROM expenses WHERE id = $1', [id])
  if (!row) return NextResponse.json({ error: 'Expense not found.' }, { status: 404 })
  const b = await req.json().catch(() => ({}))

  const amount = b.amount !== undefined ? Number(b.amount) || 0 : row.amount
  const currency = CURRENCIES.includes(b.currency) ? b.currency : row.currency
  const category = b.category !== undefined ? String(b.category).slice(0, 80) || null : row.category
  const vendor = b.vendor !== undefined ? String(b.vendor).trim().slice(0, 160) || null : row.vendor
  const tool_name = b.toolName !== undefined ? String(b.toolName).trim().slice(0, 160) || null : row.tool_name
  const description = b.description !== undefined ? String(b.description).trim().slice(0, 1000) || null : row.description
  const receipt_id = b.receiptId !== undefined ? String(b.receiptId).trim().slice(0, 160) || null : row.receipt_id
  const notes = b.notes !== undefined ? String(b.notes).trim().slice(0, 2000) || null : row.notes
  const billing_account_id = b.billingAccountId !== undefined ? (b.billingAccountId ? Number(b.billingAccountId) : null) : row.billing_account_id
  const frequency = row.kind === 'recurring' ? (FREQUENCIES.includes(b.frequency) ? b.frequency : row.frequency) : null
  const start_date = row.kind === 'recurring' ? (b.startDate !== undefined ? date(b.startDate) : row.start_date) : null
  const expiry_date = row.kind === 'recurring' ? (b.expiryDate !== undefined ? date(b.expiryDate) : row.expiry_date) : null
  const expense_date = row.kind === 'one_off' ? (b.expenseDate !== undefined ? date(b.expenseDate) : row.expense_date) : null

  await run(
    `UPDATE expenses SET category=$1, vendor=$2, tool_name=$3, description=$4, amount=$5, currency=$6,
       billing_account_id=$7, frequency=$8, start_date=$9, expiry_date=$10, expense_date=$11, receipt_id=$12, notes=$13
     WHERE id=$14`,
    [category, vendor, tool_name, description, amount, currency, billing_account_id, frequency, start_date, expiry_date, expense_date, receipt_id, notes, id]
  )
  await audit(auth.user.email, 'expense_update', `#${id}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  await run('DELETE FROM expenses WHERE id = $1', [id])
  await audit(auth.user.email, 'expense_delete', `#${id}`)
  return NextResponse.json({ ok: true })
}
