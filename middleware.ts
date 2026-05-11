import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Admin rotaları oturum gerektiriyor
  if (pathname.startsWith('/admin') && pathname !== '/admin/giris') {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/giris', req.url))
    }

    // Sadece SUPER_ADMIN'e özel rotalar
    const superAdminOnly = ['/admin/kullanicilar', '/admin/ayarlar']
    if (superAdminOnly.some(r => pathname.startsWith(r))) {
      if (session.user.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
    }
  }

  // Giriş yapmışsa /admin/giris'e erişmesin
  if (pathname === '/admin/giris' && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
