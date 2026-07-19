import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/admin/auth'
import { queryLeads, leadToRow, LEAD_EXPORT_HEADERS } from '@/lib/admin/leads'
import { toCsv, toXls, toPdf } from '@/lib/admin/export'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = requireUser()
  if ('error' in auth) return auth.error
  const p = req.nextUrl.searchParams
  const format = p.get('format') || 'csv'
  const leads = queryLeads({
    q: p.get('q') || undefined,
    status: p.get('status') || undefined,
    formType: p.get('formType') || undefined,
    sourcePage: p.get('sourcePage') || undefined,
    service: p.get('service') || undefined,
    budget: p.get('budget') || undefined,
    from: p.get('from') || undefined,
    to: p.get('to') || undefined,
  })
  const rows = leads.map(leadToRow)
  const stamp = new Date().toISOString().slice(0, 10)

  if (format === 'xls') {
    return new NextResponse(toXls('Leads', LEAD_EXPORT_HEADERS, rows), {
      headers: {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': `attachment; filename="martek-leads-${stamp}.xls"`,
      },
    })
  }
  if (format === 'pdf') {
    const pdf = toPdf(`Martek Group — Leads (${stamp})`, LEAD_EXPORT_HEADERS, rows)
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="martek-leads-${stamp}.pdf"`,
      },
    })
  }
  return new NextResponse(toCsv(LEAD_EXPORT_HEADERS, rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="martek-leads-${stamp}.csv"`,
    },
  })
}
