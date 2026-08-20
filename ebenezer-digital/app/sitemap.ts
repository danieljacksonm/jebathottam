import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { sitemapForKind } from "@/lib/site-sitemaps";
import { siteKindFromHost } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const kind = siteKindFromHost(headers().get("host"));
    return await sitemapForKind(kind);
  } catch (error) {
    console.error("Sitemap failed", error);
    return [];
  }
}
