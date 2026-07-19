import CaseStudiesPageView from './view'
import { getSlot } from '@/lib/media-slots-server'

export default async function CaseStudiesPage() {
  const bannerImage = await getSlot('case-studies-banner')
  return <CaseStudiesPageView bannerImage={bannerImage} />
}
