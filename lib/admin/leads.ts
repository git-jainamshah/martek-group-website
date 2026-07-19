import { q } from './pg'
import { ensureDb } from './db'

export type LeadFilters = {
  q?: string
  status?: string
  formType?: string
  sourcePage?: string
  service?: string
  budget?: string
  from?: string // YYYY-MM-DD
  to?: string
}

export async function queryLeads(f: LeadFilters): Promise<any[]> {
  await ensureDb()
  const where: string[] = []
  const params: unknown[] = []
  const p = () => `$${params.length}`

  if (f.q) {
    const like = `%${f.q}%`
    params.push(like)
    const n = p()
    where.push(`(name ILIKE ${n} OR email ILIKE ${n} OR company ILIKE ${n} OR message ILIKE ${n})`)
  }
  if (f.status) { params.push(f.status); where.push(`status = ${p()}`) }
  if (f.formType) { params.push(f.formType); where.push(`form_type = ${p()}`) }
  if (f.sourcePage) { params.push(`%${f.sourcePage}%`); where.push(`source_page ILIKE ${p()}`) }
  if (f.service) { params.push(`%"${f.service}"%`); where.push(`extra LIKE ${p()}`) }
  if (f.budget) { params.push(`%"budget":"${f.budget}"%`); where.push(`extra LIKE ${p()}`) }
  if (f.from) { params.push(`${f.from}T00:00:00Z`); where.push(`created_at >= ${p()}::timestamptz`) }
  if (f.to) { params.push(`${f.to}T23:59:59Z`); where.push(`created_at <= ${p()}::timestamptz`) }

  const sql = `SELECT * FROM leads ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id DESC`
  const rows = await q(sql, params)
  // Serialize timestamps consistently
  return rows.map((r) => ({
    ...r,
    created_at: fmt(r.created_at),
    updated_at: fmt(r.updated_at),
  }))
}

function fmt(v: unknown): string {
  if (v instanceof Date) return v.toISOString().replace('T', ' ').slice(0, 19)
  return String(v ?? '')
}

export const LEAD_EXPORT_HEADERS = [
  'ID', 'Created', 'Name', 'Email', 'Company', 'Phone', 'Form', 'Source page',
  'Services', 'Budget', 'Timeline', 'Referral', 'Status', 'Message', 'Notes',
]

export function leadToRow(l: any): string[] {
  let extra: any = {}
  try { extra = JSON.parse(l.extra || '{}') } catch {}
  return [
    String(l.id), l.created_at ?? '', l.name ?? '', l.email ?? '', l.company ?? '', l.phone ?? '',
    l.form_type ?? '', l.source_page ?? '',
    Array.isArray(extra.services) ? extra.services.join('; ') : '',
    extra.budget ?? '', extra.timeline ?? '', extra.referral ?? '',
    l.status ?? '', l.message ?? '', l.notes ?? '',
  ]
}
