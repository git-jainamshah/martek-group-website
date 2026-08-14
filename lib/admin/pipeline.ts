/**
 * Pipeline scoring and ownership rules.
 *
 * Kept in one file so the pipeline page, the leads table and any future report
 * all classify a lead identically. If these thresholds live in two places they
 * will drift, and two screens disagreeing about which leads are "hot" is worse
 * than either threshold being slightly wrong.
 */

/** Settings key holding the default owner's user id. */
export const DEFAULT_OWNER_KEY = 'default_lead_owner_user_id'

/** Days without any activity before a lead is considered cold. */
export const COLD_AFTER_DAYS = 14
/** Days a non-new lead can sit untouched before it needs a nudge. */
export const STALE_AFTER_DAYS = 3
/** Budget at or above this counts as high value. */
export const HOT_BUDGET = 15000

export type Temperature = 'hot' | 'warm' | 'cold'

export type ScoredLead = {
  status: string
  budget_max: number | null
  timeline: string | null
  last_activity_at: string | Date | null
}

export function daysSince(when: string | Date | null | undefined): number | null {
  if (!when) return null
  const t = new Date(when).getTime()
  if (Number.isNaN(t)) return null
  return (Date.now() - t) / 86_400_000
}

/**
 * Hot / warm / cold.
 *
 * Cold wins over hot on purpose: a big-budget lead nobody has touched in two
 * weeks is a problem, not a prospect, and dressing it up as "hot" is how it
 * keeps getting ignored.
 */
export function temperature(l: ScoredLead): Temperature {
  const idle = daysSince(l.last_activity_at)
  if (idle !== null && idle >= COLD_AFTER_DAYS) return 'cold'

  const timeline = (l.timeline ?? '').toLowerCase()
  const urgent = timeline.includes('asap') || timeline.includes('1mo') || timeline.includes('within a month')
  const bigBudget = Number(l.budget_max ?? 0) >= HOT_BUDGET
  return urgent || bigBudget ? 'hot' : 'warm'
}

/** Closed leads need nothing; everything else is judged on how long it has sat. */
export function needsAction(l: ScoredLead): boolean {
  if (l.status === 'won' || l.status === 'lost') return false
  if (l.status === 'new') return true
  const idle = daysSince(l.last_activity_at)
  return idle === null || idle >= STALE_AFTER_DAYS
}

/** "4d" / "3h" / "12m" - compact enough for a table cell. */
export function shortAge(when: string | Date | null | undefined): string {
  const d = daysSince(when)
  if (d === null) return '-'
  if (d >= 1) return `${Math.floor(d)}d`
  const hours = d * 24
  if (hours >= 1) return `${Math.floor(hours)}h`
  return `${Math.max(1, Math.floor(hours * 60))}m`
}
