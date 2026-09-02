import type { Metadata } from "next";
import { CANONICAL_URLS, resolveEcosystemUrl } from "./ecosystem-urls";

function clean(url: string) {
  return url.replace(/\/$/, "");
}

export const SITE_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_SITE_URL, CANONICAL_URLS.studio));
export const INFO_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_INFO_URL, CANONICAL_URLS.info));
export const JOURNAL_URL = clean(
  resolveEcosystemUrl(process.env.NEXT_PUBLIC_JOURNAL_URL, CANONICAL_URLS.journal)
);
export const NEWS_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_NEWS_URL, CANONICAL_URLS.news));
export const STORE_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_STORE_URL, CANONICAL_URLS.store));
export const PRODUCTS_URL = clean(
  resolveEcosystemUrl(process.env.NEXT_PUBLIC_PRODUCTS_URL, CANONICAL_URLS.products)
);
export const TOOLS_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_TOOLS_URL, CANONICAL_URLS.tools));
export const AI_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_AI_URL, CANONICAL_URLS.ai));
export const SAAS_URL = clean(resolveEcosystemUrl(process.env.NEXT_PUBLIC_SAAS_URL, CANONICAL_URLS.saas));
export const DISCOVER_URL = clean(
  resolveEcosystemUrl(process.env.NEXT_PUBLIC_DISCOVER_URL, CANONICAL_URLS.discover)
);
export const NETWORK_URL = clean(
  resolveEcosystemUrl(process.env.NEXT_PUBLIC_NETWORK_URL, CANONICAL_URLS.network)
);

/** Studio home — always canonical .com (never env-poisoned). Use for logo/footer "Ebenezer Digital" links. */
export const STUDIO_HOME_URL = CANONICAL_URLS.studio;

export type SiteKind =
  | "studio"
  | "info"
  | "journal"
  | "news"
  | "store"
  | "products"
  | "tools"
  | "ai"
  | "saas"
  | "discover"
  | "network";

/**
 * Public locale prefixes for SEO (hreflang + sitemap language alternates).
 * Each locale gets its own URL: /{locale}/path (en stays unprefixed).
 */
export const SEO_LOCALES = [
  "en", "hi", "ta", "te", "ml", "kn", "bn", "mr", "gu", "pa", "ur",
  "es", "fr", "ar", "de", "pt", "ru", "ja", "ko", "zh", "tr", "id",
] as const;

export type SeoLocale = (typeof SEO_LOCALES)[number];

export function languageAlternatesFor(path: string, origin?: string): Record<string, string> {
  const kind = siteKindFromPath(path);
  return languageAlternatesForPath(path, origin, kind);
}

/** Article pages without translated content — en + x-default only. */
export function articleLanguageAlternates(path: string, kind?: SiteKind): Record<string, string> {
  const resolvedKind = kind ?? siteKindFromPath(path);
  const url = publicUrlForInternalPath(path, resolvedKind);
  return { en: url, "x-default": url };
}

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Ebenezer Digital Services",
};

const OG_NEWS = {
  url: "/og-news.png",
  width: 1200,
  height: 630,
  alt: "Ebenezer News",
};

const OG_JOURNAL = {
  url: "/og-journal.png",
  width: 1200,
  height: 630,
  alt: "Ebenezer Journal",
};

const OG_STORE = {
  url: "/og-store.png",
  width: 1200,
  height: 630,
  alt: "Ebenezer Store",
};

function hostName(host?: string | null): string {
  return (host || "").toLowerCase().split(":")[0];
}

export function siteKindFromHost(host?: string | null): SiteKind {
  const h = hostName(host);
  if (h === "ai.ebenezerdigital.com" || h === "www.ai.ebenezerdigital.com") return "ai";
  if (h === "saas.ebenezerdigital.com" || h === "www.saas.ebenezerdigital.com") return "saas";
  if (h === "discover.ebenezerdigital.com" || h === "www.discover.ebenezerdigital.com") return "discover";
  if (h === "news.ebenezerdigital.info" || h === "www.news.ebenezerdigital.info") return "news";
  if (h === "ebenezerdigital.info" || h === "www.ebenezerdigital.info") return "info";
  if (h === "journal.ebenezerdigital.info" || h === "www.journal.ebenezerdigital.info") {
    return "journal";
  }
  if (
    h === "ebenezerdigital.store" ||
    h === "www.ebenezerdigital.store" ||
    h === "ebenezer.store" ||
    h === "www.ebenezer.store"
  ) {
    return "store";
  }
  if (h === "products.ebenezerdigital.com" || h === "www.products.ebenezerdigital.com") {
    return "products";
  }
  if (h === "tools.ebenezerdigital.com" || h === "deals.ebenezerdigital.com") {
    return "tools";
  }
  if (h === "ebenezerdigital.net" || h === "www.ebenezerdigital.net") {
    return "network";
  }
  return "studio";
}

