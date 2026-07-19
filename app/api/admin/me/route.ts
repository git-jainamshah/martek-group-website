import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Who am I: lets client pages adapt to the signed-in user's access level. */
export async function GET() {
  const auth = await requireUser()
  if ('error' in auth) return auth.error
  const { id, first_name, last_name, email, role } = auth.user
  return NextResponse.json({
    user: { id, name: `${first_name} ${last_name}`, email, role },
    canEditLeads: ['admin', 'editor', 'leads_edit'].includes(role),
  })
}
