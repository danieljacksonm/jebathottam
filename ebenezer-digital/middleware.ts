import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isTokenPresent(token: string | undefined): boolean {
  return Boolean(token && token.length > 10);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isTokenPresent(token)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === '/admin/login' && isTokenPresent(token)) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
