import type { Metadata } from 'next'
import AnalyticsTaggingPageView from './view'
import { getSlot } from '@/lib/media-slots-server'

export const metadata: Metadata = {
  title: 'Analytics & Tagging Case Study · Marrelay',
  description:
    'How Marrelay rebuilds a broken analytics stack into an accurate, consent-compliant GA4 and server-side tagging architecture marketing can trust. An illustrative case study.',
  keywords: ['analytics case study', 'GA4 migration', 'server-side tagging', 'Google Tag Manager', 'conversion tracking', 'data analytics agency'],
  alternates: { canonical: '/projects/analytics-tagging' },
  openGraph: { title: 'Analytics & Tagging Case Study · Marrelay', description: 'Stop guessing. Measure what actually works.', url: '/projects/analytics-tagging' },
}

export default async function AnalyticsTaggingPage() {
  const bannerVideo = await getSlot('project-analytics-video')
  return <AnalyticsTaggingPageView bannerVideo={bannerVideo} />
}
