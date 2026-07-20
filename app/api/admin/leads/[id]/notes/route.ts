import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, run } from '@/lib/admin/pg'
import { requireUser, requireLeadsEditor } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Per-lead activity thread: ticket-style internal notes, each attributed to
 * the user who wrote it. Anyone signed in can read; only lead editors can add.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()
  const notes = await q(
    'SELECT id, author_name, author_email, body, created_at FROM lead_notes WHERE lead_id = $1 ORDER BY id DESC',
    [Number(params.id)]
  )
  return NextResponse.json({ notes })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireLeadsEditor()
  if ('error' in auth) return auth.error
  await ensureDb()
  const id = Number(params.id)
  const body = String((await req.json().catch(() => ({}))).body ?? '').trim().slice(0, 5000)
  if (!body) return NextResponse.json({ error: 'Note cannot be empty.' }, { status: 400 })
  await run(
    'INSERT INTO lead_notes (lead_id, author_name, author_email, body) VALUES ($1,$2,$3,$4)',
    [id, `${auth.user.first_name} ${auth.user.last_name}`, auth.user.email, body]
  )
  await audit(auth.user.email, 'lead_note_add', `#${id}`)
  return NextResponse.json({ ok: true })
}
