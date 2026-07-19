import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/admin/db'
import { q1, run } from '@/lib/admin/pg'
import { requireUser, requireEditor } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error
  const body = await req.json().catch(() => ({}))
  const id = Number(params.id)
  const row = await q1<any>('SELECT * FROM scripts WHERE id = $1', [id])
  if (!row) return NextResponse.json({ error: 'Script not found.' }, { status: 404 })

  const title = body.title ?? row.title
  const code = body.code ?? row.code
  const location = ['head', 'body', 'footer'].includes(body.location) ? body.location : row.location
  const timing = ['before_tm', 'after_tm'].includes(body.timing) ? body.timing : row.timing
  const environment = ['all', 'production', 'qa', 'dev'].includes(body.environment) ? body.environment : row.environment
  const enabled = body.enabled === undefined ? row.enabled : body.enabled ? 1 : 0

  await run(
    'UPDATE scripts SET title = $1, code = $2, location = $3, timing = $4, environment = $5, enabled = $6 WHERE id = $7',
    [title, code, location, timing, environment, enabled, id]
  )
  await audit(auth.user.email, 'script_update', `#${id} ${title}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error
  await run('DELETE FROM scripts WHERE id = $1', [Number(params.id)])
  await audit(auth.user.email, 'script_delete', `#${params.id}`)
  return NextResponse.json({ ok: true })
}
