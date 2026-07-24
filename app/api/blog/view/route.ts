import { NextRequest, NextResponse } from 'next/server'
import { postSlugs } from '@/lib/blog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Simple per-IP throttle so a refresh loop cannot inflate counts. */
const seen = new Map<string, number>()
const WINDOW_MS = 60 * 60 * 1000 // one view per article per IP per hour

/** POST { slug } - increment the read counter for a post. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const slug = String(body?.slug ?? '')
  if (!slug || !postSlugs().includes(slug)) {
    return NextResponse.json({ error: 'Unknown post.' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for') ?? 'local'
  const key = `${ip}:${slug}`
  const last = seen.get(key)
  if (last && Date.now() - last < WINDOW_MS) {
    return NextResponse.json({ ok: true, counted: false })
  }
  seen.set(key, Date.now())

  try {
    const { ensureDb } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const { run } = require('@/lib/admin/pg') as typeof import('@/lib/admin/pg')
    await ensureDb()
    await run(
      `INSERT INTO blog_views (slug, views, updated_at) VALUES ($1, 1, now())
       ON CONFLICT (slug) DO UPDATE SET views = blog_views.views + 1, updated_at = now()`,
      [slug]
    )
    return NextResponse.json({ ok: true, counted: true })
  } catch (e) {
    console.error('blog view increment failed', e)
    // Never let analytics break the page.
    return NextResponse.json({ ok: true, counted: false })
  }
}

/** GET - view counts for every post, used to sort by popularity. */
export async function GET() {
  try {
    const { ensureDb } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const { q } = require('@/lib/admin/pg') as typeof import('@/lib/admin/pg')
    await ensureDb()
    const rows = (await q('SELECT slug, views FROM blog_views')) as { slug: string; views: number }[]
    const views: Record<string, number> = {}
    for (const r of rows) views[r.slug] = Number(r.views) || 0
    return NextResponse.json({ views })
  } catch {
    return NextResponse.json({ views: {} })
  }
}
