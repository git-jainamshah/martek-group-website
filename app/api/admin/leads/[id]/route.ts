import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { requireUser, requireLeadsEditor } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost']

/** Update status / notes. Leads are permanent - there is deliberately no DELETE. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireLeadsEditor()
  if ('error' in auth) return auth.error
  const body = await req.json().catch(() => ({}))
  const id = Number(params.id)
  const row = await q1<any>('SELECT * FROM leads WHERE id = $1', [id])
  if (!row) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 })

  const status = STATUSES.includes(body.status) ? body.status : row.status
  const notes = body.notes === undefined ? row.notes : String(body.notes).slice(0, 5000)

  /* Reassignment. `null` deliberately means unassigned, so it has to be
     distinguished from "field not supplied" - hence the `in` check rather
     than a truthiness test. */
  let ownerId: number | null = row.owner_user_id ?? null
  if ('ownerUserId' in body) {
    if (body.ownerUserId === null || body.ownerUserId === '') {
      ownerId = null
    } else {
      const owner = await q1<{ id: number }>(
        'SELECT id FROM users WHERE id = $1 AND active = 1', [Number(body.ownerUserId)]
      )
      if (!owner) return NextResponse.json({ error: 'That user does not exist or is not active.' }, { status: 400 })
      ownerId = owner.id
    }
  }

  await run(
    'UPDATE leads SET status = $1, notes = $2, owner_user_id = $3, updated_at = now() WHERE id = $4',
    [status, notes, ownerId, id]
  )
  if (ownerId !== (row.owner_user_id ?? null)) {
    await audit(auth.user.email, 'lead_reassign', `#${id} → ${ownerId ?? 'unassigned'}`)
  }
  await audit(auth.user.email, 'lead_update', `#${id} → ${status}`)
  return NextResponse.json({ ok: true })
}
