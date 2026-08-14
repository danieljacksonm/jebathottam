import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { blogRows } from "@/data/blog";
import { packageRows } from "@/data/packages";
import { SITE_URL, localizedPath } from "@/lib/seo";

const staticPaths = [
  "/",
  "/kodaikanal",
  "/destinations",
  "/destinations/kodaikanal",
  "/packages",
  "/tours",
  "/services",
  "/hotels",
  "/flights",
  "/visa",
  "/blog",
  "/about",
  "/contact",
  "/enquire",
  "/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, path)}`,
        lastModified: new Date(),
        changeFrequency: path === "/" || path === "/kodaikanal" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : path === "/kodaikanal" || path === "/packages" ? 0.9 : 0.7,
      });
    }

    for (const pkg of packageRows) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, `/packages/${pkg.id}`)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const post of blogRows) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, `/blog/${post.slug}`)}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
