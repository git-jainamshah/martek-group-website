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
    const [announcement, promoBanner] = await Promise.all([
      getSetting('announcement'),
      getSetting('promo_banner'),
    ])
    return NextResponse.json(
      { announcement, promoBanner },
      { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } }
    )
  } catch {
    return NextResponse.json({ announcement: null, promoBanner: null })
  }
}
