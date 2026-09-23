import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllBlogSlugs } from "@/data/blog";
import { getAllPlaceParams, getDestinationSlugs } from "@/data/destinations";
import { packageRows } from "@/data/packages";
import { SITE_URL, absoluteUrl, localizedPath } from "@/lib/seo";

const staticPaths = [
  "/",
  "/kodaikanal",
  "/destinations",
  "/packages",
  "/tours",
  "/services",
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
  const [blogSlugs, destinationSlugs, places] = await Promise.all([
    getAllBlogSlugs(8000),
    getDestinationSlugs(),
    getAllPlaceParams(),
  ]);

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, path)}`,
        lastModified: new Date(),
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
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: { languages: hreflangAlternates(destPath) },
      });
    }

    for (const place of places) {
      const placePath = `/destinations/${place.destination}/places/${place.place}`;
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, placePath)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: hreflangAlternates(placePath) },
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

    for (const slug of blogSlugs) {
      const postPath = `/blog/${slug}`;
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, postPath)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: hreflangAlternates(postPath) },
      });
    }
  }

  return entries;
}
