import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, insertReturningId } from '@/lib/admin/pg'
import { generateProjectId, PROJECT_STATUSES } from '@/lib/admin/billing'
import { CURRENCIES } from '@/lib/admin/finance'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const clientId = req.nextUrl.searchParams.get('client')
  const projects = clientId
    ? await q<any>('SELECT p.*, c.name AS client_name FROM client_projects p JOIN clients c ON c.id = p.client_id WHERE p.client_id = $1 ORDER BY p.id DESC', [Number(clientId)])
    : await q<any>('SELECT p.*, c.name AS client_name FROM client_projects p JOIN clients c ON c.id = p.client_id ORDER BY p.id DESC')
  const agg = await q<{ pid: number; billed: number; paid: number; n: number }>(
    `SELECT project_id AS pid, COALESCE(SUM(total),0) AS billed, COALESCE(SUM(amount_paid),0) AS paid, COUNT(*)::int AS n
     FROM invoices WHERE status <> 'void' AND project_id IS NOT NULL GROUP BY project_id`
  )
  const m = new Map(agg.map((r) => [Number(r.pid), r]))
  projects.forEach((p) => {
    const a = m.get(Number(p.id))
    p.billed = a ? Number(a.billed) : 0
    p.collected = a ? Number(a.paid) : 0
    p.invoice_count = a ? Number(a.n) : 0
  })
  return NextResponse.json({ projects })
}

export async function POST(req: NextRequest) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const b = await req.json().catch(() => ({}))
  const client_id = Number(b.clientId)
  const name = String(b.name ?? '').trim().slice(0, 200)
  if (!client_id) return NextResponse.json({ error: 'A client is required.' }, { status: 400 })
  if (!name) return NextResponse.json({ error: 'Project name is required.' }, { status: 400 })
  const status = PROJECT_STATUSES.includes(b.status) ? b.status : 'active'
  const currency = CURRENCIES.includes(b.currency) ? b.currency : 'CAD'
  const id = await insertReturningId(
    `INSERT INTO client_projects (public_id, client_id, name, description, status, currency, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [generateProjectId(), client_id, name, String(b.description ?? '').trim().slice(0, 1000) || null, status, currency, auth.user.email]
  )
  await audit(auth.user.email, 'project_add', name)
  return NextResponse.json({ ok: true, id })
}
