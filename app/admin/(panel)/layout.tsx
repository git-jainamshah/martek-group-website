import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/admin/auth'
import Sidebar from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  let user
  try {
    user = await getSessionUser()
  } catch (e: any) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md bg-neutral-900 border border-red-900 rounded-2xl p-6 space-y-3">
          <div className="text-lg font-bold text-red-400">Database not connected</div>
          <p className="text-sm text-neutral-300">{e?.message || 'The admin backend could not reach its database.'}</p>
          <p className="text-xs text-neutral-500">
            On Vercel: Storage → Create Database → Neon Postgres, connect it to this project, then redeploy.
            Locally: add DATABASE_URL to .env.local.
          </p>
        </div>
      </div>
    )
  }
  if (!user) redirect('/admin/login')
  if (user.must_change_password) redirect('/admin/change-password')

  return (
    <div className="flex">
      <Sidebar userName={`${user.first_name} ${user.last_name}`} userEmail={user.email} />
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  )
}
