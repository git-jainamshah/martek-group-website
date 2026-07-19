import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/admin/auth'
import { leadStats, parseFilters } from '@/lib/admin/leads'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const stats = await leadStats(parseFilters(req.nextUrl.searchParams))
  return NextResponse.json({ stats })
}
