import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'martek_admin_session'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Never index the admin area (belt-and-suspenders on top of robots + metadata)
    const noindex = (res: NextResponse) => {
      res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
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

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
