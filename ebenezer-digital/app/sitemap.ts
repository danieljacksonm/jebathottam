import type { MetadataRoute } from "next";
import { STORE_PRODUCTS } from "./products/data";
import { getEduPosts } from "@/lib/edu-blog";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ebenezerdigital.info";
  const routes = [
    "",
    "/services",
    "/work",
    "/blog",
    "/blog/news",
    "/contact",
    "/products",
    "/products/ebenezer-saas",
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
  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/blog" || route === "/blog/news" ? "hourly" : "weekly",
    priority: route === "" ? 1 : route === "/blog" || route === "/products" ? 0.9 : 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = STORE_PRODUCTS.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const cmsPosts = await db.getBlogPosts(true);
  // Prefer edu catalog + CMS; getBlogPosts already merges — use unique slugs
  const seen = new Set<string>();
  const blogPages: MetadataRoute.Sitemap = [];
  for (const p of cmsPosts) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    blogPages.push({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt || p.publishedAt || new Date(),
      changeFrequency: "weekly",
      priority: p.slug.startsWith("learn-") ? 0.75 : 0.7,
    });
  }

  // Ensure edu posts are present even if merge order changes
  for (const p of getEduPosts()) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    blogPages.push({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  return [...staticPages, ...productPages, ...blogPages];
}
