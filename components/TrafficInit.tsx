'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initTraffic } from '@/analytics/traffic-identification'

/** Persists first-touch / session-touch attribution on every page view. */
export default function TrafficInit() {
  const pathname = usePathname()
  useEffect(() => {
    initTraffic()
  }, [pathname])
  return null
}
