import { NextRequest, NextResponse } from 'next/server'
import { getSetting, setSetting, audit } from '@/lib/admin/db'
import { requireUser, requireEditor } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED_KEYS = ['announcement', 'promo_banner', 'robots_txt', 'seo', 'company', 'socials', 'legal_terms', 'legal_privacy']

export async function GET(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const key = req.nextUrl.searchParams.get('key') || ''
  if (!ALLOWED_KEYS.includes(key)) return NextResponse.json({ error: 'Unknown setting.' }, { status: 400 })
  return NextResponse.json({ key, value: await getSetting(key) })
}

export async function PUT(req: NextRequest) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error
  const { key, value } = await req.json().catch(() => ({}))
  if (!ALLOWED_KEYS.includes(key)) return NextResponse.json({ error: 'Unknown setting.' }, { status: 400 })

  let toStore = value
  if (key === 'legal_terms' || key === 'legal_privacy') {
    const { sanitizeHtml } = require('@/lib/admin/legal-defaults') as typeof import('@/lib/admin/legal-defaults')
    // Any edit auto-refreshes the "Last updated" date
    toStore = { html: sanitizeHtml(value?.html ?? ''), updatedAt: new Date().toISOString() }
  }

  await setSetting(key, toStore)
  await audit(auth.user.email, 'setting_update', key)
  return NextResponse.json({ ok: true })
}
