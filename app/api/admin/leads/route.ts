import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/admin/auth'
import { queryLeads, parseFilters } from '@/lib/admin/leads'
import { purgeExpiredDeletedLeads } from '@/lib/admin/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  await purgeExpiredDeletedLeads()
  const leads = await queryLeads(parseFilters(req.nextUrl.searchParams))
  return NextResponse.json({ leads })
}
