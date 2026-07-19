import Link from 'next/link'
import { db } from '@/lib/admin/db'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const d = db()
  const count = (sql: string) => (d.prepare(sql).get() as { c: number }).c
  const stats = [
    { label: 'New leads', value: count(`SELECT COUNT(*) c FROM leads WHERE status = 'new'`), href: '/admin/leads' },
    { label: 'Total leads', value: count('SELECT COUNT(*) c FROM leads'), href: '/admin/leads' },
    { label: 'Media files', value: count('SELECT COUNT(*) c FROM media'), href: '/admin/storage' },
    { label: 'Active scripts', value: count('SELECT COUNT(*) c FROM scripts WHERE enabled = 1'), href: '/admin/analytics' },
    { label: 'Tag managers linked', value: count('SELECT COUNT(*) c FROM tag_managers WHERE enabled = 1'), href: '/admin/analytics' },
    { label: 'Users with access', value: count('SELECT COUNT(*) c FROM users WHERE active = 1'), href: '/admin/users' },
  ]
  const recentLeads = d.prepare('SELECT id, name, email, form_type, source_page, created_at FROM leads ORDER BY id DESC LIMIT 5').all() as any[]

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-neutral-400 mt-1">Everything that keeps martekgroup.com running.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-600 transition">
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-neutral-400 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Latest leads</h2>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-neutral-500">No leads yet — they&apos;ll appear here as soon as a visitor submits a form.</p>
        ) : (
          <div className="border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id} className="border-b border-neutral-800 last:border-0">
                    <td className="px-4 py-3 font-medium">{l.name || '—'}</td>
                    <td className="px-4 py-3 text-neutral-400">{l.email}</td>
                    <td className="px-4 py-3 text-neutral-400">{l.form_type}</td>
                    <td className="px-4 py-3 text-neutral-500">{l.created_at}</td>
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
