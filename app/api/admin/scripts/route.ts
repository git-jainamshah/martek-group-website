import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, q1, run, insertReturningId } from '@/lib/admin/pg'
import { requireUser } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()
  const rows = await q('SELECT * FROM scripts ORDER BY location, sort_order, id')
  return NextResponse.json({ scripts: rows })
}

export async function POST(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const { title, code, location, timing, environment } = await req.json().catch(() => ({}))
  if (!title || !code) return NextResponse.json({ error: 'Title and script code are required.' }, { status: 400 })
  if (!['head', 'body', 'footer'].includes(location)) return NextResponse.json({ error: 'Invalid location.' }, { status: 400 })
  if (!['before_tm', 'after_tm'].includes(timing)) return NextResponse.json({ error: 'Invalid timing.' }, { status: 400 })
  const env = ['all', 'production', 'qa', 'dev'].includes(environment) ? environment : 'all'

  const max = await q1<{ m: number }>('SELECT COALESCE(MAX(sort_order), -1) AS m FROM scripts WHERE location = $1', [location])
  const id = await insertReturningId(
    'INSERT INTO scripts (title, code, location, timing, environment, sort_order) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
    [String(title), String(code), location, timing, env, Number(max?.m ?? -1) + 1]
  )
  await audit(auth.user.email, 'script_add', `${title} → ${location}/${timing}`)
  return NextResponse.json({ ok: true, id })
}

/** PUT /api/admin/scripts — reorder: { location, ids: [scriptId, ...] in new order } */
export async function PUT(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const { location, ids } = await req.json().catch(() => ({}))
  if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids array required.' }, { status: 400 })
  for (let i = 0; i < ids.length; i++) {
    await run('UPDATE scripts SET sort_order = $1 WHERE id = $2 AND location = $3', [i, Number(ids[i]), location])
  }
  await audit(auth.user.email, 'script_reorder', `${location}: ${ids.join(',')}`)
  return NextResponse.json({ ok: true })
}
