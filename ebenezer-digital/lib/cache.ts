/**
 * Redis-backed cache with in-memory fallback for local dev / missing REDIS_URL.
 */
type CacheEntry<T> = { value: T; expiresAt: number };

const memory = new Map<string, CacheEntry<unknown>>();

let redisClient: import("ioredis").default | null = null;
let redisInitAttempted = false;

async function getRedis(): Promise<import("ioredis").default | null> {
  if (redisInitAttempted) return redisClient;
  redisInitAttempted = true;
  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;
  try {
    const { default: Redis } = await import("ioredis");
    redisClient = new Redis(url, { maxRetriesPerRequest: 2, lazyConnect: true });
    await redisClient.connect();
    return redisClient;
  } catch {
    redisClient = null;
    return null;
  }
}

function memGet<T>(key: string): T | null {
  const hit = memory.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    memory.delete(key);
    return null;
  }
  return hit.value as T;
}

function memSet<T>(key: string, value: T, ttlSeconds: number) {
  memory.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = await getRedis();
  if (redis) {
    try {
      const raw = await redis.get(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      /* fall through */
    }
  }
  return memGet<T>(key);
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
      return;
    } catch {
      /* fall through */
    }
  }
  memSet(key, value, ttlSeconds);
}

/** Cache wrapper with stale-while-revalidate pattern. */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const hit = await cacheGet<T>(key);
  if (hit !== null) return hit;
  const fresh = await fetcher();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}
