import type { Metadata } from "next";

function clean(url: string) {
  return url.replace(/\/$/, "");
}

export const SITE_URL = clean(process.env.NEXT_PUBLIC_SITE_URL || "https://ebenezerdigital.com");
export const INFO_URL = clean(
  process.env.NEXT_PUBLIC_INFO_URL || "https://ebenezerdigital.info"
);
export const JOURNAL_URL = clean(
  process.env.NEXT_PUBLIC_JOURNAL_URL || "https://journal.ebenezerdigital.info"
);
export const NEWS_URL = clean(process.env.NEXT_PUBLIC_NEWS_URL || "https://news.ebenezerdigital.info");
export const STORE_URL = clean(process.env.NEXT_PUBLIC_STORE_URL || "https://ebenezerdigital.store");
export const PRODUCTS_URL = clean(
  process.env.NEXT_PUBLIC_PRODUCTS_URL || "https://products.ebenezerdigital.com"
);
export const TOOLS_URL = clean(process.env.NEXT_PUBLIC_TOOLS_URL || "https://tools.ebenezerdigital.com");
export const AI_URL = clean(process.env.NEXT_PUBLIC_AI_URL || "https://ai.ebenezerdigital.com");
export const DISCOVER_URL = clean(
  process.env.NEXT_PUBLIC_DISCOVER_URL || "https://discover.ebenezerdigital.com"
);
export const NETWORK_URL = clean(process.env.NEXT_PUBLIC_NETWORK_URL || "https://ebenezerdigital.net");

export type SiteKind =
  | "studio"
  | "info"
  | "journal"
  | "news"
  | "store"
  | "products"
  | "tools"
  | "ai"
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
  const base = origin || originForPath(path);
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const languages: Record<string, string> = {
    "x-default": `${base}${cleanPath === "/" ? "" : cleanPath}`,
  };
  for (const loc of SEO_LOCALES) {
    languages[loc] =
      loc === "en"
        ? `${base}${cleanPath === "/" ? "" : cleanPath}`
        : `${base}/${loc}${cleanPath === "/" ? "" : cleanPath}`;
  }
  return languages;
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

export function originForKind(kind: SiteKind): string {
  if (kind === "info") return INFO_URL;
  if (kind === "journal") return JOURNAL_URL;
  if (kind === "news") return NEWS_URL;
  if (kind === "store") return STORE_URL;
  if (kind === "products") return PRODUCTS_URL;
  if (kind === "tools") return TOOLS_URL;
  if (kind === "ai") return AI_URL;
  if (kind === "discover") return DISCOVER_URL;
  if (kind === "network") return NETWORK_URL;
  return SITE_URL;
}

export function originForPath(path: string): string {
  if (path === "/ai" || path.startsWith("/ai/")) return AI_URL;
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

export function canonicalFor(path: string): string {
  const origin = originForPath(path);
  if (!path || path === "/") return origin;
  // On dedicated hosts, prefer clean roots for section homes
  if (path === "/ai" && origin === AI_URL) return AI_URL;
  if (path === "/discover" && origin === DISCOVER_URL) return DISCOVER_URL;
  if (path === "/info" && origin === INFO_URL) return INFO_URL;
  if (path === "/info/about" && origin === INFO_URL) return `${INFO_URL}/about`;
  if (path === "/info/search" && origin === INFO_URL) return `${INFO_URL}/search`;
  if (path === "/info/contact" && origin === INFO_URL) return `${INFO_URL}/contact`;
  if (path === "/blog/news" && origin === NEWS_URL) return NEWS_URL;
  if (path === "/blog" && origin === JOURNAL_URL) return JOURNAL_URL;
  if (path === "/tools" && origin === TOOLS_URL) return TOOLS_URL;
  if (path === "/products" && origin === STORE_URL) return STORE_URL;
  if (path === "/catalog" && origin === PRODUCTS_URL) return PRODUCTS_URL;
  if (path === "/network" && origin === NETWORK_URL) return NETWORK_URL;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
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
  return {
    metadataBase: new URL(origin),
    title,
    description,
    icons: SITE_ICONS,
    alternates: { canonical: url, languages: languageAlternatesFor(path, origin) },
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
