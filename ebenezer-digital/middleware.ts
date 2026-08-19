import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isLoginPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === '/admin/login';
}

function isSaasLoginPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === '/saas/login';
}

function isTokenPresent(token: string | undefined): boolean {
  return Boolean(token && token.length > 10);
}

function isInfoBlogHost(host: string): boolean {
  const h = host.toLowerCase().split(':')[0];
  return h === 'ebenezerdigital.info' || h === 'www.ebenezerdigital.info';
}

function isStoreHost(host: string): boolean {
  const h = host.toLowerCase().split(':')[0];
  return (
    h === 'ebenezer.store' ||
    h === 'www.ebenezer.store' ||
    h === 'ebenezerdigital.store' ||
    h === 'www.ebenezerdigital.store'
  );
}

function isToolsHost(host: string): boolean {
  const h = host.toLowerCase().split(':')[0];
  return h === 'tools.ebenezerdigital.com' || h === 'deals.ebenezerdigital.com';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const token = request.cookies.get('auth-token')?.value;
  const saasToken = request.cookies.get('saas-auth-token')?.value;

  // .info domain → blog-first experience
  if (isInfoBlogHost(host)) {
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/blog';
      return NextResponse.redirect(url);
    }
    // Short news URL → world newsroom
    if (pathname === '/news' || pathname === '/news/') {
      const url = request.nextUrl.clone();
      url.pathname = '/blog/news';
      return NextResponse.redirect(url);
    }
  }

  // .store domain → digital product store
  if (isStoreHost(host)) {
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/products';
      return NextResponse.redirect(url);
    }
  }

  // tools.ebenezerdigital.com → /tools comparison page
  if (isToolsHost(host)) {
    if (pathname === '/' || pathname === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/tools';
      return NextResponse.redirect(url);
    }
  }

  // Never redirect the login page (prevents infinite loops).
  if (isLoginPath(pathname)) {
    return NextResponse.next();
  }

  // SaaS login page should be public, but skip when already logged in.
  if (isSaasLoginPath(pathname)) {
    if (isTokenPresent(saasToken)) {
      const url = request.nextUrl.clone();
      url.pathname = '/saas';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect /saas routes with separate SaaS auth cookie.
  if (pathname.startsWith('/saas') && !isTokenPresent(saasToken)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/saas/login';
    loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
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
  matcher: ['/', '/news', '/news/:path*', '/admin', '/admin/:path*', '/blog', '/blog/:path*', '/products', '/products/:path*', '/saas', '/saas/:path*', '/tools', '/tools/:path*'],
};
