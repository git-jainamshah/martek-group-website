import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, insertReturningId } from '@/lib/admin/pg'
import { ACCOUNT_TYPES, CURRENCIES, OWNER_TYPES, generateAccountId } from '@/lib/admin/finance'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const accounts = await q<any>('SELECT * FROM billing_accounts ORDER BY active DESC, id DESC')
  const counts = await q<{ aid: number; c: number }>(
    'SELECT billing_account_id AS aid, COUNT(*)::int AS c FROM expenses WHERE billing_account_id IS NOT NULL GROUP BY billing_account_id'
  )
  const map = new Map(counts.map((r) => [Number(r.aid), Number(r.c)]))
  accounts.forEach((a) => { a.expense_count = map.get(Number(a.id)) || 0 })
  return NextResponse.json({ accounts })
}

export async function POST(req: NextRequest) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const b = await req.json().catch(() => ({}))

  const bank_name = String(b.bankName ?? '').trim().slice(0, 120)
  const account_type = ACCOUNT_TYPES.includes(b.accountType) ? b.accountType : ''
  const last4 = String(b.last4 ?? '').replace(/\D/g, '').slice(0, 4)
  const currency = CURRENCIES.includes(b.currency) ? b.currency : 'CAD'
  const owner_type = OWNER_TYPES.includes(b.ownerType) ? b.ownerType : 'company'
  const owner_name = owner_type === 'individual' ? String(b.ownerName ?? '').trim().slice(0, 120) : null

  if (!bank_name) return NextResponse.json({ error: 'Bank / account name is required.' }, { status: 400 })
  if (!account_type) return NextResponse.json({ error: 'A valid account type is required.' }, { status: 400 })
  if (owner_type === 'individual' && !owner_name) return NextResponse.json({ error: "Individual owner's name is required." }, { status: 400 })

  const id = await insertReturningId(
    `INSERT INTO billing_accounts (public_id, bank_name, account_type, last4, currency, owner_type, owner_name)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [generateAccountId(), bank_name, account_type, last4 || null, currency, owner_type, owner_name]
  )
  await audit(auth.user.email, 'billing_account_add', `${bank_name} (${account_type})`)
  return NextResponse.json({ ok: true, id })
}
