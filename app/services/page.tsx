import { Metadata } from 'next'
import ServiceDetail from '@/components/ServiceDetail'

export const metadata: Metadata = {
  title: 'Our Services - Martek Group',
  description: 'Comprehensive digital and engineering services including web development, data analytics, social media marketing, SEO, and engineering drawings.',
}

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <ServiceDetail />
    </div>
  )
}
