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
  languageAlternatesFor,
  type SiteKind,
} from "@/lib/site-url";
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from "@/app/catalog/data";
import { getLiveTools } from "@/lib/network/registry";
import { NETWORK_GUIDES } from "@/lib/network/guides";

function page(
  origin: string,
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: Date,
  withLanguages = false
): MetadataRoute.Sitemap[number] {
  const cleanPath = path || "";
  const entry: MetadataRoute.Sitemap[number] = {
    url: cleanPath ? `${origin}${cleanPath}` : origin,
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
  };
  // Language alternates = separate URL per locale (en unprefixed, others /{locale}/path).
  // Do not explode every article into 22 sitemap rows — use hreflang alternates instead.
  if (withLanguages) {
    entry.alternates = {
      languages: languageAlternatesFor(cleanPath || "/", origin),
    };
  }
  return entry;
}

async function studioSitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/services",
    "/work",
    "/contact",
    "/testimonials",
    "/privacy",
    "/terms",
    "/process",
    "/why",
    "/careers",
    "/website-showcase",
    "/stats",
    "/trust",
  ];
  return routes.map((route) =>
    page(SITE_URL, route, "weekly", route === "" ? 1 : 0.7, undefined, true)
  );
}

async function aiSitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    page(AI_URL, "", "weekly", 1, undefined, true),
    page(AI_URL, "/ai", "weekly", 0.9, undefined, true),
  ];
}

async function saasSitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    page(SAAS_URL, "", "weekly", 1, undefined, true),
    page(SAAS_URL, "/saas", "weekly", 0.9, undefined, true),
    page(SAAS_URL, "/saas/login", "monthly", 0.4, undefined, false),
  ];
}

async function discoverSitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    page(DISCOVER_URL, "", "weekly", 1, undefined, true),
    page(DISCOVER_URL, "/discover", "weekly", 0.9, undefined, true),
  ];
}

async function infoSitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    page(INFO_URL, "", "daily", 1, undefined, true),
    page(INFO_URL, "/about", "monthly", 0.7, undefined, true),
    page(INFO_URL, "/search", "weekly", 0.6, undefined, true),
    page(INFO_URL, "/contact", "monthly", 0.5, undefined, true),
  ];
}

async function journalSitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    page(JOURNAL_URL, "", "hourly", 1, undefined, true),
    page(JOURNAL_URL, "/blog", "hourly", 1, undefined, true),
    page(JOURNAL_URL, "/blog/newsroom/about", "monthly", 0.5, undefined, true),
    page(JOURNAL_URL, "/blog/newsroom/editorial-policy", "monthly", 0.5, undefined, true),
    page(JOURNAL_URL, "/blog/newsroom/contact", "monthly", 0.5, undefined, true),
    page(JOURNAL_URL, "/blog/newsroom/feeds", "weekly", 0.6, undefined, true),
  ];

  const seen = new Set<string>();
  try {
    const cmsPosts = await db.getBlogPosts(true, { includeEdu: false });
    for (const p of cmsPosts) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      pages.push(
        page(
          JOURNAL_URL,
          `/blog/${p.slug}`,
          "weekly",
          0.7,
          p.updatedAt || p.publishedAt || new Date(),
          false
        )
      );
    }
  } catch {
    /* CMS store can fail on VPS; still return edu + news URLs */
  }

  for (const p of getEduPosts()) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    pages.push(
      page(JOURNAL_URL, `/blog/${p.slug}`, "weekly", 0.75, new Date(p.publishedAt), false)
    );
  }

  return pages;
}

async function newsSitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    page(NEWS_URL, "", "hourly", 1, undefined, true),
    page(NEWS_URL, "/blog/news", "hourly", 0.95, undefined, true),
  ];

  try {
    // Keep every story from the last 7 days (archive + live), no hard 400 cut that drops week-old URLs
    const news = await listPublicNewsForSitemap();
    for (const n of news) {
      pages.push(
        page(
          NEWS_URL,
          `/blog/news/${n.slug}`,
          "hourly",
          0.8,
          new Date(n.publishedAt),
          false
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
    page(STORE_URL, "/products", "weekly", 1, undefined, true),
    page(STORE_URL, "/products/roadmap", "monthly", 0.5, undefined, true),
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
    page(PRODUCTS_URL, "/catalog", "weekly", 1),
    page(PRODUCTS_URL, "/catalog/compare", "weekly", 0.6),
    page(PRODUCTS_URL, "/catalog/recommend", "weekly", 0.7),
    page(PRODUCTS_URL, "/catalog/guides", "weekly", 0.75),
  ];
  for (const c of CATALOG_CATEGORIES) {
    pages.push(page(PRODUCTS_URL, `/catalog/${c.slug}`, "weekly", 0.8));
  }
  for (const p of CATALOG_PRODUCTS.filter((x) => x.status === "active")) {
    pages.push(page(PRODUCTS_URL, `/catalog/p/${p.slug}`, "weekly", 0.85, new Date(p.updatedAt)));
  }
  for (const slug of [
    "best-laptop-under-50000",
    "best-ssd-for-gaming",
    "best-ram-for-laptops",
  ]) {
    pages.push(page(PRODUCTS_URL, `/catalog/guides/${slug}`, "monthly", 0.7));
  }
  for (const budget of ["50000", "60000", "70000", "80000", "100000"]) {
    pages.push(page(PRODUCTS_URL, `/catalog/laptops/under-${budget}`, "weekly", 0.7));
  }
  return pages;
}

function toolsSitemap(): MetadataRoute.Sitemap {
  const toolRoutes = [
    "",
    "/tools",
    "/tools/invoice-generator",
    "/tools/quotation-generator",
    "/tools/receipt-generator",
    "/tools/proposal-generator",
    "/tools/purchase-order-generator",
    "/tools/qr-menu-generator",
    "/tools/expense-tracker",
    "/tools/task-tracker",
  ];
  return toolRoutes.map((route) =>
    page(TOOLS_URL, route, "weekly", route === "" || route === "/tools" ? 1 : 0.8, undefined, true)
  );
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
  ];
  for (const t of getLiveTools()) {
    // Public .net URLs are /tools/{slug} (middleware rewrite)
    pages.push(page(NETWORK_URL, `/tools/${t.slug}`, "weekly", 0.9, new Date(t.updatedAt), true));
  }
  for (const cat of ["developer", "seo", "image", "text", "calculators", "business", "ai"]) {
    pages.push(page(NETWORK_URL, `/tools/${cat}`, "weekly", 0.85, undefined, true));
  }
  for (const g of NETWORK_GUIDES) {
    pages.push(page(NETWORK_URL, `/guides/${g.slug}`, "monthly", 0.7, new Date(g.updatedAt), true));
  }
  return pages;
}

export async function sitemapForKind(kind: SiteKind): Promise<MetadataRoute.Sitemap> {
  if (kind === "info") return infoSitemap();
  if (kind === "journal") return journalSitemap();
  if (kind === "news") return newsSitemap();
  if (kind === "store") return storeSitemap();
  if (kind === "products") return productsCatalogSitemap();
  if (kind === "tools") return toolsSitemap();
  if (kind === "ai") return aiSitemap();
  if (kind === "saas") return saasSitemap();
  if (kind === "discover") return discoverSitemap();
  if (kind === "network") return networkSitemap();
  return studioSitemap();
}
