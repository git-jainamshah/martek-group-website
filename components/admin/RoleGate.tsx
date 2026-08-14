'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Restricted accounts are kept inside the areas they're allowed to see:
 *  - Leads View / Leads Edit → /admin/leads only
 *  - Manager → /admin/leads and /admin/finance only
 * The main dashboard (/admin) is available to everyone.
 * Any other page redirects them to their home. Mutating APIs are additionally
 * guarded server-side, so this is UX, not the security line.
 */
export default function RoleGate({ allowedPrefixes }: { allowedPrefixes?: string[] }) {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (!allowedPrefixes || !allowedPrefixes.length || !pathname) return
    /* The main dashboard is shared by every role, so it is allowed exactly.
       It cannot go in allowedPrefixes: '/admin' is a prefix of every admin
       route, so adding it there would silently unlock the whole panel. */
    const ok = pathname === '/admin' ||
      allowedPrefixes.some((p) => pathname === p || pathname.startsWith(p))
    if (!ok) router.replace(allowedPrefixes[0])
  }, [allowedPrefixes, pathname, router])
  return null
}
