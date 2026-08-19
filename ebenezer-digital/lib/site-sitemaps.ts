import type { MetadataRoute } from "next";
import { STORE_PRODUCTS } from "@/app/products/data";
import { getEduPosts } from "@/lib/edu-blog";
import { db } from "@/lib/db";
import { listPublicNews } from "@/lib/news-service";
import { JOURNAL_URL, SITE_URL, STORE_URL, type SiteKind } from "@/lib/site-url";

function page(
  origin: string,
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified?: Date
): MetadataRoute.Sitemap[number] {
  return {
    url: path ? `${origin}${path}` : origin,
    lastModified: lastModified || new Date(),
    changeFrequency,
    priority,
  };
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
  ];
  return routes.map((route) =>
    page(SITE_URL, route, "weekly", route === "" ? 1 : route === "/ai" || route === "/saas" ? 0.8 : 0.7)
  );
}

async function journalSitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    page(JOURNAL_URL, "/blog", "hourly", 1),
    page(JOURNAL_URL, "/blog/news", "hourly", 0.95),
    page(JOURNAL_URL, "/blog/newsroom/about", "monthly", 0.5),
    page(JOURNAL_URL, "/blog/newsroom/editorial-policy", "monthly", 0.5),
    page(JOURNAL_URL, "/blog/newsroom/contact", "monthly", 0.5),
    page(JOURNAL_URL, "/blog/newsroom/feeds", "weekly", 0.6),
  ];

  const seen = new Set<string>();
  const cmsPosts = await db.getBlogPosts(true);
  for (const p of cmsPosts) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    pages.push(
      page(
        JOURNAL_URL,
        `/blog/${p.slug}`,
        "weekly",
        p.slug.startsWith("learn-") ? 0.75 : 0.7,
        p.updatedAt || p.publishedAt || new Date()
      )
    );
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
  const pages: MetadataRoute.Sitemap = [page(STORE_URL, "/products", "weekly", 1)];
  for (const p of STORE_PRODUCTS) {
    pages.push(page(STORE_URL, `/products/${p.slug}`, "weekly", 0.8, new Date(p.publishedAt)));
  }
  return pages;
}

export async function sitemapForKind(kind: SiteKind): Promise<MetadataRoute.Sitemap> {
  if (kind === "journal") return journalSitemap();
  if (kind === "store") return storeSitemap();
  return studioSitemap();
}
