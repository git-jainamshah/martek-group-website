'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendCard, AreaChart, HBarChart, ShareBar, Donut, Panel } from '@/components/admin/charts'
import { fmtDateTime, fmtRelative } from '@/lib/admin/dates'
import { isProduction, envLabel, SITE_URL } from '@/lib/env'

/** Host of the site this admin panel manages, e.g. "qa.marrelay.com". */
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')

type Stats = {
  kpis: {
    totalLeads: number; newLeads: number; mediaFiles: number; activeScripts: number
    tagManagers: number; activeUsers: number
    last7: number; prev7: number; delta7: number | null
    last30: number; prev30: number; delta30: number | null
    stale: number; blogViews: number
  }
  series: { date: string; value: number }[]
  byStatus: { label: string; value: number }[]
  byForm: { label: string; value: number }[]
  byChannel: { label: string; value: number }[]
  byPage: { label: string; value: number }[]
  topPosts: { label: string; value: number }[]
  recent: any[]
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified',
  won: 'Won', lost: 'Lost', spam: 'Spam',
}
const FORM_LABELS: Record<string, string> = {
  contact: 'Contact form', 'promo-banner': 'Promo banner', other: 'Other',
}
const STATUS_TONE: Record<string, string> = {
  new: '#8390C8', contacted: '#F2CC8F', qualified: '#6B9080',
  won: '#2F6B4F', lost: '#C8141B', spam: '#6E6A62',
}

