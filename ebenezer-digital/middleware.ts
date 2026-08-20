import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = new Set([
  "en", "hi", "ta", "te", "ml", "kn", "bn", "mr", "gu", "pa", "ur",
  "es", "fr", "ar", "de", "pt", "ru", "ja", "ko", "zh", "tr", "id",
]);

function isLoginPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === "/admin/login";
}

function isSaasLoginPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === "/saas/login";
}

function isTokenPresent(token: string | undefined): boolean {
  return Boolean(token && token.length > 10);
}

function isInfoBlogHost(host: string): boolean {
  const h = host.toLowerCase().split(":")[0];
  return h === "ebenezerdigital.info" || h === "www.ebenezerdigital.info";
}

function isStoreHost(host: string): boolean {
  const h = host.toLowerCase().split(":")[0];
  return (
    h === "ebenezer.store" ||
    h === "www.ebenezer.store" ||
    h === "ebenezerdigital.store" ||
    h === "www.ebenezerdigital.store"
  );
}

function isToolsHost(host: string): boolean {
  const h = host.toLowerCase().split(":")[0];
  return h === "tools.ebenezerdigital.com" || h === "deals.ebenezerdigital.com";
}

/** Physical product comparison platform (NOT the digital store). */
function isProductsCatalogHost(host: string): boolean {
  const h = host.toLowerCase().split(":")[0];
  return h === "products.ebenezerdigital.com" || h === "www.products.ebenezerdigital.com";
}

function localeRewrite(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const m = pathname.match(/^\/([a-z]{2})(\/.*)?$/i);
  if (!m) return null;
  const locale = m[1].toLowerCase();
  if (!LOCALES.has(locale)) return null;

  const rest = m[2] || "/";
  const allowed =
    rest === "/" ||
    rest.startsWith("/products") ||
    rest.startsWith("/blog") ||
    rest.startsWith("/saas") ||
    rest.startsWith("/services") ||
    rest.startsWith("/work") ||
    rest.startsWith("/contact") ||
    rest.startsWith("/ai") ||
    rest.startsWith("/news") ||
    rest.startsWith("/tools") ||
    rest.startsWith("/catalog");

  if (!allowed) return null;

  // /en/... → clean URL without prefix
  if (locale === "en") {
    const url = request.nextUrl.clone();
    url.pathname = rest;
    return NextResponse.redirect(url);
  }

  const host = request.headers.get("host") || "";
  let target = rest;
  if (rest === "/") {
    if (isStoreHost(host)) target = "/products";
    else if (isInfoBlogHost(host)) target = "/blog";
    else target = "/";
  }

  const url = request.nextUrl.clone();
  url.pathname = target;
  const res = NextResponse.rewrite(url);
  res.cookies.set("eben-locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  res.headers.set("x-eben-locale", locale);
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const token = request.cookies.get("auth-token")?.value;

  const localized = localeRewrite(request);
  if (localized) return localized;

  if (isInfoBlogHost(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/blog";
      return NextResponse.redirect(url);
    }
    if (pathname === "/news" || pathname === "/news/") {
      const url = request.nextUrl.clone();
      url.pathname = "/blog/news";
      return NextResponse.redirect(url);
    }
  }

  if (isStoreHost(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/products";
      return NextResponse.redirect(url);
    }
  }

  if (isToolsHost(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/tools";
      return NextResponse.redirect(url);
    }
  }

  if (isProductsCatalogHost(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/catalog";
      return NextResponse.redirect(url);
    }
  }

  if (isLoginPath(pathname)) {
    return NextResponse.next();
  }

  // /saas is a public product landing page (Yegova Billing).
  // Do not force login — the live app sits on billing.ebenezerdigital.com.
  if (isSaasLoginPath(pathname) || pathname === "/saas" || pathname === "/saas/") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && !isTokenPresent(token)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set("auth-token", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/news",
    "/news/:path*",
    "/admin",
    "/admin/:path*",
    "/blog",
    "/blog/:path*",
    "/products",
    "/products/:path*",
    "/saas",
    "/saas/:path*",
    "/tools",
    "/tools/:path*",
    "/catalog",
    "/catalog/:path*",
    "/:locale",
    "/:locale/:path*",
  ],
};
