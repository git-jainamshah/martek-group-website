import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.martekgroup.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes: { path: string; changeFrequency: 'weekly' | 'monthly'; priority: number }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/services/web-development', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/services/data-analytics', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/services/social', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/services/seo-ads', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/services/engineering', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/services', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.5 },
  ]

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
