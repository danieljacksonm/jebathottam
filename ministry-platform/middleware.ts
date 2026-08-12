import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/jwt-edge';

const ADMIN_ROLES = new Set(['super_admin', 'media_team', 'ministry_member']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const auth = await verifyAuthToken(token);

  if (pathname.startsWith('/admin')) {
    if (!auth.valid || !auth.role || !ADMIN_ROLES.has(auth.role)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname === '/login' && auth.valid && auth.role && ADMIN_ROLES.has(auth.role)) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
