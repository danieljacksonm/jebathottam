import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CANONICAL_URLS, resolveEcosystemUrl } from "@/lib/ecosystem-urls";
import { isNewsCategorySegment } from "@/lib/news-url";
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

/** Soft Edge gate — APIs still verify JWT with `verifyToken`. Rejects garbage/expired cookies. */
function isTokenPresent(token: string | undefined): boolean {
  if (!token || token.length < 20) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: number; role?: string };
    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) return false;
    if (payload.role !== "admin") return false;
    return true;
  } catch {
    return false;
  }
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

const SHARED_ROOT_RESERVED = new Set([
  "privacy",
  "terms",
  "sitemap",
  "sitemap.html",
  "api",
  "admin",
  "_next",
  "llms.txt",
  "robots.txt",
  "favicon.ico",
  "icon",
  "apple-icon",
  "manifest.webmanifest",
  "login",
  "register",
  "app",
]);

/**
 * Map public pretty paths on dedicated hosts → internal App Router paths.
 * Returns null when the path should pass through unchanged (or is handled elsewhere).
 */
function mapPrettyPathForHost(host: string, pathname: string): string | null {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  if (isToolsHost(host)) {
    if (path === "/" || path === "") return "/tools";
    if (path === "/compare" || path.startsWith("/compare/")) return `/tools${path}`;
    if (path === "/guides" || path.startsWith("/guides/")) return `/tools${path}`;
    const slug = path.match(/^\/([^/]+)$/);
    if (slug && !SHARED_ROOT_RESERVED.has(slug[1]) && slug[1] !== "tools") {
      return `/tools/${slug[1]}`;
    }
    return null;
  }

  if (isJournalHost(host)) {
    if (path === "/" || path === "") return "/blog";
    if (path === "/news" || path.startsWith("/news/")) return null; // redirected to news host
    if (path.startsWith("/blog")) return null;
    const slug = path.match(/^\/([^/]+)$/);
    if (slug && !SHARED_ROOT_RESERVED.has(slug[1])) {
      return `/blog/${slug[1]}`;
    }
    return null;
  }

  if (isNewsHost(host)) {
    if (path === "/" || path === "") return "/blog/news";
    if (path === "/newsroom" || path.startsWith("/newsroom/")) return `/blog${path}`;
    if (path === "/affiliate-disclosure") return "/site-legal/affiliate-disclosure";
    if (path.startsWith("/blog")) return null;
    // /{category}/{slug} → /blog/news/{slug}
    const catSlug = path.match(/^\/([^/]+)\/([^/]+)$/);
    if (catSlug && isNewsCategorySegment(catSlug[1])) {
      return `/blog/news/${catSlug[2]}`;
    }
    const slug = path.match(/^\/([^/]+)$/);
    if (
      slug &&
      !SHARED_ROOT_RESERVED.has(slug[1]) &&
      slug[1] !== "newsroom" &&
      slug[1] !== "affiliate-disclosure" &&
      !isNewsCategorySegment(slug[1])
    ) {
      return `/blog/news/${slug[1]}`;
    }
    return null;
  }

  if (isProductsCatalogHost(host)) {
    if (path === "/" || path === "") return "/catalog";
    if (
      path === "/compare" ||
      path.startsWith("/compare/") ||
      path === "/recommend" ||
      path.startsWith("/recommend/") ||
      path === "/guides" ||
      path.startsWith("/guides/") ||
      path === "/p" ||
      path.startsWith("/p/") ||
      path === "/laptops" ||
      path.startsWith("/laptops/") ||
      path === "/go" ||
      path.startsWith("/go/")
    ) {
      return `/catalog${path}`;
    }
    const slug = path.match(/^\/([^/]+)$/);
    if (slug && !SHARED_ROOT_RESERVED.has(slug[1]) && slug[1] !== "catalog") {
      return `/catalog/${slug[1]}`;
    }
    return null;
  }

  if (isApexInfoHost(host)) {
    if (path === "/guides" || path.startsWith("/guides/")) return `/info${path}`;
    return null;
  }

  return null;
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
  if (pathname === "/sitemap.html" || pathname === "/sitemap.html/") {
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

/** Only bounce clearly misplaced news/journal paths — do not reshuffle other hosts. */
function foreignSectionRedirect(
  request: NextRequest,
  host: string,
  pathname: string
): NextResponse | null {
  // Store / tools / saas / etc. must not serve the news desk
  if (!isNewsHost(host)) {
    if (pathname === "/blog/news" || pathname === "/blog/news/") {
      return absoluteRedirect(request, NEWS_URL, "/");
    }
    if (pathname.startsWith("/blog/news/")) {
      return absoluteRedirect(request, NEWS_URL, pathname.replace(/^\/blog\/news/, "") || "/");
    }
    if (pathname.startsWith("/blog/newsroom")) {
      return absoluteRedirect(request, NEWS_URL, pathname.replace(/^\/blog/, "") || "/newsroom");
    }
  }

  // Same for journal — only when this host is not journal/news/.com (studio has its own redirects)
  const h = hostName(host);
  const studio =
    h === "ebenezerdigital.com" || h === "www.ebenezerdigital.com";
  if (!isJournalHost(host) && !isNewsHost(host) && !studio) {
    if (pathname === "/blog" || pathname === "/blog/") {
      return absoluteRedirect(request, JOURNAL_URL, "/");
    }
    if (pathname.startsWith("/blog/")) {
      return absoluteRedirect(request, JOURNAL_URL, pathname.replace(/^\/blog/, "") || "/");
    }
  }

  return null;
}

function localeRewrite(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const m = pathname.match(/^\/([a-z]{2})(\/.*)?$/i);
  if (!m) return null;
  const locale = m[1].toLowerCase();
  if (!LOCALES.has(locale)) return null;

  const rest = m[2] || "/";
  const host = request.headers.get("host") || "";
  const dedicatedPrettyHost =
    isToolsHost(host) ||
    isJournalHost(host) ||
    isNewsHost(host) ||
    isProductsCatalogHost(host) ||
    isStoreHost(host) ||
    isApexInfoHost(host) ||
    isNetworkHost(host);

  const allowed =
    rest === "/" ||
    dedicatedPrettyHost ||
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
    rest.startsWith("/insights") ||
    rest.startsWith("/compare") ||
    rest.startsWith("/guides") ||
    rest.startsWith("/recommend");

  if (!allowed) return null;

  // Locale prefixes must not bypass cross-host content gates
  // (e.g. store…/hi/blog/news → news host).
  const foreignLocalized = foreignSectionRedirect(request, host, rest);
  if (foreignLocalized) return foreignLocalized;

  if (locale === "en") {
    const url = request.nextUrl.clone();
    url.pathname = rest;
    return NextResponse.redirect(url);
  }

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
    else if (
      rest === "/sitemap" ||
      rest === "/sitemap.html" ||
      rest.startsWith("/sitemap/")
    ) {
      target = "/site-sitemap";
    } else {
      target = mapPrettyPathForHost(host, rest) || rest;
    }
  } else {
    const mapped = mapPrettyPathForHost(host, rest);
    if (mapped) target = mapped;
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

  const foreign = foreignSectionRedirect(request, host, pathname);
  if (foreign) return foreign;

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
      pathname === "/blog" || pathname === "/blog/" ? "/" : pathname.replace(/^\/blog/, "") || "/"
    );
  }

  // Move digital store off .com → store subdomain
  if (isProdStudio && (pathname === "/products" || pathname.startsWith("/products/"))) {
    return absoluteRedirect(
      request,
      STORE_URL,
      pathname === "/products" || pathname === "/products/" ? "/" : pathname.replace(/^\/products/, "") || "/"
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
    const rest =
      pathname === "/blog/news" || pathname === "/blog/news/"
        ? "/"
        : pathname.replace(/^\/blog\/news/, "") || "/";
    return absoluteRedirect(request, NEWS_URL, rest);
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
      return absoluteRedirect(request, JOURNAL_URL, pathname.replace(/^\/blog/, "") || "/");
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
    if (pathname.startsWith("/guides/") || pathname === "/guides") {
      url.pathname = pathname === "/guides" ? "/info/guides" : `/info${pathname}`;
      return NextResponse.rewrite(url);
    }
    if (pathname.startsWith("/info/guides/")) {
      const rest = pathname.slice("/info".length) || "/guides";
      return absoluteRedirect(request, `https://${hostName(host)}`, rest);
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
    if (pathname === "/blog/news" || pathname === "/blog/news/") {
      return absoluteRedirect(request, `https://${hostName(host)}`, "/");
    }
    if (pathname.startsWith("/blog/news/")) {
      const rest = pathname.slice("/blog/news".length) || "/";
      return absoluteRedirect(request, `https://${hostName(host)}`, rest);
    }
    if (pathname.startsWith("/blog/newsroom/")) {
      const rest = pathname.replace(/^\/blog/, "") || "/newsroom";
      return absoluteRedirect(request, `https://${hostName(host)}`, rest);
    }
    const mapped = mapPrettyPathForHost(host, pathname);
    if (mapped) {
      const url = request.nextUrl.clone();
      url.pathname = mapped;
      return NextResponse.rewrite(url);
    }
  }

  if (isJournalHost(host)) {
    if (pathname === "/news" || pathname === "/news/") {
      return absoluteRedirect(request, NEWS_URL, "/");
    }
    if (pathname === "/blog" || pathname === "/blog/") {
      return absoluteRedirect(request, `https://${hostName(host)}`, "/");
    }
    if (pathname.startsWith("/blog/") && !pathname.startsWith("/blog/news")) {
      const rest = pathname.slice("/blog".length) || "/";
      return absoluteRedirect(request, `https://${hostName(host)}`, rest);
    }
    const mapped = mapPrettyPathForHost(host, pathname);
    if (mapped) {
      const url = request.nextUrl.clone();
      url.pathname = mapped;
      return NextResponse.rewrite(url);
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
    if (pathname.startsWith("/tools/")) {
      const rest = pathname.slice("/tools".length) || "/";
      return absoluteRedirect(request, `https://${hostName(host)}`, rest);
    }
    const mapped = mapPrettyPathForHost(host, pathname);
    if (mapped) {
      const url = request.nextUrl.clone();
      url.pathname = mapped;
      return NextResponse.rewrite(url);
    }
  }

  if (isProductsCatalogHost(host)) {
    if (pathname === "/catalog" || pathname === "/catalog/") {
      return absoluteRedirect(request, `https://${hostName(host)}`, "/");
    }
    if (pathname.startsWith("/catalog/")) {
      const rest = pathname.slice("/catalog".length) || "/";
      return absoluteRedirect(request, `https://${hostName(host)}`, rest);
    }
    const mapped = mapPrettyPathForHost(host, pathname);
    if (mapped) {
      const url = request.nextUrl.clone();
      url.pathname = mapped;
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

  if (isSaasLoginPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl, 308);
  }

  if (pathname === "/saas" || pathname === "/saas/") {
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
    /*
     * Run on all page routes (pretty slugs on tools/journal/news/store hosts).
     * Skip Next static assets, images, and files with extensions.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|map|json|xml|txt|ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot)$).*)",
  ],
};
