import AnalyticsTaggingPageView from './view'
import { getSlot } from '@/lib/media-slots-server'

export default async function AnalyticsTaggingPage() {
  const bannerVideo = await getSlot('project-analytics-video')
  return <AnalyticsTaggingPageView bannerVideo={bannerVideo} />
}
