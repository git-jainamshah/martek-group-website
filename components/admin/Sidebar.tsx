'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
/* eslint-disable @next/next/no-img-element */
import {
  LayoutDashboard, Image as ImageIcon, HardDrive, BarChart3, DollarSign,
  Megaphone, Users, Inbox, LogOut, Globe, Building2, Share2, ScrollText,
  PanelLeftClose, PanelLeftOpen, LineChart, PhoneCall, Presentation,
  Wallet, Receipt, PieChart, TrendingUp, FileText, Briefcase, UserCog,
} from 'lucide-react'
import NotificationBell from './NotificationBell'

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
    label: 'Finance',
    items: [
      { href: '/admin/finance/revenue', label: 'Revenue Dashboard', icon: TrendingUp },
      { href: '/admin/finance/invoices', label: 'Invoices & Receipts', icon: FileText },
      { href: '/admin/finance/clients', label: 'Clients & Projects', icon: Briefcase },
      { href: '/admin/finance/dashboard', label: 'Expenses Dashboard', icon: PieChart },
      { href: '/admin/finance/expenses', label: 'Expenses', icon: Receipt },
      { href: '/admin/finance/accounts', label: 'Billing Accounts', icon: Wallet },
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
        {/* Bell lives here rather than floating over the page, where it
            collided with each page's own action buttons. */}
        <NotificationBell />
        <button onClick={toggle} className="ad-collapse-btn" style={{ width: 'auto', padding: 6 }}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}>
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="ad-nav">
        {GROUPS.map((rawGroup) => {
          const isLeads = (h: string) => h.startsWith('/admin/leads')
          const isFinance = (h: string) => h.startsWith('/admin/finance')
          let items = rawGroup.items
          if (role === 'admin') {
            // sees everything
          } else if (role === 'manager') {
            items = items.filter((i) => isLeads(i.href) || isFinance(i.href))
          } else if (role === 'leads_view' || role === 'leads_edit') {
            items = items.filter((i) => isLeads(i.href))
          } else {
            // editor / viewer: everything except Access Management and Finance
            items = items.filter((i) => i.href !== '/admin/users' && !isFinance(i.href))
          }
          const g = { ...rawGroup, items }
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
        <Link href="/admin/account" className={`ad-nav-item${pathname === '/admin/account' ? ' active' : ''}`} title="My account">
          <UserCog />
          {!collapsed && 'My Account'}
        </Link>
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
