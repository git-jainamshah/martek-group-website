import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/admin/auth'
import { queryLeads } from '@/lib/admin/leads'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const p = req.nextUrl.searchParams
  const leads = await queryLeads({
    q: p.get('q') || undefined,
    status: p.get('status') || undefined,
    formType: p.get('formType') || undefined,
    sourcePage: p.get('sourcePage') || undefined,
    service: p.get('service') || undefined,
    budget: p.get('budget') || undefined,
    from: p.get('from') || undefined,
    to: p.get('to') || undefined,
  })
  return NextResponse.json({ leads })
}
