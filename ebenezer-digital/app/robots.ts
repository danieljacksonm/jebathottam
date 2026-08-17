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
        allow: ["/", "/api/blog/rss", "/api/news/rss", "/api/news/ical"],
        disallow: ["/admin/", "/api/admin/", "/api/auth/", "/products/checkout", "/products/account", "/products/success"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
