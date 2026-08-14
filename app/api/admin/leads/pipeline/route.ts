import { NextRequest, NextResponse } from 'next/server'
import { ensureDb, getSetting, setSetting, audit } from '@/lib/admin/db'
import { q } from '@/lib/admin/pg'
import { requireUser, requireAdmin } from '@/lib/admin/auth'
import { DEFAULT_OWNER_KEY, temperature, needsAction, daysSince } from '@/lib/admin/pipeline'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Row = {
  id: number
  public_id: string | null
  name: string | null
  company: string | null
  email: string | null
  status: string
  created_at: string
  owner_user_id: number | null
  owner_first: string | null
  owner_last: string | null
  budget_max: number | null
  timeline: string | null
  last_note_at: string | null
  open_mentions: number
}

/**
 * Everything the pipeline board needs, in one query plus a rollup.
 *
 * Deliberately computed server-side rather than in the browser: the counts
 * drive decisions about who is behind, and two screens disagreeing because one
 * filtered client-side would undermine the whole point.
 */
export async function GET(_req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await ensureDb()

  const rows = await q<Row>(
    `SELECT l.id, l.public_id, l.name, l.company, l.email, l.status, l.created_at,
            l.owner_user_id,
            o.first_name AS owner_first, o.last_name AS owner_last,
            m.budget_max,
            l.extra,
            (SELECT MAX(n.created_at) FROM lead_notes n WHERE n.lead_id = l.id) AS last_note_at,
            (SELECT COUNT(*) FROM lead_note_mentions x
              WHERE x.lead_id = l.id AND x.resolved_at IS NULL)::int AS open_mentions
       FROM leads l
       LEFT JOIN users o ON o.id = l.owner_user_id
       LEFT JOIN leads_marketing m ON m.lead_id = l.id
      WHERE l.deleted_at IS NULL
      ORDER BY l.id DESC`
  )

  const leads = rows.map((r: any) => {
    let timeline: string | null = null
    try { timeline = JSON.parse(r.extra || '{}').timeline ?? null } catch { /* malformed extra */ }
    // Last activity = the newest note, or the lead's own creation if silent.
    const lastActivity = r.last_note_at ?? r.created_at
    const scored = { status: r.status, budget_max: r.budget_max, timeline, last_activity_at: lastActivity }
    return {
      id: r.id,
      publicId: r.public_id,
      name: r.name,
      company: r.company,
      email: r.email,
      status: r.status,
      createdAt: r.created_at,
      ownerId: r.owner_user_id,
      ownerName: r.owner_first ? `${r.owner_first} ${r.owner_last ?? ''}`.trim() : null,
      budgetMax: r.budget_max === null ? null : Number(r.budget_max),
      timeline,
      lastActivityAt: lastActivity,
      idleDays: daysSince(lastActivity),
      openMentions: r.open_mentions,
      temperature: temperature(scored),
      needsAction: needsAction(scored),
    }
  })

  const open = leads.filter((l) => l.status !== 'won' && l.status !== 'lost')
  const summary = {
    total: leads.length,
    open: open.length,
    needsAction: open.filter((l) => l.needsAction).length,
    hot: open.filter((l) => l.temperature === 'hot').length,
    warm: open.filter((l) => l.temperature === 'warm').length,
    cold: open.filter((l) => l.temperature === 'cold').length,
    unassigned: open.filter((l) => !l.ownerId).length,
    won: leads.filter((l) => l.status === 'won').length,
  }

  // Per-owner rollup so it is obvious at a glance who is carrying what.
  const byOwner = new Map<string, any>()
  for (const l of open) {
    const key = String(l.ownerId ?? 'none')
    const cur = byOwner.get(key) ?? {
      ownerId: l.ownerId, ownerName: l.ownerName ?? 'Unassigned',
      total: 0, needsAction: 0, hot: 0, cold: 0, oldestIdleDays: 0,
    }
    cur.total++
    if (l.needsAction) cur.needsAction++
    if (l.temperature === 'hot') cur.hot++
    if (l.temperature === 'cold') cur.cold++
    cur.oldestIdleDays = Math.max(cur.oldestIdleDays, Math.floor(l.idleDays ?? 0))
    byOwner.set(key, cur)
  }

  const owners = await q(
    `SELECT id, first_name, last_name, role FROM users WHERE active = 1
      ORDER BY lower(first_name), lower(last_name)`
  )
  const defaultOwnerId = await getSetting<number>(DEFAULT_OWNER_KEY)

  return NextResponse.json({
    leads,
    summary,
    byOwner: [...byOwner.values()].sort((a, b) => b.needsAction - a.needsAction || b.total - a.total),
    owners,
    defaultOwnerId: defaultOwnerId ?? null,
    canAssign: ['admin', 'editor', 'leads_edit', 'manager'].includes(auth.user.role),
    isAdmin: auth.user.role === 'admin',
  })
}

/** Admins set the default assignee for newly captured leads. */
export async function PUT(req: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error
  await ensureDb()
  const b = await req.json().catch(() => ({}))

  if (b.defaultOwnerId === null) {
    await setSetting(DEFAULT_OWNER_KEY, null)
    await audit(auth.user.email, 'pipeline_default_owner', 'cleared')
    return NextResponse.json({ ok: true, defaultOwnerId: null })
  }

  const id = Number(b.defaultOwnerId)
  const [user] = await q<{ id: number; first_name: string; last_name: string }>(
    `SELECT id, first_name, last_name FROM users WHERE id = $1 AND active = 1`, [id]
  )
  if (!user) return NextResponse.json({ error: 'That user does not exist or is not active.' }, { status: 400 })

  await setSetting(DEFAULT_OWNER_KEY, user.id)
  await audit(auth.user.email, 'pipeline_default_owner', `${user.first_name} ${user.last_name}`)
  return NextResponse.json({ ok: true, defaultOwnerId: user.id })
}
