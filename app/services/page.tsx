import ServicesView from './view'
import { getSlot } from '@/lib/media-slots-server'

export default async function Services() {
  const bannerImage = await getSlot('services-banner')
  return <ServicesView bannerImage={bannerImage} />
}
