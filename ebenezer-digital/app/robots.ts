import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ebenezerdigital.info";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/blog/rss", "/api/news/rss", "/api/news/ical"],
        disallow: ["/admin/", "/api/admin/", "/api/auth/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
