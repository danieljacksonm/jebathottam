import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthTokenValid } from '@/lib/jwt-edge';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const isLoggedIn = isAuthTokenValid(token);

  // Protect admin: redirect to login if no valid auth token
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If already logged in and visiting login page, redirect to admin
  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
