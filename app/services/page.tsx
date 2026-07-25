import type { Metadata } from 'next'
import ServicesView from './view'
import { getSlot } from '@/lib/media-slots-server'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Web development, data & analytics, social media, SEO & ads, and engineering/CAD for small and mid-size businesses. Fixed-price, founder-led, Toronto-based.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Marrelay - Services',
    description: 'Web, data, social, SEO & ads, and engineering/CAD. Fixed-price and founder-led.',
    url: '/services',
  },
}

export default async function Services() {
  const bannerImage = await getSlot('services-banner')
  return <ServicesView bannerImage={bannerImage} />
}
