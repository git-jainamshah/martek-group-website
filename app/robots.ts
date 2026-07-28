import { MetadataRoute } from 'next'
import { isProduction, SITE_URL } from '@/lib/env'

export default async function robots(): Promise<MetadataRoute.Robots> {
  // QA and DEV must never be crawled: an indexed qa.marrelay.com would be a full
  // duplicate of the production site and would compete with it in search.
  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

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
      //
      // '/_next/' must NOT be blocked. Google needs the CSS and JS bundles under
      // /_next/static/ to render the page; blocking them makes Googlebot evaluate a
      // partially-rendered page and shows up as "Blocked by robots.txt" in Search
      // Console. /_next/image is the image optimiser, needed for Google Images.
      disallow: ['/api/', ...extraDisallow],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