export default function DashboardView({ firstName }: { firstName: string }) {
  const [s, setS] = useState<Stats | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    // no-store: the route is already force-dynamic server-side, this stops the
    // browser serving a cached copy after a back/forward navigation.
    fetch('/api/admin/dashboard', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Could not load dashboard data.'))))
      .then(setS)
      .catch((e) => setErr(e.message))
  }, [])

  const greeting = (() => {
    const h = Number(new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/Toronto' }))
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  if (err) return <div className="ad-alert err">{err}</div>

  if (!s) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm ad-mut mt-1">Loading your numbers…</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="ad-card" style={{ padding: 18, height: 118, opacity: 0.5 }} />
          ))}
        </div>
      </div>
    )
  }

  const k = s.kpis
  const spark = s.series.slice(-14).map((d) => d.value)
  const busiestDay = [...s.series].sort((a, b) => b.value - a.value)[0]

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{greeting}, {firstName}</h1>
          {/* Name the site this data actually came from. Hardcoding marrelay.com
              made QA and DEV claim to be showing production while reading their
              own database - the fastest way to act on the wrong numbers. */}
          <p className="text-sm ad-mut mt-1">
            Here is how {SITE_HOST} is doing. All times shown in Eastern.
          </p>
          {/* Deliberately no database name here: this is a client component and
              the connection string is server-only. The env ribbon at the top of
              the page already shows which database is connected. */}
          {!isProduction && (
            <p className="text-xs ad-mut mt-1" style={{ fontFamily: 'var(--mono)' }}>
              {envLabel} data · not the live site
            </p>
          )}
        </div>
        <Link href="/admin/leads" className="ad-btn">View all leads</Link>
      </div>

      {/* Needs attention */}
      {k.stale > 0 && (
        <Link href="/admin/leads?status=new" className="ad-alert" style={{ display: 'block', textDecoration: 'none' }}>
          <b>{k.stale} lead{k.stale === 1 ? '' : 's'} still marked New after 48 hours.</b>{' '}
          <span className="ad-mut">Worth a follow-up before they go cold.</span>
        </Link>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TrendCard
          label="Leads this week" value={k.last7} delta={k.delta7} spark={spark}
          sub={`vs ${k.prev7} the week before`} href="/admin/leads"
        />
        <TrendCard
          label="Leads last 30 days" value={k.last30} delta={k.delta30}
          sub={`vs ${k.prev30} the previous 30`} href="/admin/leads"
        />
        <TrendCard label="New / unactioned" value={k.newLeads} sub="Waiting for a first reply" href="/admin/leads" />
        <TrendCard label="Total leads" value={k.totalLeads} sub="All time, stored permanently" href="/admin/leads" />
      </div>

      {/* Trend */}
      <Panel
        title="Leads over the last 30 days"
        subtitle={busiestDay && busiestDay.value > 0 ? `Busiest day: ${busiestDay.date} with ${busiestDay.value}` : 'Hover a point for the daily count'}
      >
        <AreaChart data={s.series} />
      </Panel>

      {/* Two-up breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Where leads come from" subtitle="Channel of the visit that produced the lead">
          {s.byChannel.length ? <ShareBar data={s.byChannel} /> : <p className="ad-soft" style={{ fontSize: 13 }}>No channel data yet.</p>}
        </Panel>

        <Panel title="Pipeline by status" subtitle="Every lead, by where it stands">
          <Donut data={s.byStatus.map((r) => ({ ...r, label: STATUS_LABELS[r.label] ?? r.label }))} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Top landing pages" subtitle="The page a lead was on when they submitted">
          <HBarChart data={s.byPage} />
        </Panel>

        <Panel title="Which form they used" subtitle="Contact form vs promo banner">
          <HBarChart data={s.byForm.map((r) => ({ ...r, label: FORM_LABELS[r.label] ?? r.label }))} />
        </Panel>
      </div>

      {/* Blog */}
      {k.blogViews > 0 && (
        <Panel
          title="Blog reads" subtitle={`${k.blogViews} article view${k.blogViews === 1 ? '' : 's'} so far`}
          action={<Link href="/blogs" target="_blank" className="ad-mut" style={{ fontSize: 12.5 }}>Open blog →</Link>}
        >
          <HBarChart data={s.topPosts.map((p) => ({ ...p, label: p.label.replace(/-/g, ' ') }))} />
        </Panel>
      )}

      {/* Recent leads */}
      <Panel
        title="Latest leads"
        action={<Link href="/admin/leads" className="ad-mut" style={{ fontSize: 12.5 }}>See all →</Link>}
      >
        {s.recent.length === 0 ? (
          <p className="ad-soft" style={{ fontSize: 13 }}>
            No leads yet - they will appear here as soon as a visitor submits a form.
          </p>
        ) : (
          <div className="ad-table-wrap" style={{ border: 0 }}>
            <table className="w-full text-sm">
              <tbody>
                {s.recent.map((l: any) => (
                  <tr key={l.id} className="border-b border-[#E2D9C4] last:border-0">
                    <td className="px-3 py-3">
                      <div className="font-medium">{l.name || 'Unnamed'}</div>
                      <div className="ad-soft text-xs">{l.email}</div>
                    </td>
                    <td className="px-3 py-3 ad-mut" style={{ fontSize: 12.5 }}>
                      {FORM_LABELS[l.form_type] ?? l.form_type ?? '-'}
                    </td>
                    <td className="px-3 py-3">
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999,
                        background: (STATUS_TONE[l.status] ?? '#6E6A62') + '22',
                        color: STATUS_TONE[l.status] ?? '#6E6A62',
                      }}>
                        {STATUS_LABELS[l.status] ?? l.status ?? 'New'}
                      </span>
                    </td>
                    <td className="px-3 py-3 ad-soft" style={{ fontSize: 12, whiteSpace: 'nowrap' }}
                      title={fmtDateTime(l.created_at)}>
                      <div>{fmtDateTime(l.created_at)}</div>
                      <div style={{ fontSize: 11, opacity: 0.75 }}>{fmtRelative(l.created_at)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* System row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TrendCard label="Media files" value={k.mediaFiles} href="/admin/storage" />
        <TrendCard label="Active scripts" value={k.activeScripts} href="/admin/analytics" />
        <TrendCard label="Tag managers linked" value={k.tagManagers} href="/admin/analytics" />
        <TrendCard label="Users with access" value={k.activeUsers} href="/admin/users" />
      </div>
    </div>
  )
}
