import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { blogRows } from "@/data/blog";
import { packageRows } from "@/data/packages";
import { SITE_URL, absoluteUrl, localizedPath } from "@/lib/seo";

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
  "/privacy",
  "/terms",
];

function hreflangAlternates(path: string) {
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(routing.defaultLocale, path),
  };
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, path)}`,
        lastModified: new Date(),
        changeFrequency: path === "/" || path === "/kodaikanal" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : path === "/kodaikanal" || path === "/packages" ? 0.9 : 0.7,
        alternates: { languages: hreflangAlternates(path) },
      });
    }

    for (const pkg of packageRows) {
      const pkgPath = `/packages/${pkg.id}`;
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, pkgPath)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: hreflangAlternates(pkgPath) },
      });
    }

    for (const post of blogRows) {
      const postPath = `/blog/${post.slug}`;
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, postPath)}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: hreflangAlternates(postPath) },
      });
    }
  }

  return entries;
}
