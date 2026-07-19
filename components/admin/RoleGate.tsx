'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Leads-only accounts (Leads View / Leads Edit) are kept inside the Leads
 * area: any other admin page redirects them to /admin/leads. Mutating APIs
 * are additionally guarded server-side, so this is UX, not the security line.
 */
export default function RoleGate({ leadsOnly }: { leadsOnly: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (leadsOnly && pathname && !pathname.startsWith('/admin/leads')) {
      router.replace('/admin/leads')
    }
  }, [leadsOnly, pathname, router])
  return null
}
