import type { MetadataRoute } from "next";
import { STORE_PRODUCTS } from "@/app/products/data";
import { STORE_CATEGORY_PAGES } from "@/app/products/taxonomy";
import { getEduPosts } from "@/lib/edu-blog";
import { db } from "@/lib/db";
import { listPublicNewsForSitemap } from "@/lib/news-service";
import {
  AI_URL,
  DISCOVER_URL,
  INFO_URL,
  JOURNAL_URL,
  NEWS_URL,
  PRODUCTS_URL,
  SAAS_URL,
  SITE_URL,
  STORE_URL,
  TOOLS_URL,
  NETWORK_URL,
  articleLanguageAlternates,
  originForKind,
  publicUrlForInternalPath,
  type SiteKind,
} from "@/lib/site-url";
import { loadArticles } from "@/lib/content-engine";
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from "@/app/catalog/data";
import { TOOLS } from "@/app/tools/data";
import { getLiveTools } from "@/lib/network/registry";
import { NETWORK_GUIDES } from "@/lib/network/guides";

function kindFromOrigin(origin: string): SiteKind {
  if (origin === INFO_URL) return "info";
  if (origin === JOURNAL_URL) return "journal";
  if (origin === NEWS_URL) return "news";
  if (origin === STORE_URL) return "store";
  if (origin === PRODUCTS_URL) return "products";
  if (origin === TOOLS_URL) return "tools";
  if (origin === AI_URL) return "ai";
  if (origin === SAAS_URL) return "saas";
  if (origin === DISCOVER_URL) return "discover";
  if (origin === NETWORK_URL) return "network";
  return "studio";
}

function page(
  origin: string,
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: Date,
  withLanguages = false,
  kind?: SiteKind,
  internalPath?: string
): MetadataRoute.Sitemap[number] {
  const cleanPath = path || "";
  const resolvedKind = kind ?? kindFromOrigin(origin);
  const ip =
    internalPath ??
    (cleanPath.startsWith("/blog") ||
    cleanPath.startsWith("/info") ||
    cleanPath.startsWith("/products") ||
    cleanPath.startsWith("/tools") ||
    cleanPath.startsWith("/catalog") ||
    cleanPath.startsWith("/network")
      ? cleanPath
      : resolvedKind === "info"
        ? cleanPath === "" || cleanPath === "/"
          ? "/info"
          : `/info${cleanPath}`
        : resolvedKind === "journal"
          ? cleanPath === "" || cleanPath === "/"
            ? "/blog"
            : cleanPath.startsWith("/blog")
              ? cleanPath
              : `/blog${cleanPath}`
          : resolvedKind === "news"
            ? cleanPath === "" || cleanPath === "/"
              ? "/blog/news"
              : cleanPath.startsWith("/blog")
                ? cleanPath
                : `/blog/news${cleanPath}`
            : cleanPath || "/");

  const entry: MetadataRoute.Sitemap[number] = {
    url: publicUrlForInternalPath(ip, resolvedKind),
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
  };
  if (withLanguages) {
    // XML sitemaps: only en + x-default (must match `<loc>`). Full locale
    // clusters live in HTML `<link rel="alternate">` via pageMetadata.
    entry.alternates = {
      languages: articleLanguageAlternates(ip, resolvedKind),
    };
  }
  return entry;
}

async function studioSitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/services",
    "/work",
    "/case-studies",
    "/about",
    "/products-overview",
    "/media",
    "/faq",
    "/contact",
    "/insights",
    "/privacy",
    "/terms",
    "/sitemap",
    "/process",
    "/why",
    "/careers",
    "/website-showcase",
    "/trust",
  ];
  const pages = routes.map((route) =>
    page(SITE_URL, route, "weekly", route === "" ? 1 : 0.7, undefined, true, "studio", route || "/")
  );
  for (const post of loadArticles("studio-insights")) {
    pages.push(
      page(
        SITE_URL,
        `/insights/${post.slug}`,
        "monthly",
        0.75,
        new Date(post.publishedAt),
        true,
        "studio",
        `/insights/${post.slug}`
      )
    );
  }
  return pages;
}

