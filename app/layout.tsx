import type { Metadata } from 'next'
import { Instrument_Serif, Fraunces, DM_Sans, JetBrains_Mono, Poppins } from 'next/font/google'
import './globals.css'
import './martek.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { SOCIALS } from '@/lib/social'
import { HeadScripts, BodyStartScripts, FooterScripts } from '@/components/SiteScripts'

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.martekgroup.com'

// ISR: pages stay statically served (fast) but refresh within 60s, so
// admin changes (scripts, pricing, announcement copy) go live within a minute.
export const revalidate = 60

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Martek Group · A small studio that ships big things',
    template: '%s',
  },
  description:
    'Founder-led digital studio in Toronto. Web development, data & analytics, social, SEO & ads, and engineering/CAD for startups — fixed-price quotes, weekly demos, you own everything.',
  keywords: [
    'web development Toronto',
    'startup web design',
    'data analytics setup',
    'social media management',
    'SEO agency Toronto',
    'Google Ads management',
    'CAD drafting services',
    'engineering drawings',
    'digital studio Toronto',
  ],
  authors: [{ name: 'Martek Group' }],
  creator: 'Martek Group',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'Martek Group',
    title: 'Martek Group · A small studio that ships big things',
    description:
      'Founder-led digital studio in Toronto. Web, data, social, SEO & ads, and engineering for startups — fixed-price quotes, weekly demos.',
    type: 'website',
    locale: 'en_CA',
    url: '/',
    images: [{ url: '/assets/martek-group-header.png', width: 1200, height: 630, alt: 'Martek Group — digital studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Martek Group · A small studio that ships big things',
    description:
      'Founder-led digital studio in Toronto. Web, data, social, SEO & ads, and engineering for startups.',
    images: ['/assets/martek-group-header.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  // Merge admin-managed SEO settings (site verification tags) when available
  try {
    const { getSetting } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const seo = await getSetting<{ googleVerification?: string; bingVerification?: string }>('seo')
    const verification: Metadata['verification'] = {}
    if (seo?.googleVerification) verification.google = seo.googleVerification
    if (seo?.bingVerification) verification.other = { 'msvalidate.01': seo.bingVerification }
    return { ...baseMetadata, ...(Object.keys(verification).length ? { verification } : {}) }
  } catch {
    return baseMetadata
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'Martek Group',
  description:
    'Founder-led digital studio building websites, analytics, social, SEO & ads, and engineering/CAD deliverables for startups.',
  url: SITE_URL,
  logo: `${SITE_URL}/assets/martek-mark.png`,
  image: `${SITE_URL}/assets/martek-group-header.png`,
  email: 'hello@martek.studio',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Toronto',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  areaServed: 'Worldwide',
  priceRange: '$$',
  sameAs: SOCIALS.map((s) => s.href),
  founder: { '@type': 'Person', name: 'Martek Group founders' },
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web development', url: `${SITE_URL}/services/web-development` } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Data & analytics', url: `${SITE_URL}/services/data-analytics` } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Social media management', url: `${SITE_URL}/services/social` } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO & paid ads', url: `${SITE_URL}/services/seo-ads` } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Engineering & CAD drafting', url: `${SITE_URL}/services/engineering` } },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrument.variable} ${fraunces.variable} ${dmSans.variable} ${jetbrains.variable} ${poppins.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <HeadScripts />
      </head>
      <body className="dot-bg">
        <BodyStartScripts />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <FooterScripts />
      </body>
    </html>
  )
}
