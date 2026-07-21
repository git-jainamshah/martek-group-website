'use client'

import { useEffect } from 'react'
import { trackViewItem } from './events'

/** Fires a GA4 `view_item` once when a service page mounts. */
export default function ViewItem({ serviceKey }: { serviceKey: string }) {
  useEffect(() => {
    trackViewItem(serviceKey)
  }, [serviceKey])
  return null
}
