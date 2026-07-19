import { NextRequest, NextResponse } from 'next/server'
import { db, audit } from '@/lib/admin/db'
import { requireUser } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const rows = db().prepare('SELECT * FROM scripts ORDER BY location, sort_order, id').all()
  return NextResponse.json({ scripts: rows })
}

export async function POST(req: NextRequest) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const { title, code, location, timing, environment } = await req.json().catch(() => ({}))
  if (!title || !code) return NextResponse.json({ error: 'Title and script code are required.' }, { status: 400 })
  if (!['head', 'body', 'footer'].includes(location)) return NextResponse.json({ error: 'Invalid location.' }, { status: 400 })
  if (!['before_tm', 'after_tm'].includes(timing)) return NextResponse.json({ error: 'Invalid timing.' }, { status: 400 })
  const env = ['all', 'production', 'qa', 'dev'].includes(environment) ? environment : 'all'

  const max = db().prepare('SELECT COALESCE(MAX(sort_order), -1) m FROM scripts WHERE location = ?').get(location) as { m: number }
  const info = db().prepare(
    'INSERT INTO scripts (title, code, location, timing, environment, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(String(title), String(code), location, timing, env, max.m + 1)
  audit(auth.user.email, 'script_add', `${title} → ${location}/${timing}`)
  return NextResponse.json({ ok: true, id: info.lastInsertRowid })
}

/** PUT /api/admin/scripts — reorder: { location, ids: [scriptId, ...] in new order } */
export async function PUT(req: NextRequest) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const { location, ids } = await req.json().catch(() => ({}))
  if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids array required.' }, { status: 400 })
  const upd = db().prepare('UPDATE scripts SET sort_order = ? WHERE id = ? AND location = ?')
  const tx = db().transaction(() => {
    ids.forEach((id: number, i: number) => upd.run(i, Number(id), location))
  })
  tx()
  audit(auth.user.email, 'script_reorder', `${location}: ${ids.join(',')}`)
  return NextResponse.json({ ok: true })
}
