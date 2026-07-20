import type { Metadata } from 'next'
import './admin.css'

// Hard noindex for the entire admin area (also excluded from sitemap + robots + X-Robots-Tag header)
export const metadata: Metadata = {
  title: 'Marrelay Admin',
  robots: { index: false, follow: false, noarchive: true, nosnippet: true, noimageindex: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="adm">{children}</div>
}
