import type { Metadata } from 'next'
import CaseStudiesPageView from './view'
import { getSlot } from '@/lib/media-slots-server'

export const metadata: Metadata = {
  title: 'Case Studies · Marrelay',
  description:
    'Worked-through examples of how Marrelay approaches web development, data & analytics, and engineering/CAD projects, from brief to results.',
  keywords: ['case studies', 'web development case study', 'analytics case study', 'CAD case study', 'digital studio'],
  alternates: { canonical: '/case-studies' },
  openGraph: { title: 'Case Studies · Marrelay', description: 'See how we would take your project from brief to results.', url: '/case-studies' },
}

export default async function CaseStudiesPage() {
  const bannerImage = await getSlot('case-studies-banner')
  return <CaseStudiesPageView bannerImage={bannerImage} />
}
