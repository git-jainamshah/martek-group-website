import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/admin/auth'
import { ensureDb } from '@/lib/admin/db'
import { q, q1 } from '@/lib/admin/pg'
import { easternDayKey } from '@/lib/admin/dates'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const num = (v: unknown) => Number(v) || 0

/**
 * Deleting a lead is a SOFT delete: it sets deleted_at and moves the row to the
 * Delete Folder. The leads table filters these out, so every count here must do
 * the same or the dashboard keeps reporting leads the user believes they removed.
 */
const LIVE = 'deleted_at IS NULL'

/** Percentage change, guarding division by zero. */
function delta(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null
  return Math.round(((current - previous) / previous) * 100)
}

/**
 * Everything the admin dashboard needs, in one call.
 * Available to any signed-in user; the page itself decides what to show per role.
 */
export async function GET() {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()

  const count = async (sql: string, params: unknown[] = []) =>
    num((await q1<{ c: number }>(sql, params))?.c)

  // ---- headline counts ----
  const [totalLeads, newLeads, mediaFiles, activeScripts, tagManagers, activeUsers] = await Promise.all([
    count(`SELECT COUNT(*)::int AS c FROM leads WHERE ${LIVE}`),
    count(`SELECT COUNT(*)::int AS c FROM leads WHERE ${LIVE} AND status = 'new'`),
    count('SELECT COUNT(*)::int AS c FROM media'),
    count('SELECT COUNT(*)::int AS c FROM scripts WHERE enabled = 1'),
    count('SELECT COUNT(*)::int AS c FROM tag_managers WHERE enabled = 1'),
    count('SELECT COUNT(*)::int AS c FROM users WHERE active = 1'),
  ])

  // ---- week over week ----
  const last7 = await count(`SELECT COUNT(*)::int AS c FROM leads WHERE ${LIVE} AND created_at >= now() - interval '7 days'`)
  const prev7 = await count(
    `SELECT COUNT(*)::int AS c FROM leads WHERE ${LIVE} AND created_at >= now() - interval '14 days' AND created_at < now() - interval '7 days'`
  )
  const last30 = await count(`SELECT COUNT(*)::int AS c FROM leads WHERE ${LIVE} AND created_at >= now() - interval '30 days'`)
  const prev30 = await count(
    `SELECT COUNT(*)::int AS c FROM leads WHERE ${LIVE} AND created_at >= now() - interval '60 days' AND created_at < now() - interval '30 days'`
  )

  // ---- daily series (last 30 days, grouped in Eastern time) ----
  const rawDays = (await q<{ created_at: any }>(
    `SELECT created_at FROM leads WHERE ${LIVE} AND created_at >= now() - interval '30 days'`
  )) ?? []
  const dayCounts = new Map<string, number>()
  for (const r of rawDays) {
    const k = easternDayKey(r.created_at)
    if (k) dayCounts.set(k, (dayCounts.get(k) ?? 0) + 1)
  }
  const series: { date: string; value: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = d.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' })
    series.push({ date: key, value: dayCounts.get(key) ?? 0 })
  }

  // ---- breakdowns ----
  // NOTE: grouped on plain columns (no COALESCE / positional GROUP BY) because the
  // local pg-mem mock cannot parse those; empty values are normalised in JS instead.
  const group = async (sql: string, fallback: string, limit?: number) => {
    let rows: { label: string | null; value: number }[] = []
    try {
      rows = (await q<{ label: string | null; value: number }>(sql)) ?? []
    } catch {
      return []
    }
    const merged = new Map<string, number>()
    for (const r of rows) {
      const label = (r.label ?? '').toString().trim() || fallback
      merged.set(label, (merged.get(label) ?? 0) + num(r.value))
    }
    const out = [...merged.entries()]
      .map(([label, value]) => ({ label, value }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value)
    return limit ? out.slice(0, limit) : out
  }

  const byStatus = await group(
    `SELECT status AS label, COUNT(*)::int AS value FROM leads WHERE ${LIVE} GROUP BY status`, 'new'
  )
  const byForm = await group(
    `SELECT form_type AS label, COUNT(*)::int AS value FROM leads WHERE ${LIVE} GROUP BY form_type`, 'other'
  )
  const byPage = await group(
    `SELECT source_page AS label, COUNT(*)::int AS value FROM leads WHERE ${LIVE} GROUP BY source_page`, '(unknown)', 8
  )

  // Channel comes from the marketing snapshot table; tolerate it being empty.
  const byChannel = await group(
    `SELECT m.session_channel_group AS label, COUNT(*)::int AS value
     FROM leads_marketing m JOIN leads l ON l.id = m.lead_id
     WHERE l.${LIVE} GROUP BY m.session_channel_group`, 'Direct', 8
  )

  // ---- blog reads ----
  let blogViews = 0
  let topPosts: { label: string; value: number }[] = []
  try {
    const rows = (await q<{ slug: string; views: number }>('SELECT slug, views FROM blog_views')) ?? []
    blogViews = rows.reduce((sum, r) => sum + num(r.views), 0)
    topPosts = rows
      .map((r) => ({ label: r.slug, value: num(r.views) }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  } catch { /* table not present yet */ }

  // ---- recent leads ----
  const recent =
    (await q(
      `SELECT id, name, email, form_type, source_page, status, created_at
       FROM leads WHERE ${LIVE} ORDER BY id DESC LIMIT 6`
    )) ?? []

  // ---- unactioned leads (still 'new' after 48h) ----
  const stale = await count(
    `SELECT COUNT(*)::int AS c FROM leads WHERE ${LIVE} AND status = 'new' AND created_at < now() - interval '48 hours'`
  )

  return NextResponse.json({
    kpis: {
      totalLeads, newLeads, mediaFiles, activeScripts, tagManagers, activeUsers,
      last7, prev7, delta7: delta(last7, prev7),
      last30, prev30, delta30: delta(last30, prev30),
      stale, blogViews,
    },
    series,
    byStatus,
    byForm,
    byChannel,
    byPage,
    topPosts,
    recent,
  })
}
