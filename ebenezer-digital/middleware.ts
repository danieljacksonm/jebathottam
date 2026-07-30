import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isLoginPath(pathname: string): boolean {
  return (
    pathname === '/admin/login' ||
    pathname === '/admin/login/' ||
    pathname.startsWith('/admin/login?')
  );
}

function isTokenPresent(token: string | undefined): boolean {
  return Boolean(token && token.length > 10);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // ALWAYS show login page. Do not redirect based on cookie.
  // (Cookie redirects were causing ERR_TOO_MANY_REDIRECTS.)
  if (isLoginPath(pathname)) {
    return NextResponse.next();
  }

  // Protect other /admin routes
  if (pathname.startsWith('/admin') && !isTokenPresent(token)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('from', pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set('auth-token', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
