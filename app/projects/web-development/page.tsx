import type { Metadata } from 'next'
import WebDevelopmentPageView from './view'
import { getSlot } from '@/lib/media-slots-server'

export const metadata: Metadata = {
  title: 'Web Development Case Study · Marrelay',
  description:
    'How Marrelay rebuilds a slow, hard-to-edit website into a fast, measurable, conversion-focused ecosystem the team can run themselves. An illustrative case study.',
  keywords: ['web development case study', 'website redesign', 'conversion optimization', 'Core Web Vitals', 'Next.js agency'],
  alternates: { canonical: '/projects/web-development' },
  openGraph: { title: 'Web Development Case Study · Marrelay', description: 'A website that sells, not just sits there.', url: '/projects/web-development' },
}

export default async function WebDevelopmentPage() {
  const bannerVideo = await getSlot('project-web-video')
  return <WebDevelopmentPageView bannerVideo={bannerVideo} />
}
