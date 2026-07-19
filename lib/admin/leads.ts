import { db } from './db'

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

export function queryLeads(f: LeadFilters) {
  const where: string[] = []
  const params: unknown[] = []
  if (f.q) {
    where.push(`(name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)`)
    const like = `%${f.q}%`
    params.push(like, like, like, like)
  }
  if (f.status) { where.push('status = ?'); params.push(f.status) }
  if (f.formType) { where.push('form_type = ?'); params.push(f.formType) }
  if (f.sourcePage) { where.push('source_page LIKE ?'); params.push(`%${f.sourcePage}%`) }
  if (f.service) { where.push('extra LIKE ?'); params.push(`%"${f.service}"%`) }
  if (f.budget) { where.push(`extra LIKE ?`); params.push(`%"budget":"${f.budget}"%`) }
  if (f.from) { where.push(`created_at >= ?`); params.push(`${f.from} 00:00:00`) }
  if (f.to) { where.push(`created_at <= ?`); params.push(`${f.to} 23:59:59`) }

  const sql = `SELECT * FROM leads ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id DESC`
  return db().prepare(sql).all(...params) as any[]
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
