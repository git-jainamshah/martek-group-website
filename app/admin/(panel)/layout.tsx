import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/admin/auth'
import Sidebar from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = getSessionUser()
  if (!user) redirect('/admin/login')
  if (user.must_change_password) redirect('/admin/change-password')

  return (
    <div className="flex">
      <Sidebar userName={`${user.first_name} ${user.last_name}`} userEmail={user.email} />
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  )
}
