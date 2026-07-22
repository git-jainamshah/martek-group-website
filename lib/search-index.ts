/**
 * Static searchable index of public pages. The site is a fixed set of pages,
 * so a small in-memory index gives instant, backend-free search. Keep this in
 * sync when adding pages.
 */
export type SearchDoc = {
  title: string
  url: string
  section: string
  description: string
  keywords: string[]
}

export const SEARCH_INDEX: SearchDoc[] = [
  {
    title: 'Home', url: '/', section: 'Marrelay',
    description: 'A small studio that ships big things - web, data, social, SEO & ads, and engineering/CAD.',
    keywords: ['home', 'studio', 'marrelay', 'digital studio', 'toronto', 'overview'],
  },
  {
    title: 'About Us', url: '/about', section: 'Studio',
    description: 'Who we are - a founder-led studio in Toronto that sweats the details.',
    keywords: ['about', 'team', 'founders', 'story', 'who we are', 'toronto'],
  },
  {
    title: 'Contact Us', url: '/contact', section: 'Get in touch',
    description: 'Tell us about your project. Fixed-price quotes and weekly demos.',
    keywords: ['contact', 'quote', 'get in touch', 'enquiry', 'book a call', 'email', 'phone'],
  },
  {
    title: 'Pricing', url: '/#pricing', section: 'Pricing',
    description: 'Fixed-price packages and what each one includes.',
    keywords: ['pricing', 'cost', 'packages', 'price', 'quote', 'rates', 'budget'],
  },
  // Services
  {
    title: 'Web Development', url: '/services/web-development', section: 'Services',
    description: 'Marketing sites, product UIs, and online stores - fast, accessible, easy to update.',
    keywords: ['web', 'website', 'web development', 'landing page', 'next.js', 'react', 'ecommerce', 'store', 'ui', 'cms', 'redesign'],
  },
  {
    title: 'Data & Analytics', url: '/services/data-analytics', section: 'Services',
    description: 'Tagging, GA4, dashboards, and a weekly report that drives decisions.',
    keywords: ['data', 'analytics', 'ga4', 'google analytics', 'tagging', 'gtm', 'tag manager', 'dashboard', 'tracking', 'reporting', 'bigquery'],
  },
  {
    title: 'Social', url: '/services/social', section: 'Services',
    description: 'Strategy, content, community, and creator partnerships across your channels.',
    keywords: ['social', 'social media', 'instagram', 'tiktok', 'content', 'community', 'creator', 'influencer', 'marketing'],
  },
  {
    title: 'SEO & Ads', url: '/services/seo-ads', section: 'Services',
    description: 'Technical SEO, content, and paid search & social that compound.',
    keywords: ['seo', 'ads', 'google ads', 'ppc', 'paid search', 'paid social', 'search engine optimization', 'sem', 'ranking', 'keywords'],
  },
  {
    title: 'Engineering & CAD', url: '/services/engineering', section: 'Services',
    description: 'Mechanical drafting, blueprints, and 3D modelling - precise and on time.',
    keywords: ['engineering', 'cad', 'cam', 'drafting', 'blueprint', 'drawings', '3d modelling', 'mechanical', 'solidworks', 'fusion 360', 'gd&t'],
  },
  // Case studies
  {
    title: 'Case Studies', url: '/case-studies', section: 'Case Studies',
    description: 'Worked-through examples of how we approach web, data, and engineering projects.',
    keywords: ['case studies', 'work', 'examples', 'portfolio', 'projects', 'results'],
  },
  {
    title: 'Web Development - Case Study', url: '/projects/web-development', section: 'Case Studies',
    description: 'How we would rebuild a slow site into a fast, measurable one that converts.',
    keywords: ['case study', 'web', 'website', 'conversion', 'redesign', 'example'],
  },
  {
    title: 'Data & Analytics - Case Study', url: '/projects/analytics-tagging', section: 'Case Studies',
    description: 'How we would turn a broken analytics stack into accurate GA4 + server-side tagging.',
    keywords: ['case study', 'data', 'analytics', 'ga4', 'tagging', 'dashboard', 'example'],
  },
  {
    title: 'Engineering & CAD - Case Study', url: '/projects/engineering-drawings', section: 'Case Studies',
    description: 'How we would turn sketches into precise, manufacturable CAD/CAM drawings.',
    keywords: ['case study', 'engineering', 'cad', 'cam', 'drawings', 'manufacturing', 'example', 'motor'],
  },
  // Legal
  {
    title: 'Terms of Service', url: '/terms', section: 'Legal',
    description: 'The terms that apply to using this site and our services.',
    keywords: ['terms', 'terms of service', 'legal', 'conditions'],
  },
  {
    title: 'Privacy Policy', url: '/privacy', section: 'Legal',
    description: 'How we handle your personal data.',
    keywords: ['privacy', 'privacy policy', 'data', 'gdpr', 'cookies', 'legal'],
  },
]

/** Score + rank docs for a query. Higher score = better match. */
export function searchDocs(query: string, limit = 8): SearchDoc[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)
  const scored = SEARCH_INDEX.map((doc) => {
    const title = doc.title.toLowerCase()
    const kw = doc.keywords.join(' ')
    const desc = doc.description.toLowerCase()
    let score = 0
    for (const t of terms) {
      if (title === t) score += 60
      if (title.startsWith(t)) score += 30
      if (title.includes(t)) score += 20
      if (doc.keywords.some((k) => k === t)) score += 18
      if (kw.includes(t)) score += 10
      if (desc.includes(t)) score += 5
      if (doc.section.toLowerCase().includes(t)) score += 6
    }
    // prefer primary service/main pages over their case-study counterparts
    if (score > 0) {
      if (doc.section === 'Services') score += 8
      else if (doc.section === 'Case Studies' && doc.url.startsWith('/projects/')) score -= 4
    }
    return { doc, score }
  }).filter((s) => s.score > 0)
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.doc)
}
