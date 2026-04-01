/**
 * Get image URL from an item that may have `image_url` (API) or `image` (fallback content).
 * Use this wherever gallery/media/slider items can come from API or static data.
 */
export function getImageSrc(
  item: { image_url?: string | null; image?: string } | Record<string, unknown> | null | undefined
): string {
  if (!item || typeof item !== 'object') return '';
  const u = (item as Record<string, unknown>)['image_url'];
  const i = (item as Record<string, unknown>)['image'];
  if (typeof u === 'string' && u.trim()) return u.trim();
  if (typeof i === 'string' && i.trim()) return i.trim();
  return '';
}

/**
 * Append width/quality params to our upload URLs for faster loading.
 * Only modifies /api/uploads/... paths; external URLs are returned as-is.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number = 800,
  quality: number = 82
): string {
  if (!url || typeof url !== 'string') return '';
  const u = url.trim();
  if (!u.startsWith('/api/uploads/')) return u;
  const sep = u.includes('?') ? '&' : '?';
  return `${u}${sep}w=${width}&q=${quality}`;
}
