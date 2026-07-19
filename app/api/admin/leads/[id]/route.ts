import { NextRequest, NextResponse } from 'next/server'
import { db, audit } from '@/lib/admin/db'
import { requireUser } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost']

/** Update status / notes. Leads are permanent — there is deliberately no DELETE. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const body = await req.json().catch(() => ({}))
  const id = Number(params.id)
  const row = db().prepare('SELECT * FROM leads WHERE id = ?').get(id) as any
  if (!row) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 })

  const status = STATUSES.includes(body.status) ? body.status : row.status
  const notes = body.notes === undefined ? row.notes : String(body.notes).slice(0, 5000)
  db().prepare(`UPDATE leads SET status = ?, notes = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(status, notes, id)
  audit(auth.user.email, 'lead_update', `#${id} → ${status}`)
  return NextResponse.json({ ok: true })
}
