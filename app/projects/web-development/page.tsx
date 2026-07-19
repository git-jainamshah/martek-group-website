import WebDevelopmentPageView from './view'
import { getSlot } from '@/lib/media-slots-server'

export default async function WebDevelopmentPage() {
  const bannerVideo = await getSlot('project-web-video')
  return <WebDevelopmentPageView bannerVideo={bannerVideo} />
}
