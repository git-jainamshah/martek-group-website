'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Image as ImageIcon, HardDrive, BarChart3,
  DollarSign, Megaphone, Users, Inbox, LogOut, Globe,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/media', label: 'Manage Media', icon: ImageIcon },
  { href: '/admin/storage', label: 'Storage', icon: HardDrive },
  { href: '/admin/analytics', label: 'Analytics & SEO', icon: BarChart3 },
  { href: '/admin/pricing', label: 'Pricing & Packages', icon: DollarSign },
  { href: '/admin/announcements', label: 'Announcements & Banners', icon: Megaphone },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/users', label: 'Access Management', icon: Users },
]

export default function Sidebar({ userName, userEmail }: { userName: string; userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-800 bg-neutral-950 flex flex-col min-h-screen sticky top-0 max-h-screen">
      <div className="p-5 border-b border-neutral-800">
        <div className="font-bold tracking-tight text-lg">Martek <span className="text-neutral-500">Admin</span></div>
        <div className="text-xs text-neutral-500 mt-0.5 truncate">{userName} · {userEmail}</div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active ? 'bg-white text-black font-semibold' : 'text-neutral-300 hover:bg-neutral-900'
              }`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-neutral-800 space-y-1">
        <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-900">
          <Globe className="w-4 h-4" /> View site
        </a>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-neutral-900">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  )
}
