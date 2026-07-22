import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { ACCOUNT_TYPES, CURRENCIES, OWNER_TYPES } from '@/lib/admin/finance'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  const row = await q1<any>('SELECT * FROM billing_accounts WHERE id = $1', [id])
  if (!row) return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
  const b = await req.json().catch(() => ({}))

  const bank_name = b.bankName !== undefined ? String(b.bankName).trim().slice(0, 120) : row.bank_name
  const account_type = ACCOUNT_TYPES.includes(b.accountType) ? b.accountType : row.account_type
  const last4 = b.last4 !== undefined ? String(b.last4).replace(/\D/g, '').slice(0, 4) : row.last4
  const currency = CURRENCIES.includes(b.currency) ? b.currency : row.currency
  const owner_type = OWNER_TYPES.includes(b.ownerType) ? b.ownerType : row.owner_type
  const owner_name = owner_type === 'individual' ? String(b.ownerName ?? row.owner_name ?? '').trim().slice(0, 120) : null
  const active = b.active !== undefined ? (b.active ? 1 : 0) : row.active

  await run(
    `UPDATE billing_accounts SET bank_name=$1, account_type=$2, last4=$3, currency=$4, owner_type=$5, owner_name=$6, active=$7 WHERE id=$8`,
    [bank_name, account_type, last4 || null, currency, owner_type, owner_name, active, id]
  )
  await audit(auth.user.email, 'billing_account_update', `#${id}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  const used = await q1<{ c: number }>('SELECT COUNT(*)::int AS c FROM expenses WHERE billing_account_id = $1', [id])
  if (Number(used?.c) > 0) {
    // keep referential integrity: detach expenses, then delete the account
    await run('UPDATE expenses SET billing_account_id = NULL WHERE billing_account_id = $1', [id])
  }
  await run('DELETE FROM billing_accounts WHERE id = $1', [id])
  await audit(auth.user.email, 'billing_account_delete', `#${id}`)
  return NextResponse.json({ ok: true })
}
