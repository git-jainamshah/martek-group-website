import { NextRequest, NextResponse } from 'next/server'
import { audit } from '@/lib/admin/db'
import { run } from '@/lib/admin/pg'
import { requireUser, requireEditor } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error
  const { enabled } = await req.json().catch(() => ({}))
  await run('UPDATE tag_managers SET enabled = $1 WHERE id = $2', [enabled ? 1 : 0, Number(params.id)])
  await audit(auth.user.email, 'tag_manager_toggle', `#${params.id} → ${enabled ? 'on' : 'off'}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error
  await run('DELETE FROM tag_managers WHERE id = $1', [Number(params.id)])
  await audit(auth.user.email, 'tag_manager_delete', `#${params.id}`)
  return NextResponse.json({ ok: true })
}
