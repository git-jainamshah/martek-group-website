'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Restricted accounts are kept inside the areas they're allowed to see:
 *  - Leads View / Leads Edit → /admin/leads only
 *  - Manager → /admin/leads and /admin/finance only
 * Any other page redirects them to their home. Mutating APIs are additionally
 * guarded server-side, so this is UX, not the security line.
 */
export default function RoleGate({ allowedPrefixes }: { allowedPrefixes?: string[] }) {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (!allowedPrefixes || !allowedPrefixes.length || !pathname) return
    const ok = allowedPrefixes.some((p) => pathname === p || pathname.startsWith(p))
    if (!ok) router.replace(allowedPrefixes[0])
  }, [allowedPrefixes, pathname, router])
  return null
}
