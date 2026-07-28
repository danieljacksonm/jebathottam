import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isLoginPath(pathname: string): boolean {
  return pathname === '/admin/login' || pathname === '/admin/login/';
}

function isTokenPresent(token: string | undefined): boolean {
  return Boolean(token && token.length > 10);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Always allow the login page through — never redirect it to itself
  if (isLoginPath(pathname)) {
    // If already logged in, go to dashboard (not back to login)
    if (isTokenPresent(token)) {
      return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // Protect other /admin routes
  if (pathname.startsWith('/admin') && !isTokenPresent(token)) {
    const loginUrl = new URL('/admin/login', request.nextUrl.origin);
    loginUrl.searchParams.set('from', pathname);
    const res = NextResponse.redirect(loginUrl);
    // Clear bad/partial cookie so it cannot keep looping
    res.cookies.set('auth-token', '', { path: '/', maxAge: 0 });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
