import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { originForKind, siteKindFromHost } from "@/lib/site-url";

/** AI crawlers explicitly allowed (in addition to *). */
const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const kind = siteKindFromHost(headers().get("host"));
  const base = originForKind(kind);

  const sitemaps =
    kind === "news"
      ? [`${base}/sitemap.xml`, `${base}/api/news/sitemap`]
      : [`${base}/sitemap.xml`];

  const sharedAllow = [
    "/",
    "/llms.txt",
    "/sitemap.html",
    "/api/blog/rss",
    "/api/news/rss",
    "/api/news/ical",
    "/api/news/sitemap",
  ];

  const sharedDisallow = [
    "/admin/",
    "/api/admin/",
    "/api/auth/",
    "/login",
    "/register",
    "/app",
    "/saas/login",
    "/products/checkout",
    "/products/account",
    "/products/success",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: sharedAllow,
        disallow: sharedDisallow,
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: sharedAllow,
        disallow: sharedDisallow,
      })),
    ],
    sitemap: sitemaps.length === 1 ? sitemaps[0] : sitemaps,
    host: base.replace(/^https:\/\//, ""),
  };
}
