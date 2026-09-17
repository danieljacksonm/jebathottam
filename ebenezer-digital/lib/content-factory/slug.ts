import type { ContentChannel } from "./types";
import { CHANNEL_META } from "./types";
import { channelArticleCount } from "./matrix";

/** Slug format: {prefix}-{index padded to 6} e.g. tg-000042 */
export function indexToSlug(channel: ContentChannel, index: number): string {
  const { prefix } = CHANNEL_META[channel];
  return `${prefix}-${String(index).padStart(6, "0")}`;
}

export function slugToIndex(channel: ContentChannel, slug: string): number | null {
  const { prefix } = CHANNEL_META[channel];
  const m = slug.match(new RegExp(`^${prefix}-(\\d{1,6})$`));
  if (!m) return null;
  const index = parseInt(m[1], 10);
  if (Number.isNaN(index) || index < 0 || index >= channelArticleCount(channel)) return null;
  return index;
}

export function parseAnyFactorySlug(slug: string): { channel: ContentChannel; index: number } | null {
  const channels: ContentChannel[] = ["tools", "studio", "store", "discover"];
  for (const ch of channels) {
    const index = slugToIndex(ch, slug);
    if (index !== null) return { channel: ch, index };
  }
  return null;
}
