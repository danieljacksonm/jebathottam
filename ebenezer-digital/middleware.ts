import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isLoginPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === '/admin/login';
}

function isTokenPresent(token: string | undefined): boolean {
  return Boolean(token && token.length > 10);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Never redirect the login page (prevents infinite loops).
  if (isLoginPath(pathname)) {
    return NextResponse.next();
  }

  // Protect other /admin routes
  if (pathname.startsWith('/admin') && !isTokenPresent(token)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.search = '';
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set('auth-token', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
