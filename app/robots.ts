import { MetadataRoute } from 'next'

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Admin-managed extra rules (graceful fallback when DB is unavailable)
  let extraDisallow: string[] = []
  try {
    const { getSetting } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const cfg = await getSetting<{ extraDisallow: string[] }>('robots_txt')
    if (cfg?.extraDisallow) extraDisallow = cfg.extraDisallow
  } catch {
    // no DB - defaults only
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // '/admin' is intentionally NOT listed here - listing it in robots.txt would
      // advertise its existence. It's protected by auth + X-Robots-Tag + meta noindex
      // and excluded from the sitemap instead.
      disallow: ['/api/', '/_next/', ...extraDisallow],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.marrelay.com'}/sitemap.xml`,
  }
}
