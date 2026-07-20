import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/admin/auth'
import {
  queryLeads, parseFilters,
  leadToRow, leadToMarketingRow,
  LEAD_EXPORT_HEADERS, MARKETING_EXPORT_HEADERS,
} from '@/lib/admin/leads'
import { toCsv, toXls, toPdf } from '@/lib/admin/export'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const p = req.nextUrl.searchParams
  const format = p.get('format') || 'csv'
  const marketing = p.get('view') === 'marketing'
  const leads = await queryLeads(parseFilters(p))

  const headers = marketing ? MARKETING_EXPORT_HEADERS : LEAD_EXPORT_HEADERS
  const rows = leads.map(marketing ? leadToMarketingRow : leadToRow)
  const stamp = new Date().toISOString().slice(0, 10)
  const base = marketing ? 'marrelay-leads-marketing' : 'marrelay-leads'

  if (format === 'xls') {
    return new NextResponse(toXls('Leads', headers, rows), {
      headers: {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': `attachment; filename="${base}-${stamp}.xls"`,
      },
    })
  }
  if (format === 'pdf') {
    const pdf = toPdf(`Marrelay - Leads (${stamp})`, headers, rows)
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${base}-${stamp}.pdf"`,
      },
    })
  }
  return new NextResponse(toCsv(headers, rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${base}-${stamp}.csv"`,
    },
  })
}
