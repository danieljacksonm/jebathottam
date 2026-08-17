import type { Metadata } from "next";

function clean(url: string) {
  return url.replace(/\/$/, "");
}

export const SITE_URL = clean(process.env.NEXT_PUBLIC_SITE_URL || "https://ebenezerdigital.com");
export const JOURNAL_URL = clean(process.env.NEXT_PUBLIC_JOURNAL_URL || "https://ebenezerdigital.info");
export const STORE_URL = clean(process.env.NEXT_PUBLIC_STORE_URL || "https://ebenezerdigital.store");

export type SiteKind = "studio" | "journal" | "store";

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

export function siteKindFromHost(host?: string | null): SiteKind {
  const h = (host || "").toLowerCase().split(":")[0];
  if (h === "ebenezerdigital.info" || h === "www.ebenezerdigital.info") return "journal";
  if (
    h === "ebenezerdigital.store" ||
    h === "www.ebenezerdigital.store" ||
    h === "ebenezer.store" ||
    h === "www.ebenezer.store"
  ) {
    return "store";
  }
  return "studio";
}

export function originForKind(kind: SiteKind): string {
  if (kind === "journal") return JOURNAL_URL;
  if (kind === "store") return STORE_URL;
  return SITE_URL;
}

export function originForPath(path: string): string {
  if (path === "/blog" || path.startsWith("/blog/")) return JOURNAL_URL;
  if (path === "/products" || path.startsWith("/products/")) return STORE_URL;
  return SITE_URL;
}

export function ogImageForPath(path: string) {
  if (path.startsWith("/blog/news")) return OG_NEWS;
  if (path === "/blog" || path.startsWith("/blog/")) return OG_JOURNAL;
  if (path === "/products" || path.startsWith("/products/") || path === "/saas") return OG_STORE;
  return OG_IMAGE;
}

export function canonicalFor(path: string): string {
  const origin = originForPath(path);
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

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
  return {
    metadataBase: new URL(originForPath(path)),
    title,
    description,
    alternates: { canonical: url },
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
