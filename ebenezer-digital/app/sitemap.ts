import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { sitemapForKind } from "@/lib/site-sitemaps";
import { siteKindFromHost } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kind = siteKindFromHost(headers().get("host"));
  return sitemapForKind(kind);
}
