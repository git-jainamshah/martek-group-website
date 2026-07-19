import BlogsPageView from './view'
import { getSlots } from '@/lib/media-slots-server'

export default async function BlogsPage() {
  const slots = await getSlots()
  return <BlogsPageView slots={slots} />
}
