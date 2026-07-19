import EngineeringDrawingsPageView from './view'
import { getSlot } from '@/lib/media-slots-server'

export default async function EngineeringDrawingsPage() {
  const bannerVideo = await getSlot('project-eng-video')
  return <EngineeringDrawingsPageView bannerVideo={bannerVideo} />
}
