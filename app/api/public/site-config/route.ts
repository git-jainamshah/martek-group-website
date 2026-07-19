import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Public, unauthenticated site config consumed by the Navbar (announcement bar)
 * and the promo banner. Only whitelisted, non-sensitive settings are exposed.
 */
export async function GET() {
  try {
    const { getSetting } = require('@/lib/admin/db') as typeof import('@/lib/admin/db')
    const [announcement, promoBanner, company, socialsRaw] = await Promise.all([
      getSetting('announcement'),
      getSetting('promo_banner'),
      getSetting('company'),
      getSetting<{ platform: string; label: string; href: string; enabled: boolean }[]>('socials'),
    ])
    const socials = (socialsRaw ?? []).filter((s) => s.enabled && s.href)
    return NextResponse.json(
      { announcement, promoBanner, company, socials },
      { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } }
    )
  } catch {
    return NextResponse.json({ announcement: null, promoBanner: null, company: null, socials: null })
  }
}
