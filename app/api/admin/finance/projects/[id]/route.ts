import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { PROJECT_STATUSES } from '@/lib/admin/billing'
import { CURRENCIES } from '@/lib/admin/finance'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  const row = await q1<any>('SELECT * FROM client_projects WHERE id = $1', [id])
  if (!row) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
  const b = await req.json().catch(() => ({}))
  await run(
    `UPDATE client_projects SET name=$1, description=$2, status=$3, currency=$4 WHERE id=$5`,
    [
      b.name !== undefined ? String(b.name).trim().slice(0, 200) || row.name : row.name,
      b.description !== undefined ? String(b.description).trim().slice(0, 1000) || null : row.description,
      PROJECT_STATUSES.includes(b.status) ? b.status : row.status,
      CURRENCIES.includes(b.currency) ? b.currency : row.currency,
      id,
    ]
  )
  await audit(auth.user.email, 'project_update', `#${id}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  const inv = await q1<{ c: number }>('SELECT COUNT(*)::int AS c FROM invoices WHERE project_id = $1', [id])
  if (Number(inv?.c) > 0) return NextResponse.json({ error: 'This project has invoices. Void or delete them first.' }, { status: 400 })
  await run('DELETE FROM client_projects WHERE id = $1', [id])
  await audit(auth.user.email, 'project_delete', `#${id}`)
  return NextResponse.json({ ok: true })
}
