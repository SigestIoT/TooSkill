import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse, type NextRequest } from 'next/server'
import { verifyAdminSession } from './lib/auth/admin'

const intlMiddleware = createIntlMiddleware(routing)
const ADMIN_GUID = process.env.ADMIN_GUID

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes: auth guard
  if (pathname.startsWith('/admin')) {
    // If GUID is configured and path doesn't contain it, 404
    if (ADMIN_GUID && !pathname.includes(`/admin/${ADMIN_GUID}`)) {
      return new NextResponse(null, { status: 404 })
    }
    // Login page is always accessible
    if (pathname.endsWith('/login')) return NextResponse.next()

    // Verify JWT session
    const valid = await verifyAdminSession(request)
    if (!valid) {
      const guid = ADMIN_GUID ?? 'admin'
      return NextResponse.redirect(new URL(`/admin/${guid}/login`, request.url))
    }
    return NextResponse.next()
  }

  // API routes: skip i18n
  if (pathname.startsWith('/api')) return NextResponse.next()

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
