import { NextRequest, NextResponse } from 'next/server'
import { db, audit } from '@/lib/admin/db'
import { requireUser } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const body = await req.json().catch(() => ({}))
  const id = Number(params.id)
  const row = db().prepare('SELECT * FROM scripts WHERE id = ?').get(id) as any
  if (!row) return NextResponse.json({ error: 'Script not found.' }, { status: 404 })

  const title = body.title ?? row.title
  const code = body.code ?? row.code
  const location = ['head', 'body', 'footer'].includes(body.location) ? body.location : row.location
  const timing = ['before_tm', 'after_tm'].includes(body.timing) ? body.timing : row.timing
  const environment = ['all', 'production', 'qa', 'dev'].includes(body.environment) ? body.environment : row.environment
  const enabled = body.enabled === undefined ? row.enabled : body.enabled ? 1 : 0

  db().prepare(
    'UPDATE scripts SET title = ?, code = ?, location = ?, timing = ?, environment = ?, enabled = ? WHERE id = ?'
  ).run(title, code, location, timing, environment, enabled, id)
  audit(auth.user.email, 'script_update', `#${id} ${title}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  db().prepare('DELETE FROM scripts WHERE id = ?').run(Number(params.id))
  audit(auth.user.email, 'script_delete', `#${params.id}`)
  return NextResponse.json({ ok: true })
}