async function aiSitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    page(AI_URL, "", "weekly", 1, undefined, true),
    page(AI_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(AI_URL, "/terms", "yearly", 0.2, undefined, true),
    page(AI_URL, "/sitemap", "monthly", 0.3, undefined, true),
  ];
}

async function saasSitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    page(SAAS_URL, "", "weekly", 1, undefined, true),
    page(SAAS_URL, "/saas/login", "monthly", 0.4, undefined, false),
    page(SAAS_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(SAAS_URL, "/terms", "yearly", 0.2, undefined, true),
    page(SAAS_URL, "/sitemap", "monthly", 0.3, undefined, true),
  ];
}

async function discoverSitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    page(DISCOVER_URL, "", "weekly", 1, undefined, true),
    page(DISCOVER_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(DISCOVER_URL, "/terms", "yearly", 0.2, undefined, true),
    page(DISCOVER_URL, "/sitemap", "monthly", 0.3, undefined, true),
  ];
}

async function infoSitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    page(INFO_URL, "", "daily", 1, undefined, true),
    page(INFO_URL, "/about", "monthly", 0.7, undefined, true),
    page(INFO_URL, "/search", "weekly", 0.6, undefined, true),
    page(INFO_URL, "/contact", "monthly", 0.5, undefined, true),
    page(INFO_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(INFO_URL, "/terms", "yearly", 0.2, undefined, true),
    page(INFO_URL, "/sitemap", "monthly", 0.3, undefined, true),
  ];
  for (const post of loadArticles("info-guides")) {
    pages.push(
      page(
        INFO_URL,
        `/guides/${post.slug}`,
        "monthly",
        0.65,
        new Date(post.publishedAt),
        true,
        "info",
        `/info/guides/${post.slug}`
      )
    );
  }
  return pages;
}

function articlePage(
  origin: string,
  internalPath: string,
  kind: SiteKind,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: Date
): MetadataRoute.Sitemap[number] {
  return {
    url: publicUrlForInternalPath(internalPath, kind),
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: articleLanguageAlternates(internalPath, kind),
    },
  };
}

async function journalSitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    page(JOURNAL_URL, "", "hourly", 1, undefined, true),
    page(JOURNAL_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(JOURNAL_URL, "/terms", "yearly", 0.2, undefined, true),
    page(JOURNAL_URL, "/sitemap", "monthly", 0.3, undefined, true),
  ];

  const seen = new Set<string>();
  try {
    const cmsPosts = await db.getBlogPosts(true, { includeEdu: false });
    for (const p of cmsPosts) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      pages.push(
        articlePage(
          JOURNAL_URL,
          `/blog/${p.slug}`,
          "journal",
          "weekly",
          0.7,
          p.updatedAt || p.publishedAt || new Date()
        )
      );
    }
  } catch {
    /* CMS store can fail on VPS; still return edu + news URLs */
  }

  for (const p of getEduPosts()) {
    // Mass-generated learn-* explainers stay reachable but are noindex — omit from XML sitemap.
    if (p.slug.startsWith("learn-")) continue;
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    pages.push(
      articlePage(JOURNAL_URL, `/blog/${p.slug}`, "journal", "weekly", 0.75, new Date(p.publishedAt))
    );
  }

  return pages;
}

