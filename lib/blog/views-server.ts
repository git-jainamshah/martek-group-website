import 'server-only'

/**
 * Read blog view counts on the server. Never throws: if the DB is unavailable
 * we fall back to seed ordering rather than breaking the page.
 */
export async function getViewCounts(): Promise<Record<string, number>> {
  try {
    const { ensureDb } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const { q } = require('@/lib/admin/pg') as typeof import('@/lib/admin/pg')
    await ensureDb()
    const rows = (await q('SELECT slug, views FROM blog_views')) as { slug: string; views: number }[]
    const views: Record<string, number> = {}
    for (const r of rows) views[r.slug] = Number(r.views) || 0
    return views
  } catch {
    return {}
  }
}
