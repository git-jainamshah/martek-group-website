import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ensureDb } from '@/lib/admin/db'
import { getSessionUser } from '@/lib/admin/auth'
import { q, q1 } from '@/lib/admin/pg'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await ensureDb()
  // Leads-only accounts land straight in the Leads area
  const me = await getSessionUser()
  if (me && (me.role === 'leads_view' || me.role === 'leads_edit')) redirect('/admin/leads')
  const count = async (sql: string) => Number((await q1<{ c: number }>(sql))?.c ?? 0)
  const stats = [
    { label: 'New leads', value: await count(`SELECT COUNT(*)::int AS c FROM leads WHERE status = 'new'`), href: '/admin/leads' },
    { label: 'Total leads', value: await count('SELECT COUNT(*)::int AS c FROM leads'), href: '/admin/leads' },
    { label: 'Media files', value: await count('SELECT COUNT(*)::int AS c FROM media'), href: '/admin/storage' },
    { label: 'Active scripts', value: await count('SELECT COUNT(*)::int AS c FROM scripts WHERE enabled = 1'), href: '/admin/analytics' },
    { label: 'Tag managers linked', value: await count('SELECT COUNT(*)::int AS c FROM tag_managers WHERE enabled = 1'), href: '/admin/analytics' },
    { label: 'Users with access', value: await count('SELECT COUNT(*)::int AS c FROM users WHERE active = 1'), href: '/admin/users' },
  ]
  const recentLeads = await q(
    'SELECT id, name, email, form_type, source_page, created_at FROM leads ORDER BY id DESC LIMIT 5'
  )

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm ad-mut mt-1">Everything that keeps marrelay.com running.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="ad-card hover:border-[#C9BEA3] transition">
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm ad-mut mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Latest leads</h2>
        {recentLeads.length === 0 ? (
          <p className="text-sm ad-soft">No leads yet - they&apos;ll appear here as soon as a visitor submits a form.</p>
        ) : (
          <div className="ad-table-wrap">
            <table className="w-full text-sm">
              <tbody>
                {recentLeads.map((l: any) => (
                  <tr key={l.id} className="border-b border-[#E2D9C4] last:border-0">
                    <td className="px-4 py-3 font-medium">{l.name || '-'}</td>
                    <td className="px-4 py-3 ad-mut">{l.email}</td>
                    <td className="px-4 py-3 ad-mut">{l.form_type}</td>
                    <td className="px-4 py-3 ad-soft">{String(l.created_at).slice(0, 19).replace('T', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