/** Derive site kind from an internal app path (for metadata when host header unavailable). */
export function siteKindFromPath(path: string): SiteKind {
  if (path === "/ai" || path.startsWith("/ai/")) return "ai";
  if (path === "/saas" || path.startsWith("/saas/")) return "saas";
  if (path === "/discover" || path.startsWith("/discover/")) return "discover";
  if (path === "/info" || path.startsWith("/info/")) return "info";
  if (path === "/blog/news" || path.startsWith("/blog/news/")) return "news";
  if (path === "/blog" || path.startsWith("/blog/")) return "journal";
  if (path === "/products" || path.startsWith("/products/")) return "store";
  if (path === "/catalog" || path.startsWith("/catalog/")) return "products";
  if (path === "/network" || path.startsWith("/network/")) return "network";
  if (path === "/tools" || path.startsWith("/tools/")) return "tools";
  return "studio";
}

/** Google Search Console HTML verification token for the current host/kind. */
export function gscVerificationForKind(kind: SiteKind): string | undefined {
  const envKey: Record<SiteKind, string | undefined> = {
    studio: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    info: process.env.NEXT_PUBLIC_GSC_VERIFICATION_INFO,
    journal: process.env.NEXT_PUBLIC_GSC_VERIFICATION_JOURNAL,
    news: process.env.NEXT_PUBLIC_GSC_VERIFICATION_NEWS,
    store: process.env.NEXT_PUBLIC_GSC_VERIFICATION_STORE,
    products: process.env.NEXT_PUBLIC_GSC_VERIFICATION_PRODUCTS,
    tools: process.env.NEXT_PUBLIC_GSC_VERIFICATION_TOOLS,
    ai: process.env.NEXT_PUBLIC_GSC_VERIFICATION_AI,
    saas: process.env.NEXT_PUBLIC_GSC_VERIFICATION_SAAS,
    discover: process.env.NEXT_PUBLIC_GSC_VERIFICATION_DISCOVER,
    network: process.env.NEXT_PUBLIC_GSC_VERIFICATION_NETWORK,
  };
  const token = envKey[kind]?.trim() || process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();
  return token || undefined;
}

export function originForKind(kind: SiteKind): string {
  if (kind === "info") return INFO_URL;
  if (kind === "journal") return JOURNAL_URL;
  if (kind === "news") return NEWS_URL;
  if (kind === "store") return STORE_URL;
  if (kind === "products") return PRODUCTS_URL;
  if (kind === "tools") return TOOLS_URL;
  if (kind === "ai") return AI_URL;
  if (kind === "saas") return SAAS_URL;
  if (kind === "discover") return DISCOVER_URL;
  if (kind === "network") return NETWORK_URL;
  return SITE_URL;
}

export function originForPath(path: string): string {
  if (path === "/ai" || path.startsWith("/ai/")) return AI_URL;
  if (path === "/saas" || path.startsWith("/saas/")) return SAAS_URL;
  if (path === "/discover" || path.startsWith("/discover/")) return DISCOVER_URL;
  if (path === "/info" || path.startsWith("/info/")) return INFO_URL;
  if (path === "/blog/news" || path.startsWith("/blog/news/")) return NEWS_URL;
  if (path === "/blog" || path.startsWith("/blog/")) return JOURNAL_URL;
  if (path === "/products" || path.startsWith("/products/")) return STORE_URL;
  if (path === "/catalog" || path.startsWith("/catalog/")) return PRODUCTS_URL;
  if (path === "/network" || path.startsWith("/network/")) return NETWORK_URL;
  if (path === "/tools" || path.startsWith("/tools/")) return TOOLS_URL;
  return SITE_URL;
}

