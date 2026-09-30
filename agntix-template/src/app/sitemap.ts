import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSitemapBlogs } from "@/data/blog";
import { getAllPlaceParams, getDestinationSlugs } from "@/data/destinations";
import { getPackageRows } from "@/data/packages";
import { SITE_URL, absoluteUrl, localizedPath } from "@/lib/seo";

const staticPaths = [
  "/",
  "/kodaikanal",
  "/destinations",
  "/packages",
  "/tours",
  "/services",
  "/services/train-tickets",
  "/services/travel-consulting",
  "/corporate-travel",
  "/hotels",
  "/flights",
  "/visa",
  "/blog",
  "/about",
  "/contact",
  "/enquire",
  "/plan-your-trip",
  "/faq",
  "/privacy",
  "/terms",
  "/policies",
  "/cancellation",
  "/child-pricing",
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const [blogs, destinationSlugs, places, packageRows] = await Promise.all([
    getSitemapBlogs(),
    getDestinationSlugs(),
    getAllPlaceParams(),
    getPackageRows(),
  ]);

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, path)}`,
        changeFrequency:
          path === "/" || path === "/kodaikanal" ? "weekly" : "monthly",
        priority:
          path === "/"
            ? 1
            : path === "/kodaikanal" || path === "/packages"
              ? 0.9
              : 0.7,
        alternates: { languages: hreflangAlternates(path) },
      });
    }

    for (const slug of destinationSlugs) {
      const destPath = `/destinations/${slug}`;
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, destPath)}`,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: { languages: hreflangAlternates(destPath) },
      });
    }

    for (const place of places) {
      const placePath = `/destinations/${place.destination}/places/${place.place}`;
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, placePath)}`,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: hreflangAlternates(placePath) },
      });
    }

    for (const pkg of packageRows) {
      const pkgPath = `/packages/${pkg.id}`;
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, pkgPath)}`,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: hreflangAlternates(pkgPath) },
      });
    }

    for (const post of blogs) {
      if (locale === "ta" && !post.ta) continue;
      if (locale === "hi" && !post.hi) continue;
      const postPath = `/blog/${post.slug}`;
      const languages: Record<string, string> = {
        "x-default": absoluteUrl(routing.defaultLocale, postPath),
        en: absoluteUrl("en", postPath),
      };
      if (post.ta) languages.ta = absoluteUrl("ta", postPath);
      if (post.hi) languages.hi = absoluteUrl("hi", postPath);
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, postPath)}`,
        lastModified: Number.isNaN(new Date(post.date).getTime()) ? undefined : new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
