import type { Metadata } from 'next'

// Hard noindex for the entire admin area (also excluded from sitemap + robots + X-Robots-Tag header)
export const metadata: Metadata = {
  title: 'Martek Admin',
  robots: { index: false, follow: false, noarchive: true, nosnippet: true, noimageindex: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-neutral-950 text-neutral-100">{children}</div>
}
