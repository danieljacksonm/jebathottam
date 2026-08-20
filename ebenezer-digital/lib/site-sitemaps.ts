import type { MetadataRoute } from "next";
import { STORE_PRODUCTS } from "@/app/products/data";
import { STORE_CATEGORY_PAGES } from "@/app/products/taxonomy";
import { getEduPosts } from "@/lib/edu-blog";
import { db } from "@/lib/db";
import { listPublicNews } from "@/lib/news-service";
import {
  JOURNAL_URL,
  PRODUCTS_URL,
  SITE_URL,
  STORE_URL,
  languageAlternatesFor,
  type SiteKind,
} from "@/lib/site-url";
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from "@/app/catalog/data";

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
  // Hreflang on every blog/news URL makes sitemap.xml too heavy and Google cannot fetch it.
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
    "/saas",
    "/testimonials",
    "/privacy",
    "/terms",
    "/process",
    "/why",
    "/careers",
    "/website-showcase",
    "/stats",
    "/trust",
    "/ai",
    "/discover",
  ];
  return routes.map((route) =>
    page(
      SITE_URL,
      route,
      "weekly",
      route === "" ? 1 : route === "/ai" || route === "/saas" ? 0.8 : 0.7,
      undefined,
      true
    )
  );
}

async function journalSitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    page(JOURNAL_URL, "/blog", "hourly", 1, undefined, true),
    page(JOURNAL_URL, "/blog/news", "hourly", 0.95, undefined, true),
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
          p.updatedAt || p.publishedAt || new Date()
        )
      );
    }
  } catch {
    /* CMS store can fail on VPS; still return edu + news URLs */
  }

  for (const p of getEduPosts()) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    pages.push(page(JOURNAL_URL, `/blog/${p.slug}`, "weekly", 0.75, new Date(p.publishedAt)));
  }

  try {
    const news = await listPublicNews();
    for (const n of news.slice(0, 200)) {
      pages.push(page(JOURNAL_URL, `/blog/news/${n.slug}`, "hourly", 0.8, new Date(n.publishedAt)));
    }
  } catch {
    /* live news can fail; index pages still go out */
  }

  return pages;
}

function storeSitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [page(STORE_URL, "/products", "weekly", 1, undefined, true)];
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
  // Seed guides (static list mirrors repository defaults)
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

export async function sitemapForKind(kind: SiteKind): Promise<MetadataRoute.Sitemap> {
  if (kind === "journal") return journalSitemap();
  if (kind === "store") return storeSitemap();
  if (kind === "products") return productsCatalogSitemap();
  return studioSitemap();
}