export function ogImageForPath(path: string) {
  if (path.startsWith("/blog/news")) return OG_NEWS;
  if (path === "/info" || path.startsWith("/info/")) return OG_JOURNAL;
  if (path === "/blog" || path.startsWith("/blog/")) return OG_JOURNAL;
  if (path === "/products" || path.startsWith("/products/") || path === "/saas") return OG_STORE;
  return OG_IMAGE;
}

/** Canonical public URL for an internal app path (matches sitemap `<loc>` and pretty URLs on dedicated hosts). */
export function canonicalFor(path: string): string {
  const normalized = path && path !== "/" ? path : "/";
  return publicUrlForInternalPath(normalized, siteKindFromPath(normalized));
}

export function publicUrlForInternalPath(internalPath: string, kind?: SiteKind): string {
  const resolvedKind = kind ?? siteKindFromPath(internalPath);
  const origin = originForKind(resolvedKind);
  const pub = publicPathForLocale(internalPath, "en", resolvedKind);
  return `${origin}${pub === "/" ? "" : pub}`;
}

/** Browser-visible URL path for a given internal path + locale (inverse of middleware rewrites). */
export function publicPathForLocale(
  internalPath: string,
  locale: SeoLocale = "en",
  kind?: SiteKind
): string {
  const path = internalPath.startsWith("/") ? internalPath : `/${internalPath}`;
  const resolvedKind = kind ?? siteKindFromPath(path);

  let publicPath = path;
  if (resolvedKind === "info") {
    if (path === "/info") publicPath = "/";
    else if (path.startsWith("/info/")) publicPath = path.replace(/^\/info/, "") || "/";
  } else if (resolvedKind === "journal" && (path === "/blog" || path.startsWith("/blog/"))) {
    if (path === "/blog") publicPath = "/";
    else publicPath = path.replace(/^\/blog/, "") || "/";
  } else if (resolvedKind === "news" && path.startsWith("/blog/news")) {
    if (path === "/blog/news") publicPath = "/";
    else publicPath = path.replace(/^\/blog\/news/, "") || "/";
  } else if (resolvedKind === "store" && path.startsWith("/products")) {
    if (path === "/products") publicPath = "/";
    else publicPath = path.replace(/^\/products/, "") || "/";
  } else if (resolvedKind === "tools" && path.startsWith("/tools")) {
    if (path === "/tools") publicPath = "/";
    else publicPath = path.replace(/^\/tools/, "") || "/";
  } else if (resolvedKind === "products" && path.startsWith("/catalog")) {
    if (path === "/catalog") publicPath = "/";
    else publicPath = path.replace(/^\/catalog/, "") || "/";
  } else if (resolvedKind === "network" && path.startsWith("/network")) {
    if (path === "/network") publicPath = "/";
    else publicPath = path.replace(/^\/network/, "") || "/";
  } else if (resolvedKind === "ai" && path.startsWith("/ai")) {
    if (path === "/ai") publicPath = "/";
    else publicPath = path.replace(/^\/ai/, "") || "/";
  } else if (resolvedKind === "saas" && path.startsWith("/saas")) {
    if (path === "/saas") publicPath = "/";
    else publicPath = path.replace(/^\/saas/, "") || "/";
  } else if (resolvedKind === "discover" && path.startsWith("/discover")) {
    if (path === "/discover") publicPath = "/";
    else publicPath = path.replace(/^\/discover/, "") || "/";
  }

  if (locale === "en") return publicPath === "" ? "/" : publicPath;
  const suffix = publicPath === "/" ? "" : publicPath;
  return `/${locale}${suffix}`;
}

export function languageAlternatesForPath(
  internalPath: string,
  origin?: string,
  kind?: SiteKind
): Record<string, string> {
  const base = origin || originForPath(internalPath);
  const resolvedKind = kind ?? siteKindFromPath(internalPath);
  const languages: Record<string, string> = {};
  for (const loc of SEO_LOCALES) {
    const pub = publicPathForLocale(internalPath, loc, resolvedKind);
    languages[loc] = `${base}${pub === "/" ? "" : pub}`;
  }
  languages["x-default"] = languages.en;
  return languages;
}

