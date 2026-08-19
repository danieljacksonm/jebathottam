import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { originForKind, siteKindFromHost } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const kind = siteKindFromHost(headers().get("host"));
  const base = originForKind(kind);
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/blog/rss", "/api/news/rss", "/api/news/ical", "/api/news/sitemap"],
        disallow: ["/admin/", "/api/admin/", "/api/auth/", "/saas/login", "/products/checkout", "/products/account", "/products/success"],
      },
    ],
    sitemap: kind === "journal"
      ? [`${base}/sitemap.xml`, `${base}/api/news/sitemap`]
      : `${base}/sitemap.xml`,
  };
}
