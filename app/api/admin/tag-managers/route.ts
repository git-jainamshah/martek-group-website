import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, audit } from '@/lib/admin/db'
import { q, insertReturningId } from '@/lib/admin/pg'
import { requireUser, requireEditor } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()
  const rows = await q('SELECT * FROM tag_managers ORDER BY environment, provider')
  return NextResponse.json({ tagManagers: rows })
}

export async function POST(req: NextRequest) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error
  const { provider, containerId, environment } = await req.json().catch(() => ({}))
  if (!['gtm', 'tealium'].includes(provider)) return NextResponse.json({ error: 'Provider must be gtm or tealium.' }, { status: 400 })
  if (!['production', 'qa', 'dev'].includes(environment)) return NextResponse.json({ error: 'Invalid environment.' }, { status: 400 })
  if (!containerId || typeof containerId !== 'string') return NextResponse.json({ error: 'Container ID is required.' }, { status: 400 })
  if (provider === 'gtm' && !/^GTM-[A-Z0-9]+$/i.test(containerId.trim())) {
    return NextResponse.json({ error: 'GTM container ID should look like GTM-XXXXXXX.' }, { status: 400 })
  }
  if (provider === 'tealium' && !/^[\w-]+\/[\w-]+\/[\w-]+$/.test(containerId.trim())) {
    return NextResponse.json({ error: 'Tealium ID should be account/profile/environment (e.g. martek/main/prod).' }, { status: 400 })
  }
  const id = await insertReturningId(
    'INSERT INTO tag_managers (provider, container_id, environment) VALUES ($1, $2, $3) RETURNING id',
    [provider, containerId.trim(), environment]
  )
  await audit(auth.user.email, 'tag_manager_add', `${provider} ${containerId} → ${environment}`)
  return NextResponse.json({ ok: true, id })
}
