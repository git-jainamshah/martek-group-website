import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { requireUser } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost']

/** Update status / notes. Leads are permanent — there is deliberately no DELETE. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const body = await req.json().catch(() => ({}))
  const id = Number(params.id)
  const row = await q1<any>('SELECT * FROM leads WHERE id = $1', [id])
  if (!row) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 })

  const status = STATUSES.includes(body.status) ? body.status : row.status
  const notes = body.notes === undefined ? row.notes : String(body.notes).slice(0, 5000)
  await run('UPDATE leads SET status = $1, notes = $2, updated_at = now() WHERE id = $3', [status, notes, id])
  await audit(auth.user.email, 'lead_update', `#${id} → ${status}`)
  return NextResponse.json({ ok: true })
}
