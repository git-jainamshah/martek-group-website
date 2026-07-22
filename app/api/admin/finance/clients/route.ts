import { NextRequest, NextResponse } from 'next/server'
import { requireFinance } from '@/lib/admin/auth'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, insertReturningId } from '@/lib/admin/pg'
import { generateClientId } from '@/lib/admin/billing'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const clients = await q<any>('SELECT * FROM clients ORDER BY id DESC')
  const projCounts = await q<{ cid: number; c: number }>('SELECT client_id AS cid, COUNT(*)::int AS c FROM client_projects GROUP BY client_id')
  const invAgg = await q<{ cid: number; billed: number; paid: number; n: number }>(
    `SELECT client_id AS cid, COALESCE(SUM(total),0) AS billed, COALESCE(SUM(amount_paid),0) AS paid, COUNT(*)::int AS n
     FROM invoices WHERE status <> 'void' GROUP BY client_id`
  )
  const pc = new Map(projCounts.map((r) => [Number(r.cid), Number(r.c)]))
  const ia = new Map(invAgg.map((r) => [Number(r.cid), r]))
  clients.forEach((c) => {
    c.project_count = pc.get(Number(c.id)) || 0
    const a = ia.get(Number(c.id))
    c.billed = a ? Number(a.billed) : 0
    c.collected = a ? Number(a.paid) : 0
    c.invoice_count = a ? Number(a.n) : 0
  })
  return NextResponse.json({ clients })
}

export async function POST(req: NextRequest) {
  const auth = await requireFinance()
  if ('error' in auth) return auth.error
  await ensureDb()
  const b = await req.json().catch(() => ({}))
  const name = String(b.name ?? '').trim().slice(0, 160)
  if (!name) return NextResponse.json({ error: 'Client name is required.' }, { status: 400 })
  const id = await insertReturningId(
    `INSERT INTO clients (public_id, name, company, email, phone, address, notes, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [
      generateClientId(), name,
      String(b.company ?? '').trim().slice(0, 200) || null,
      String(b.email ?? '').trim().slice(0, 200) || null,
      String(b.phone ?? '').trim().slice(0, 60) || null,
      String(b.address ?? '').trim().slice(0, 600) || null,
      String(b.notes ?? '').trim().slice(0, 2000) || null,
      auth.user.email,
    ]
  )
  await audit(auth.user.email, 'client_add', name)
  return NextResponse.json({ ok: true, id })
}
