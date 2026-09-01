/**
 * Redis-backed cache with in-memory fallback.
 * Never crashes or spam-reconnects if Redis is down — common on VPS before install.
 */
type CacheEntry<T> = { value: T; expiresAt: number };

const memory = new Map<string, CacheEntry<unknown>>();

let redisClient: import("ioredis").default | null = null;
let redisInitAttempted = false;
let redisDisabled = false;

function disableRedis(client?: import("ioredis").default | null) {
  redisDisabled = true;
  if (client) {
    try {
      client.disconnect(false);
    } catch {
      /* ignore */
    }
  }
  if (redisClient === client || client === undefined) {
    redisClient = null;
  }
}

async function getRedis(): Promise<import("ioredis").default | null> {
  if (redisDisabled || redisInitAttempted) return redisClient;
  redisInitAttempted = true;

  const url = process.env.REDIS_URL?.trim();
  if (!url) return null;

  try {
    const { default: Redis } = await import("ioredis");
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 2000,
      lazyConnect: true,
      retryStrategy: () => null,
    });

    client.on("error", () => {
      disableRedis(client);
    });

    await client.connect();
    await client.ping();
    redisClient = client;
    return client;
  } catch {
    disableRedis();
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
      disableRedis(redis);
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
      disableRedis(redis);
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
