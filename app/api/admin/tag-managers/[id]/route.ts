import { NextRequest, NextResponse } from 'next/server'
import { db, audit } from '@/lib/admin/db'
import { requireUser } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const { enabled } = await req.json().catch(() => ({}))
  db().prepare('UPDATE tag_managers SET enabled = ? WHERE id = ?').run(enabled ? 1 : 0, Number(params.id))
  audit(auth.user.email, 'tag_manager_toggle', `#${params.id} → ${enabled ? 'on' : 'off'}`)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  db().prepare('DELETE FROM tag_managers WHERE id = ?').run(Number(params.id))
  audit(auth.user.email, 'tag_manager_delete', `#${params.id}`)
  return NextResponse.json({ ok: true })
}
