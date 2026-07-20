'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
/* eslint-disable @next/next/no-img-element */
import {
  LayoutDashboard, Image as ImageIcon, HardDrive, BarChart3, DollarSign,
  Megaphone, Users, Inbox, LogOut, Globe, Building2, Share2, ScrollText,
  PanelLeftClose, PanelLeftOpen, LineChart, PhoneCall, Presentation,
} from 'lucide-react'

const GROUPS: { label: string; items: { href: string; label: string; icon: any }[] }[] = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/media', label: 'Manage Media', icon: ImageIcon },
      { href: '/admin/storage', label: 'Storage', icon: HardDrive },
      { href: '/admin/pricing', label: 'Pricing & Packages', icon: DollarSign },
      { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { href: '/admin/legal', label: 'Terms & Privacy', icon: ScrollText },
    ],
  },
  {
    label: 'Growth',
    items: [
      { href: '/admin/leads/dashboard', label: 'Leads Dashboard', icon: BarChart3 },
      { href: '/admin/leads', label: 'Leads', icon: Inbox },
      { href: '/admin/leads/marketing', label: 'Lead Marketing', icon: Megaphone },
      { href: '/admin/leads/offline', label: 'Offline Leads', icon: PhoneCall },
      { href: '/admin/leads/pitches', label: 'Pitches', icon: Presentation },
      { href: '/admin/analytics', label: 'Analytics & SEO', icon: LineChart },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href: '/admin/company', label: 'Company Profile', icon: Building2 },
      { href: '/admin/socials', label: 'Social Links', icon: Share2 },
      { href: '/admin/users', label: 'Access Management', icon: Users },
    ],
  },
]

export default function Sidebar({ userName, userEmail, role = 'admin' }: { userName: string; userEmail: string; role?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setCollapsed(localStorage.getItem('marrelay_admin_sidebar') === 'collapsed')
  }, [])

  function toggle() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('marrelay_admin_sidebar', next ? 'collapsed' : 'open')
  }

  async function logout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className={`ad-side ${collapsed ? 'collapsed' : ''}`}>
      <div className="ad-side-head">
        <img src="/assets/martek-mark.png" alt="Marrelay" />
        {!collapsed && (
          <div className="ad-side-title" style={{ flex: 1 }}>
            <b>Marrelay <span>Admin</span></b>
            <small title={userEmail}>{userName}</small>
          </div>
        )}
        <button onClick={toggle} className="ad-collapse-btn" style={{ width: 'auto', padding: 6 }}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}>
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="ad-nav">
        {GROUPS.map((rawGroup) => {
          const leadsOnly = role === 'leads_view' || role === 'leads_edit'
          const g = leadsOnly
            ? { ...rawGroup, items: rawGroup.items.filter((i) => i.href.startsWith('/admin/leads')) }
            : role === 'admin'
              ? rawGroup
              : { ...rawGroup, items: rawGroup.items.filter((i) => i.href !== '/admin/users') }
          if (!g.items.length) return null
          return (
          <div key={g.label} className="ad-nav-group">
            <div className="ad-nav-group-label">{g.label}</div>
            {g.items.map(({ href, label, icon: Icon }) => {
              const allHrefs = GROUPS.flatMap((gr) => gr.items.map((i) => i.href))
              const active = href === '/admin'
                ? pathname === '/admin'
                : pathname === href ||
                  (!!pathname?.startsWith(href + '/') &&
                    !allHrefs.some((h) => h !== href && h.startsWith(href) && pathname?.startsWith(h)))
              return (
                <Link key={href} href={href} title={collapsed ? label : undefined}
                  className={`ad-nav-item ${active ? 'active' : ''}`}>
                  <Icon />
                  {!collapsed && label}
                </Link>
              )
            })}
          </div>
          )
        })}
      </nav>

      <div className="ad-side-foot">
        <a href="/" target="_blank" className="ad-nav-item" title="View site">
          <Globe />
          {!collapsed && 'View site'}
        </a>
        <button onClick={logout} className="ad-nav-item" style={{ border: 0, background: 'transparent', cursor: 'pointer' }} title="Sign out">
          <LogOut />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  )
}