async function newsSitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    // Home only once — `/blog/news` and `` both canonicalize to news host `/`
    page(NEWS_URL, "/blog/news", "hourly", 1, undefined, true),
    page(NEWS_URL, "/blog/newsroom/about", "monthly", 0.5, undefined, true),
    page(NEWS_URL, "/blog/newsroom/editorial-policy", "monthly", 0.5, undefined, true),
    page(NEWS_URL, "/blog/newsroom/contact", "monthly", 0.5, undefined, true),
    page(NEWS_URL, "/blog/newsroom/feeds", "weekly", 0.6, undefined, true),
    page(NEWS_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(NEWS_URL, "/terms", "yearly", 0.2, undefined, true),
    page(NEWS_URL, "/sitemap", "monthly", 0.3, undefined, true),
  ];

  try {
    // Keep every story from the last 7 days (archive + live), no hard 400 cut that drops week-old URLs
    const news = await listPublicNewsForSitemap();
    for (const n of news) {
      pages.push(
        articlePage(
          NEWS_URL,
          `/blog/news/${n.slug}`,
          "news",
          "hourly",
          0.8,
          new Date(n.publishedAt)
        )
      );
    }
  } catch {
    /* live news can fail; index pages still go out */
  }

  return pages;
}

function storeSitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    page(STORE_URL, "", "weekly", 1, undefined, true),
    page(STORE_URL, "/products/roadmap", "monthly", 0.5, undefined, true),
    page(STORE_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(STORE_URL, "/terms", "yearly", 0.2, undefined, true),
    page(STORE_URL, "/sitemap", "monthly", 0.3, undefined, true),
  ];
  for (const c of STORE_CATEGORY_PAGES) {
    pages.push(page(STORE_URL, `/products/category/${c.slug}`, "weekly", 0.75, undefined, true));
  }
  for (const p of STORE_PRODUCTS) {
    if (p.status !== "published") continue;
    pages.push(
      page(STORE_URL, `/products/${p.slug}`, "weekly", 0.8, new Date(p.publishedAt), true)
    );
  }
  return pages;
}

function productsCatalogSitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    page(PRODUCTS_URL, "", "weekly", 1, undefined, true),
    page(PRODUCTS_URL, "/catalog/compare", "weekly", 0.6, undefined, true),
    page(PRODUCTS_URL, "/catalog/recommend", "weekly", 0.7, undefined, true),
    page(PRODUCTS_URL, "/catalog/guides", "weekly", 0.75, undefined, true),
    page(PRODUCTS_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(PRODUCTS_URL, "/terms", "yearly", 0.2, undefined, true),
    page(PRODUCTS_URL, "/sitemap", "monthly", 0.3, undefined, true),
  ];
  for (const c of CATALOG_CATEGORIES) {
    pages.push(page(PRODUCTS_URL, `/catalog/${c.slug}`, "weekly", 0.8, undefined, true));
  }
  for (const p of CATALOG_PRODUCTS.filter((x) => x.status === "active")) {
    pages.push(page(PRODUCTS_URL, `/catalog/p/${p.slug}`, "weekly", 0.85, new Date(p.updatedAt), true));
  }
  for (const slug of [
    "best-laptop-under-50000",
    "best-ssd-for-gaming",
    "best-ram-for-laptops",
  ]) {
    pages.push(page(PRODUCTS_URL, `/catalog/guides/${slug}`, "monthly", 0.7, undefined, true));
  }
  for (const budget of ["50000", "60000", "70000", "80000", "100000"]) {
    pages.push(page(PRODUCTS_URL, `/catalog/laptops/under-${budget}`, "weekly", 0.7, undefined, true));
  }
  return pages;
}

function toolsSitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    page(TOOLS_URL, "", "weekly", 1, undefined, true),
    page(TOOLS_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(TOOLS_URL, "/terms", "yearly", 0.2, undefined, true),
    page(TOOLS_URL, "/sitemap", "monthly", 0.3, undefined, true),
    page(TOOLS_URL, "/tools/compare", "weekly", 0.85, undefined, true),
    page(TOOLS_URL, "/tools/guides", "weekly", 0.75, undefined, true),
    page(TOOLS_URL, "/tools/methodology", "monthly", 0.7, undefined, true),
    page(TOOLS_URL, "/affiliate-disclosure", "yearly", 0.3, undefined, true),
  ];
  const staticRoutes = [
    "/tools/invoice-generator",
    "/tools/quotation-generator",
    "/tools/receipt-generator",
    "/tools/proposal-generator",
    "/tools/purchase-order-generator",
    "/tools/qr-menu-generator",
    "/tools/expense-tracker",
    "/tools/task-tracker",
  ];
  for (const route of staticRoutes) {
    pages.push(page(TOOLS_URL, route, "weekly", 0.8, undefined, true));
  }
  for (const tool of TOOLS) {
    pages.push(page(TOOLS_URL, `/tools/${tool.id}`, "weekly", 0.85, undefined, true, "tools", `/tools/${tool.id}`));
  }
  for (const slug of [
    "best-ai-coding-tools",
    "best-ai-tools-for-youtube",
    "best-crm-for-small-business",
    "best-ai-writing-tools",
  ]) {
    pages.push(
      page(TOOLS_URL, `/tools/guides/${slug}`, "monthly", 0.7, undefined, true, "tools", `/tools/guides/${slug}`)
    );
  }
  return pages;
}

function networkSitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    page(NETWORK_URL, "", "daily", 1, undefined, true),
    page(NETWORK_URL, "/tools", "daily", 0.95, undefined, true),
    page(NETWORK_URL, "/developers", "weekly", 0.8, undefined, true),
    page(NETWORK_URL, "/resources", "weekly", 0.75, undefined, true),
    page(NETWORK_URL, "/guides", "weekly", 0.8, undefined, true),
    page(NETWORK_URL, "/finder", "weekly", 0.7, undefined, true),
    page(NETWORK_URL, "/about", "monthly", 0.4, undefined, true),
    page(NETWORK_URL, "/contact", "monthly", 0.4, undefined, true),
    page(NETWORK_URL, "/privacy", "yearly", 0.2, undefined, true),
    page(NETWORK_URL, "/terms", "yearly", 0.2, undefined, true),
    page(NETWORK_URL, "/affiliate-disclosure", "yearly", 0.2, undefined, true),
    page(NETWORK_URL, "/sitemap", "monthly", 0.3, undefined, true),
  ];
  for (const t of getLiveTools()) {
    pages.push(
      page(
        NETWORK_URL,
        `/tools/${t.slug}`,
        "weekly",
        0.9,
        new Date(t.updatedAt),
        true,
        "network",
        `/network/tools/${t.slug}`
      )
    );
  }
  for (const cat of ["developer", "seo", "image", "text", "calculators", "business", "ai"]) {
    pages.push(
      page(NETWORK_URL, `/tools/${cat}`, "weekly", 0.85, undefined, true, "network", `/network/tools/c/${cat}`)
    );
  }
  for (const g of NETWORK_GUIDES) {
    pages.push(
      page(
        NETWORK_URL,
        `/guides/${g.slug}`,
        "monthly",
        0.7,
        new Date(g.updatedAt),
        true,
        "network",
        `/network/guides/${g.slug}`
      )
    );
  }
  return pages;
}

export async function sitemapForKind(kind: SiteKind): Promise<MetadataRoute.Sitemap> {
  let pages: MetadataRoute.Sitemap;
  if (kind === "info") pages = await infoSitemap();
  else if (kind === "journal") pages = await journalSitemap();
  else if (kind === "news") pages = await newsSitemap();
  else if (kind === "store") pages = storeSitemap();
  else if (kind === "products") pages = productsCatalogSitemap();
  else if (kind === "tools") pages = toolsSitemap();
  else if (kind === "ai") pages = await aiSitemap();
  else if (kind === "saas") pages = await saasSitemap();
  else if (kind === "discover") pages = await discoverSitemap();
  else if (kind === "network") pages = networkSitemap();
  else pages = await studioSitemap();

  const origin = originForKind(kind);
  pages.push({
    url: `${origin}/sitemap.html`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.25,
  });

  return pages;
}
