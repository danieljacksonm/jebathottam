/**
 * Simple in-memory rate limiter for public POST APIs.
 * Prefer Redis when REDIS_URL is set (best-effort; falls back to memory).
 */

type Bucket = { count: number; resetAt: number };

const memory = new Map<string, Bucket>();

function clientKey(request: Request, prefix: string): string {
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = request.headers.get("x-real-ip")?.trim();
  const ip = fwd || real || "unknown";
  return `${prefix}:${ip}`;
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

/** Allow `limit` requests per `windowMs` for this client + bucket. */
export function rateLimit(
  request: Request,
  bucket: string,
  limit = 10,
  windowMs = 60_000
): RateLimitResult {
  const key = clientKey(request, bucket);
  const now = Date.now();
  const existing = memory.get(key);
  if (!existing || existing.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (existing.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }
  existing.count += 1;
  return { ok: true };
}

export function rateLimitResponse(retryAfterSec: number) {
  return new Response(JSON.stringify({ error: "Too many requests. Please try again shortly." }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfterSec),
    },
  });
}
