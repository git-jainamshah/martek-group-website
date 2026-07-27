import { NextRequest, NextResponse } from 'next/server'
import { isProduction } from '@/lib/env'

const SESSION_COOKIE = 'marrelay_admin_session'

/** Hard "do not index" header. */
const NOINDEX = 'noindex, nofollow, noarchive, nosnippet'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Never index the admin area (belt-and-suspenders on top of robots + metadata)
    const noindex = (res: NextResponse) => {
      res.headers.set('X-Robots-Tag', NOINDEX)
      return res
    }

    const isPublicAdminPath =
      pathname === '/admin/login' ||
      pathname.startsWith('/api/admin/auth/login')

    const hasSession = !!req.cookies.get(SESSION_COOKIE)?.value

    if (!isPublicAdminPath && !hasSession) {
      if (pathname.startsWith('/api/')) {
        return noindex(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', pathname)
      return noindex(NextResponse.redirect(url))
    }
    return noindex(NextResponse.next())
  }

  // On QA / DEV every page carries a noindex header. robots.txt asks crawlers not
  // to fetch; this header guarantees that anything they do reach stays out of the
  // index, which matters because a page can be indexed purely from an inbound link.
  // Production is untouched: this branch never runs there.
  if (!isProduction) {
    const res = NextResponse.next()
    res.headers.set('X-Robots-Tag', NOINDEX)
    return res
  }

  return NextResponse.next()
}

export const config = {
  // Admin paths always; everything else so non-production can be marked noindex.
  // Static assets and image optimisation are skipped to keep this cheap.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
}
