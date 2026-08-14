let cache: { at: number; body: unknown } | null = null;
const TTL_MS = 30_000;

export function getCachedPublicContent(): unknown | null {
  if (!cache) return null;
  if (Date.now() - cache.at > TTL_MS) {
    cache = null;
    return null;
  }
  return cache.body;
}

export function setCachedPublicContent(body: unknown) {
  cache = { at: Date.now(), body };
}

export function clearCachedPublicContent() {
  cache = null;
}
