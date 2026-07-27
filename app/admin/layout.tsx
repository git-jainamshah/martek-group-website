import type { Metadata } from 'next'
import './admin.css'
import EnvBanner from '@/components/admin/EnvBanner'
import { isProduction, envLabel } from '@/lib/env'

// Hard noindex for the entire admin area (also excluded from sitemap + robots + X-Robots-Tag header)
export const metadata: Metadata = {
  // absolute stops the public "Marrelay - %s" template from prefixing admin titles.
  // Non-production gets the environment in the tab title so a stray QA tab is obvious.
  title: { absolute: isProduction ? 'Marrelay Admin' : `[${envLabel}] Marrelay Admin` },
  robots: { index: false, follow: false, noarchive: true, nosnippet: true, noimageindex: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm">
      <EnvBanner />
      {children}
    </div>
  )
}
