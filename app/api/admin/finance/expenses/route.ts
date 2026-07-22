import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, insertReturningId } from '@/lib/admin/pg'
import { CURRENCIES, FREQUENCIES, generateExpenseId } from '@/lib/admin/finance'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const num = (v: unknown) => {
  const n = Number(v)
  return isFinite(n) ? n : 0
}
const date = (v: unknown) => {
  const s = String(v ?? '').trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

export async function GET(req: NextRequest) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const p = req.nextUrl.searchParams
  const where: string[] = []
  const args: unknown[] = []
  const add = (clause: string, val: unknown) => { args.push(val); where.push(clause.replace('?', `$${args.length}`)) }

  if (p.get('kind') && p.get('kind') !== 'all') add('e.kind = ?', p.get('kind'))
  if (p.get('category') && p.get('category') !== 'all') add('e.category = ?', p.get('category'))
  if (p.get('currency') && p.get('currency') !== 'all') add('e.currency = ?', p.get('currency'))
  if (p.get('account') && p.get('account') !== 'all') add('e.billing_account_id = ?', Number(p.get('account')))
  if (p.get('frequency') && p.get('frequency') !== 'all') add('e.frequency = ?', p.get('frequency'))
  if (p.get('platform') && p.get('platform') !== 'all') add('e.marketing_platform = ?', p.get('platform'))
  if (p.get('from')) add('COALESCE(e.expense_date, e.start_date) >= ?', p.get('from'))
  if (p.get('to')) add('COALESCE(e.expense_date, e.start_date) <= ?', p.get('to'))
  const search = (p.get('q') || '').trim()
  if (search) {
    const s = `%${search.toLowerCase()}%`
    args.push(s)
    where.push(`(LOWER(e.vendor) LIKE $${args.length} OR LOWER(e.tool_name) LIKE $${args.length} OR LOWER(e.description) LIKE $${args.length} OR LOWER(e.expense_id) LIKE $${args.length} OR LOWER(e.receipt_id) LIKE $${args.length})`)
  }

  const rows = await q(
    `SELECT e.*, a.bank_name AS account_name, a.account_type AS account_type, a.last4 AS account_last4
     FROM expenses e LEFT JOIN billing_accounts a ON a.id = e.billing_account_id
     ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     ORDER BY COALESCE(e.expense_date, e.start_date, e.created_at::date) DESC, e.id DESC`,
    args
  )
  return NextResponse.json({ expenses: rows })
}

export async function POST(req: NextRequest) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const b = await req.json().catch(() => ({}))

  const kind = b.kind === 'recurring' ? 'recurring' : 'one_off'
  const amount = num(b.amount)
  const currency = CURRENCIES.includes(b.currency) ? b.currency : 'CAD'
  const category = String(b.category ?? '').slice(0, 80) || null
  const vendor = String(b.vendor ?? '').trim().slice(0, 160) || null
  const tool_name = String(b.toolName ?? '').trim().slice(0, 160) || null
  const description = String(b.description ?? '').trim().slice(0, 1000) || null
  const receipt_id = String(b.receiptId ?? '').trim().slice(0, 160) || null
  const notes = String(b.notes ?? '').trim().slice(0, 2000) || null
  const billing_account_id = b.billingAccountId ? Number(b.billingAccountId) : null
  const frequency = kind === 'recurring' && FREQUENCIES.includes(b.frequency) ? b.frequency : null
  const start_date = kind === 'recurring' ? date(b.startDate) : null
  const expiry_date = kind === 'recurring' ? date(b.expiryDate) : null
  const expense_date = kind === 'one_off' ? (date(b.expenseDate) || new Date().toISOString().slice(0, 10)) : null
  const isMarketing = category === 'Marketing / Ads'
  const marketing_type = isMarketing ? (String(b.marketingType ?? '').trim().slice(0, 80) || null) : null
  const rawPlatform = String(b.marketingPlatform ?? '').trim()
  const marketing_platform = isMarketing
    ? (rawPlatform === 'Other' ? (String(b.marketingPlatformOther ?? '').trim().slice(0, 120) || 'Other') : (rawPlatform.slice(0, 120) || null))
    : null

  if (amount <= 0) return NextResponse.json({ error: 'A positive amount is required.' }, { status: 400 })
  if (!vendor && !tool_name && !description && !marketing_platform && !marketing_type) return NextResponse.json({ error: 'Add a vendor, tool, platform, or description.' }, { status: 400 })
  if (kind === 'recurring' && !frequency) return NextResponse.json({ error: 'A billing frequency is required for recurring expenses.' }, { status: 400 })
  if (kind === 'recurring' && !start_date) return NextResponse.json({ error: 'A start date is required for recurring expenses.' }, { status: 400 })

  const id = await insertReturningId(
    `INSERT INTO expenses (expense_id, kind, category, vendor, tool_name, description, amount, currency,
       billing_account_id, frequency, start_date, expiry_date, expense_date, receipt_id, marketing_type, marketing_platform, notes, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
    [generateExpenseId(), kind, category, vendor, tool_name, description, amount, currency,
      billing_account_id, frequency, start_date, expiry_date, expense_date, receipt_id, marketing_type, marketing_platform, notes, auth.user.email]
  )
  await audit(auth.user.email, 'expense_add', `${kind} ${currency} ${amount} - ${vendor || tool_name || ''}`)
  return NextResponse.json({ ok: true, id })
}
