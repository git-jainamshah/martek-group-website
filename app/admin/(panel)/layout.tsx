import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/admin/auth'
import Sidebar from '@/components/admin/Sidebar'
import RoleGate from '@/components/admin/RoleGate'
import NotificationBell from '@/components/admin/NotificationBell'

export const dynamic = 'force-dynamic'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  let user
  try {
    user = await getSessionUser()
  } catch (e: any) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="ad-card" style={{ maxWidth: 460 }}>
          <h2 style={{ color: 'var(--brand-ink)', marginBottom: 8 }}>Database not connected</h2>
          <p style={{ fontSize: 14, marginBottom: 8 }}>{e?.message || 'The admin backend could not reach its database.'}</p>
          <p className="ad-mut" style={{ fontSize: 12.5 }}>
            On Vercel: Storage → Create Database → Neon Postgres, connect it to this project, then redeploy.
            Locally: add DATABASE_URL to .env.local.
          </p>
        </div>
      </div>
    )
  }
  if (!user) redirect('/admin/login')
  if (user.must_change_password) redirect('/admin/change-password')

  const allowedPrefixes =
    user.role === 'leads_view' || user.role === 'leads_edit'
      ? ['/admin/leads', '/admin/account']
      : user.role === 'manager'
        ? ['/admin/leads', '/admin/finance', '/admin/account']
        : undefined

  return (
    <div className="ad-shell">
      <RoleGate allowedPrefixes={allowedPrefixes} />
      <Sidebar userName={`${user.first_name} ${user.last_name}`} userEmail={user.email} role={user.role} />
      <main className="ad-main">
        {/* Bell floats above the page content so it is reachable from every
            screen without each page having to render its own header. */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end', height: 0 }}>
          <div style={{ transform: 'translateY(6px)' }}><NotificationBell /></div>
        </div>
        {children}
      </main>
    </div>
  )
}
