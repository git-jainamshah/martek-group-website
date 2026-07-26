import { redirect } from 'next/navigation'
import { ensureDb } from '@/lib/admin/db'
import { getSessionUser } from '@/lib/admin/auth'
import DashboardView from './DashboardView'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await ensureDb()

  const me = await getSessionUser()
  // Leads-only accounts land straight in the Leads area
  if (me && (me.role === 'leads_view' || me.role === 'leads_edit')) redirect('/admin/leads')

  return <DashboardView firstName={me?.first_name || 'there'} />
}