/** Icons shared across every host/page. */
export const SITE_ICONS: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: "/icon", type: "image/png", sizes: "32x32" },
    { url: "/brand/eben-mark.svg", type: "image/svg+xml" },
  ],
  apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  shortcut: ["/icon"],
};

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const url = canonicalFor(path);
  const image = ogImageForPath(path);
  const origin = originForPath(path);
  const kind = siteKindFromPath(path);
  const google = gscVerificationForKind(kind);
  return {
    metadataBase: new URL(origin),
    title,
    description,
    icons: SITE_ICONS,
    alternates: { canonical: url, languages: languageAlternatesForPath(path, origin, kind) },
    ...(google ? { verification: { google } } : {}),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

/** Fallback root metadata per host — child layouts override title/description. */
export function rootMetadataForKind(kind: SiteKind): Metadata {
  const origin = originForKind(kind);
  const google = gscVerificationForKind(kind);

  const defaults: Record<
    SiteKind,
    { title: string; description: string; siteName: string; image: typeof OG_IMAGE }
  > = {
    studio: {
      title: "Ebenezer Digital Services | Reliable Digital & Web Services for Your Business",
      description:
        "Professional data entry, virtual assistance, travel booking support, and web development. Trusted by clients worldwide.",
      siteName: "Ebenezer Digital Services",
      image: OG_IMAGE,
    },
    info: {
      title: "Ebenezer Digital Information | News & Journal",
      description: "Discover news, stories and useful ideas for the digital world.",
      siteName: "Ebenezer Digital Information",
      image: OG_JOURNAL,
    },
    journal: {
      title: "Ebenezer Journal | Stories, ideas and knowledge",
      description: "Deep articles, guides and stories from Ebenezer Digital.",
      siteName: "Ebenezer Journal",
      image: OG_JOURNAL,
    },
    news: {
      title: "Ebenezer News | What is happening now",
      description: "Global news desks — world, tech, business, climate and more.",
      siteName: "Ebenezer News",
      image: OG_NEWS,
    },
    store: {
      title: "Ebenezer Store | Ready-to-Use Digital Products",
      description: "Templates, tools and digital products for small businesses.",
      siteName: "Ebenezer Store",
      image: OG_STORE,
    },
    products: {
      title: "Ebenezer Products | Hardware discovery & comparison",
      description: "Find laptops, SSDs and gear with honest comparisons.",
      siteName: "Ebenezer Products",
      image: OG_IMAGE,
    },
    tools: {
      title: "Ebenezer Tools | Software & AI tool discovery",
      description: "Compare software and AI tools for your business.",
      siteName: "Ebenezer Tools",
      image: OG_IMAGE,
    },
    ai: {
      title: "Ebenezer AI | Your digital assistant studio",
      description: "Chat with Eben AI for help across the Ebenezer ecosystem.",
      siteName: "Ebenezer AI",
      image: OG_IMAGE,
    },
    saas: {
      title: "Yegova | Cloud billing for shops",
      description: "Free cloud billing software — invoices, stock, customers.",
      siteName: "Yegova",
      image: OG_STORE,
    },
    discover: {
      title: "Ebenezer Discover | Find the right solution",
      description: "Intent router — find tools, products and services fast.",
      siteName: "Ebenezer Discover",
      image: OG_IMAGE,
    },
    network: {
      title: "Ebenezer Digital Network | Free tools that just work",
      description: "Fast online tools for developers, creators and businesses.",
      siteName: "Ebenezer Digital Network",
      image: OG_IMAGE,
    },
  };

  const d = defaults[kind];
  return {
    metadataBase: new URL(origin),
    title: d.title,
    description: d.description,
    icons: SITE_ICONS,
    manifest: "/manifest.webmanifest",
    alternates: {
      canonical: origin,
      languages: languageAlternatesForPath(
        kind === "info"
          ? "/info"
          : kind === "journal"
            ? "/blog"
            : kind === "news"
              ? "/blog/news"
              : kind === "store"
                ? "/products"
                : kind === "tools"
                  ? "/tools"
                  : kind === "products"
                    ? "/catalog"
                    : kind === "network"
                      ? "/network"
                      : kind === "ai"
                        ? "/ai"
                        : kind === "saas"
                          ? "/saas"
                          : kind === "discover"
                            ? "/discover"
                            : "/",
        origin,
        kind
      ),
    },
    ...(google ? { verification: { google } } : {}),
    openGraph: {
      title: d.title,
      description: d.description,
      type: "website",
      url: origin,
      siteName: d.siteName,
      locale: "en_US",
      images: [d.image],
    },
    twitter: {
      card: "summary_large_image",
      title: d.title,
      description: d.description,
      images: [d.image.url],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}
