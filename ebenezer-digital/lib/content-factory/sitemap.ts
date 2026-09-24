import type { MetadataRoute } from "next";
import { SITEMAP_CHUNK_SIZE } from "@/lib/sitemap-xml";
import { originForKind, publicUrlForInternalPath, type SiteKind } from "@/lib/site-url";
import { channelArticleCount } from "./matrix";
import { indexToSlug } from "./slug";
import type { ContentChannel } from "./types";
import { CHANNEL_META } from "./types";

export function channelForSiteKind(kind: SiteKind): ContentChannel | null {
  if (kind === "tools") return "tools";
  if (kind === "studio") return "studio";
  if (kind === "store") return "store";
  if (kind === "discover") return "discover";
  return null;
}

export function factoryChunkCount(channel: ContentChannel): number {
  return Math.ceil(channelArticleCount(channel) / SITEMAP_CHUNK_SIZE);
}

export function factoryChunkSitemapLocs(origin: string, channel: ContentChannel): string[] {
  const n = factoryChunkCount(channel);
  return Array.from({ length: n }, (_, i) => `${origin}/sitemaps/factory/${channel}/${i}`);
}

export function factorySitemapEntries(
  channel: ContentChannel,
  chunkId: number,
  kind: SiteKind
): MetadataRoute.Sitemap {
  const total = channelArticleCount(channel);
  const start = chunkId * SITEMAP_CHUNK_SIZE;
  if (start >= total) return [];
  const end = Math.min(start + SITEMAP_CHUNK_SIZE, total);
  const { basePath } = CHANNEL_META[channel];
  const entries: MetadataRoute.Sitemap = [];
  for (let i = start; i < end; i++) {
    const slug = indexToSlug(channel, i);
    const internal = `${basePath}/${slug}`;
    entries.push({
      url: publicUrlForInternalPath(internal, kind),
      lastModified: new Date("2025-06-01T08:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }
  return entries;
}

export function factorySitemapLocsForKind(kind: SiteKind): string[] {
  // Opt-in only. Default off so Google is not asked to fetch ~112 factory chunks (~100k URLs).
  // Set EBEN_FACTORY_SITEMAPS=1 when factory content is intentionally published for crawl.
  if (process.env.EBEN_FACTORY_SITEMAPS !== "1") return [];
  const channel = channelForSiteKind(kind);
  if (!channel) return [];
  return factoryChunkSitemapLocs(originForKind(kind), channel);
}
