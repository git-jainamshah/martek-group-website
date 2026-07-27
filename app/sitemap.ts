import { MetadataRoute } from 'next'
import { POSTS } from '@/lib/blog'
import { SITE_URL } from '@/lib/env'

const baseUrl = SITE_URL

// Stable per-build timestamp. Using a fresh Date() on every request makes every
// URL look "changed" on every crawl, which search engines learn to distrust.
// This is fixed at build/module-load time and moves forward each deploy.
const LAST_BUILD = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  const now = LAST_BUILD

  const routes: { path: string; changeFrequency: 'weekly' | 'monthly'; priority: number }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/services/web-development', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/services/data-analytics', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/services/social', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/services/seo-ads', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/services/engineering', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/case-studies', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/projects/web-development', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/projects/analytics-tagging', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/projects/engineering-drawings', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/services', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/blogs', changeFrequency: 'weekly', priority: 0.8 },
    ...POSTS.map((post) => ({
      path: `/blogs/${post.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
