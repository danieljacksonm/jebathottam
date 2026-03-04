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
