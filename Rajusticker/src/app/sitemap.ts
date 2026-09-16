import type { MetadataRoute } from "next";
import { getAllProducts, categoryMeta } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/shop",
    "/custom-stickers",
    "/ai-finder",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categories = Object.values(categoryMeta)
    .filter((c) => c.slug !== "custom")
    .map((c) => ({
      url: `${siteUrl}/shop/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const products = (await getAllProducts()).map((p) => ({
    url: `${siteUrl}/stickers/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const posts = getAllPosts().map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...categories, ...products, ...posts];
}
