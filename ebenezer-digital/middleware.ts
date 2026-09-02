import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CANONICAL_URLS, resolveEcosystemUrl } from "@/lib/ecosystem-urls";
import { SEO_LOCALES, siteKindFromHost } from "@/lib/site-url";

function clean(url: string) {
  return url.replace(/\/$/, "");
}

const AI_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_AI_URL, CANONICAL_URLS.ai));
const SAAS_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_SAAS_URL, CANONICAL_URLS.saas));
const DISCOVER_URL = clean(
  resolveEcosystemUrl(process.env.NEXT_PUBLIC_DISCOVER_URL, CANONICAL_URLS.discover)
);
const NEWS_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_NEWS_URL, CANONICAL_URLS.news));
const JOURNAL_URL = clean(
  resolveEcosystemUrl(process.env.NEXT_PUBLIC_JOURNAL_URL, CANONICAL_URLS.journal)
);
const INFO_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_INFO_URL, CANONICAL_URLS.info));
const STORE_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_STORE_URL, CANONICAL_URLS.store));

const LOCALES = new Set<string>(SEO_LOCALES);

function hostName(host: string): string {
  return host.toLowerCase().split(":")[0];
}

function withSiteKind(request: NextRequest, response: NextResponse): NextResponse {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const kind = siteKindFromHost(host);
  response.headers.set("x-eben-site-kind", kind);
  return response;
}

