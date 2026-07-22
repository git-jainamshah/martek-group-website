import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  const row = await q1<any>('SELECT * FROM clients WHERE id = $1', [id])
  if (!row) return NextResponse.json({ error: 'Client not found.' }, { status: 404 })
  const b = await req.json().catch(() => ({}))
  const v = (k: string, cur: any, n = 200) => (b[k] !== undefined ? String(b[k]).trim().slice(0, n) || null : cur)
  await run(
    `UPDATE clients SET name=$1, company=$2, email=$3, phone=$4, address=$5, notes=$6 WHERE id=$7`,
    [
      b.name !== undefined ? String(b.name).trim().slice(0, 160) || row.name : row.name,
      v('company', row.company), v('email', row.email), v('phone', row.phone, 60),
      v('address', row.address, 600), v('notes', row.notes, 2000), id,
    ]
  )
  await audit(auth.user.email, 'client_update', `#${id}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  const inv = await q1<{ c: number }>('SELECT COUNT(*)::int AS c FROM invoices WHERE client_id = $1', [id])
  if (Number(inv?.c) > 0) return NextResponse.json({ error: 'This client has invoices. Void or delete them first.' }, { status: 400 })
  await run('DELETE FROM client_projects WHERE client_id = $1', [id])
  await run('DELETE FROM clients WHERE id = $1', [id])
  await audit(auth.user.email, 'client_delete', `#${id}`)
  return NextResponse.json({ ok: true })
}