function nextWithSiteKind(request: NextRequest): NextResponse {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const kind = siteKindFromHost(host);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-eben-site-kind", kind);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

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

function isApexInfoHost(host: string): boolean {
  const h = hostName(host);
  return h === "ebenezerdigital.info" || h === "www.ebenezerdigital.info";
}

function isJournalHost(host: string): boolean {
  const h = hostName(host);
  return h === "journal.ebenezerdigital.info" || h === "www.journal.ebenezerdigital.info";
}

function isNewsHost(host: string): boolean {
  const h = hostName(host);
  return h === "news.ebenezerdigital.info" || h === "www.news.ebenezerdigital.info";
}

function isAiHost(host: string): boolean {
  const h = hostName(host);
  return h === "ai.ebenezerdigital.com" || h === "www.ai.ebenezerdigital.com";
}

function isSaasHost(host: string): boolean {
  const h = hostName(host);
  return h === "saas.ebenezerdigital.com" || h === "www.saas.ebenezerdigital.com";
}

function isDiscoverHost(host: string): boolean {
  const h = hostName(host);
  return h === "discover.ebenezerdigital.com" || h === "www.discover.ebenezerdigital.com";
}

function isStoreHost(host: string): boolean {
  const h = hostName(host);
  return (
    h === "ebenezer.store" ||
    h === "www.ebenezer.store" ||
    h === "ebenezerdigital.store" ||
    h === "www.ebenezerdigital.store"
  );
}

function isToolsHost(host: string): boolean {
  const h = hostName(host);
  return h === "tools.ebenezerdigital.com" || h === "deals.ebenezerdigital.com";
}

function isProductsCatalogHost(host: string): boolean {
  const h = hostName(host);
  return h === "products.ebenezerdigital.com" || h === "www.products.ebenezerdigital.com";
}

function isNetworkHost(host: string): boolean {
  const h = hostName(host);
  return h === "ebenezerdigital.net" || h === "www.ebenezerdigital.net";
}

function legalSitemapRewrite(request: NextRequest, pathname: string): NextResponse | null {
  const host = request.headers.get("host") || "";
  // .net serves custom legal pages under /network/* — do not rewrite to generic site-legal
  if (isNetworkHost(host)) {
    if (
      pathname === "/privacy" ||
      pathname === "/privacy/" ||
      pathname === "/terms" ||
      pathname === "/terms/" ||
      pathname === "/affiliate-disclosure" ||
      pathname === "/affiliate-disclosure/"
    ) {
      return null;
    }
  }

  const url = request.nextUrl.clone();
  if (pathname === "/privacy" || pathname === "/privacy/") {
    url.pathname = "/site-legal/privacy";
    return NextResponse.rewrite(url);
  }
  if (pathname === "/terms" || pathname === "/terms/") {
    url.pathname = "/site-legal/terms";
    return NextResponse.rewrite(url);
  }
  if (pathname === "/affiliate-disclosure" || pathname === "/affiliate-disclosure/") {
    url.pathname = "/site-legal/affiliate-disclosure";
    return NextResponse.rewrite(url);
  }
  if (pathname === "/sitemap" || pathname === "/sitemap/") {
    url.pathname = "/site-sitemap";
    return NextResponse.rewrite(url);
  }
  return null;
}

function absoluteRedirect(request: NextRequest, targetBase: string, pathname: string): NextResponse {
  const dest = new URL(pathname || "/", targetBase);
  dest.search = request.nextUrl.search;
  return NextResponse.redirect(dest, 308);
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
    rest.startsWith("/catalog") ||
    rest.startsWith("/discover") ||
    rest.startsWith("/info") ||
    rest.startsWith("/network") ||
    rest.startsWith("/about") ||
    rest.startsWith("/search") ||
    rest.startsWith("/privacy") ||
    rest.startsWith("/terms") ||
    rest.startsWith("/sitemap") ||
    rest.startsWith("/insights");

  if (!allowed) return null;

  if (locale === "en") {
    const url = request.nextUrl.clone();
    url.pathname = rest;
    return NextResponse.redirect(url);
  }

  const host = request.headers.get("host") || "";
  let target = rest;
  if (rest === "/") {
    if (isStoreHost(host)) target = "/products";
    else if (isNewsHost(host)) target = "/blog/news";
    else if (isAiHost(host)) target = "/ai";
    else if (isSaasHost(host)) target = "/saas";
    else if (isDiscoverHost(host)) target = "/discover";
    else if (isApexInfoHost(host)) target = "/info";
    else if (isJournalHost(host)) target = "/blog";
    else if (isToolsHost(host)) target = "/tools";
    else if (isProductsCatalogHost(host)) target = "/catalog";
    else if (isNetworkHost(host)) target = "/network";
    else target = "/";
  } else if (isApexInfoHost(host)) {
    if (rest === "/about" || rest.startsWith("/about/")) target = "/info/about";
    else if (rest === "/search" || rest.startsWith("/search/")) target = "/info/search";
    else if (rest === "/contact" || rest.startsWith("/contact/")) target = "/info/contact";
    else if (rest === "/privacy" || rest.startsWith("/privacy/")) target = "/site-legal/privacy";
    else if (rest === "/terms" || rest.startsWith("/terms/")) target = "/site-legal/terms";
    else if (rest === "/sitemap" || rest.startsWith("/sitemap/")) target = "/site-sitemap";
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
  res.headers.set("content-language", locale);
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const token = request.cookies.get("auth-token")?.value;

  const localized = localeRewrite(request);
  if (localized) return localized;

  const legal = legalSitemapRewrite(request, pathname);
  if (legal) return legal;

  const isProdStudio =
    hostName(host) === "ebenezerdigital.com" || hostName(host) === "www.ebenezerdigital.com";

  // Move AI off path-on-.com → ai subdomain (live hosts only)
  if (isProdStudio && (pathname === "/ai" || pathname.startsWith("/ai/"))) {
    return absoluteRedirect(request, AI_URL, pathname === "/ai" || pathname === "/ai/" ? "/" : pathname);
  }

  // Move SaaS off path-on-.com → saas subdomain
  if (isProdStudio && (pathname === "/saas" || pathname.startsWith("/saas/"))) {
    return absoluteRedirect(
      request,
      SAAS_URL,
      pathname === "/saas" || pathname === "/saas/" ? "/" : pathname
    );
  }

  // Move Discover off path-on-.com → discover subdomain
  if (isProdStudio && (pathname === "/discover" || pathname.startsWith("/discover/"))) {
    return absoluteRedirect(
      request,
      DISCOVER_URL,
      pathname === "/discover" || pathname === "/discover/" ? "/" : pathname
    );
  }

  // Move journal, news & newsroom off .com → correct subdomains
  if (isProdStudio && (pathname === "/blog" || pathname.startsWith("/blog/"))) {
    if (pathname === "/blog/news" || pathname.startsWith("/blog/news/")) {
      return absoluteRedirect(request, NEWS_URL, pathname);
    }
    if (pathname.startsWith("/blog/newsroom")) {
      return absoluteRedirect(request, NEWS_URL, pathname);
    }
    return absoluteRedirect(
      request,
      JOURNAL_URL,
      pathname === "/blog" || pathname === "/blog/" ? "/" : pathname
    );
  }

  // Move digital store off .com → store subdomain
  if (isProdStudio && (pathname === "/products" || pathname.startsWith("/products/"))) {
    return absoluteRedirect(
      request,
      STORE_URL,
      pathname === "/products" || pathname === "/products/" ? "/" : pathname
    );
  }

  // Move info gateway off .com → .info apex
  if (isProdStudio && (pathname === "/info" || pathname.startsWith("/info/"))) {
    const rest =
      pathname === "/info" || pathname === "/info/"
        ? "/"
        : pathname.replace(/^\/info/, "") || "/";
    return absoluteRedirect(request, INFO_URL, rest);
  }

  // Move news channel → news subdomain
  if (
    (isApexInfoHost(host) || isJournalHost(host)) &&
    !isNewsHost(host) &&
    (pathname === "/blog/news" || pathname.startsWith("/blog/news/"))
  ) {
    return absoluteRedirect(request, NEWS_URL, pathname);
  }

  // Apex .info = Information Network gateway (not full journal)
  if (isApexInfoHost(host)) {
    if (pathname === "/news" || pathname === "/news/") {
      return absoluteRedirect(request, NEWS_URL, "/");
    }
    if (pathname === "/blog" || pathname.startsWith("/blog/")) {
      if (pathname === "/blog" || pathname === "/blog/") {
        return absoluteRedirect(request, JOURNAL_URL, "/");
      }
      return absoluteRedirect(request, JOURNAL_URL, pathname);
    }

    const url = request.nextUrl.clone();
    if (pathname === "/" || pathname === "") {
      url.pathname = "/info";
      return NextResponse.rewrite(url);
    }
    if (pathname === "/about" || pathname === "/about/") {
      url.pathname = "/info/about";
      return NextResponse.rewrite(url);
    }
    if (pathname === "/search" || pathname === "/search/") {
      url.pathname = "/info/search";
      return NextResponse.rewrite(url);
    }
    if (pathname === "/contact" || pathname === "/contact/") {
      url.pathname = "/info/contact";
      return NextResponse.rewrite(url);
    }
    if (pathname.startsWith("/guides/")) {
      url.pathname = `/info${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  if (isAiHost(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/ai";
      return NextResponse.rewrite(url);
    }
  }

  if (isSaasHost(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/saas";
      return NextResponse.rewrite(url);
    }
  }

  if (isDiscoverHost(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/discover";
      return NextResponse.rewrite(url);
    }
  }

  if (isNewsHost(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/blog/news";
      return NextResponse.rewrite(url);
    }
  }

  if (isJournalHost(host)) {
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/blog";
      return NextResponse.rewrite(url);
    }
    if (pathname === "/news" || pathname === "/news/") {
      return absoluteRedirect(request, NEWS_URL, "/");
    }
  }

  if (isStoreHost(host)) {
    const storeReserved = new Set([
      "products",
      "privacy",
      "terms",
      "sitemap",
      "account",
      "checkout",
      "success",
      "category",
      "roadmap",
      "api",
      "admin",
      "_next",
    ]);
    const productPretty = pathname.match(/^\/products\/([^/]+)\/?$/);
    if (
      productPretty &&
      productPretty[1] !== "category" &&
      productPretty[1] !== "roadmap"
    ) {
      return absoluteRedirect(request, `https://${hostName(host)}`, `/${productPretty[1]}`);
    }
    if (pathname === "/products" || pathname === "/products/") {
      return absoluteRedirect(request, `https://${hostName(host)}`, "/");
    }
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/products";
      return NextResponse.rewrite(url);
    }
    const rootSlug = pathname.match(/^\/([^/]+)\/?$/);
    if (rootSlug && !storeReserved.has(rootSlug[1])) {
      const url = request.nextUrl.clone();
      url.pathname = `/products/${rootSlug[1]}`;
      return NextResponse.rewrite(url);
    }
  }

  if (isToolsHost(host)) {
    if (pathname === "/tools" || pathname === "/tools/") {
      return absoluteRedirect(request, `https://${hostName(host)}`, "/");
    }
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/tools";
      return NextResponse.rewrite(url);
    }
  }

  if (isProductsCatalogHost(host)) {
    if (pathname === "/catalog" || pathname === "/catalog/") {
      return absoluteRedirect(request, `https://${hostName(host)}`, "/");
    }
    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/catalog";
      return NextResponse.rewrite(url);
    }
  }

  if (isNetworkHost(host)) {
    if (pathname === "/network" || pathname === "/network/") {
      return absoluteRedirect(request, `https://${hostName(host)}`, "/");
    }
    const url = request.nextUrl.clone();
    if (pathname === "/" || pathname === "") {
      url.pathname = "/network";
      return NextResponse.rewrite(url);
    }
    // Pretty public URLs on .net → internal /network/* routes
    const map: Record<string, string> = {
      "/tools": "/network/tools",
      "/developers": "/network/developers",
      "/resources": "/network/resources",
      "/guides": "/network/guides",
      "/finder": "/network/finder",
      "/about": "/network/about",
      "/contact": "/network/contact",
      "/privacy": "/network/privacy",
      "/terms": "/network/terms",
      "/affiliate-disclosure": "/network/affiliate-disclosure",
    };
    if (map[pathname]) {
      url.pathname = map[pathname];
      return NextResponse.rewrite(url);
    }
    if (pathname.startsWith("/tools/")) {
      const rest = pathname.slice("/tools/".length).replace(/\/$/, "");
      // Pretty category hubs: /tools/developer → /network/tools/c/developer
      const categoryAliases: Record<string, string> = {
        developer: "developer",
        seo: "seo",
        image: "image",
        images: "image",
        pdf: "pdf",
        text: "text",
        calculator: "calculators",
        calculators: "calculators",
        business: "business",
        ai: "ai",
        converter: "calculators",
      };
      if (rest && !rest.includes("/") && categoryAliases[rest]) {
        url.pathname = `/network/tools/c/${categoryAliases[rest]}`;
        return NextResponse.rewrite(url);
      }
      // /tools/c/{category} → /network/tools/c/{category}
      url.pathname = `/network${pathname}`;
      return NextResponse.rewrite(url);
    }
    if (pathname.startsWith("/guides/")) {
      url.pathname = `/network${pathname}`;
      return NextResponse.rewrite(url);
    }
    if (pathname.startsWith("/network")) {
      return NextResponse.next();
    }
  }

  if (isLoginPath(pathname)) {
    return NextResponse.next();
  }

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

  return nextWithSiteKind(request);
}

export const config = {
  matcher: [
    "/",
    "/news",
    "/news/:path*",
    "/ai",
    "/ai/:path*",
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
    "/discover",
    "/info",
    "/info/:path*",
    "/search",
    "/network",
    "/network/:path*",
    "/developers",
    "/resources",
    "/guides",
    "/guides/:path*",
    "/finder",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/affiliate-disclosure",
    "/insights",
    "/insights/:path*",
    "/site-legal",
    "/site-legal/:path*",
    "/site-sitemap",
    "/:locale",
    "/:locale/:path*",
  ],
};
