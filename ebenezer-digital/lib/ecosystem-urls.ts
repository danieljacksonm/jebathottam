/**
 * Canonical Ebenezer Digital ecosystem URLs.
 * These defaults are NEVER overridden by unrelated env values (e.g. Canaan Travel Hub).
 */

export const CANONICAL_URLS = {
  studio: "https://ebenezerdigital.com",
  info: "https://ebenezerdigital.info",
  journal: "https://journal.ebenezerdigital.info",
  news: "https://news.ebenezerdigital.info",
  store: "https://ebenezerdigital.store",
  products: "https://products.ebenezerdigital.com",
  tools: "https://tools.ebenezerdigital.com",
  ai: "https://ai.ebenezerdigital.com",
  saas: "https://saas.ebenezerdigital.com",
  discover: "https://discover.ebenezerdigital.com",
  network: "https://ebenezerdigital.net",
} as const;

/** Domains that must never appear in ecosystem nav links. */
export const FORBIDDEN_URL_FRAGMENTS = [
  "canaantravelhub.com",
  "canaan.yegova.store",
  "krishna.yegova.store",
] as const;

const ALLOWED_HOSTS = new Set([
  "ebenezerdigital.com",
  "www.ebenezerdigital.com",
  "ebenezerdigital.info",
  "www.ebenezerdigital.info",
  "journal.ebenezerdigital.info",
  "news.ebenezerdigital.info",
  "ebenezerdigital.store",
  "www.ebenezerdigital.store",
  "ebenezer.store",
  "www.ebenezer.store",
  "products.ebenezerdigital.com",
  "tools.ebenezerdigital.com",
  "deals.ebenezerdigital.com",
  "ai.ebenezerdigital.com",
  "saas.ebenezerdigital.com",
  "discover.ebenezerdigital.com",
  "ebenezerdigital.net",
  "www.ebenezerdigital.net",
  "localhost",
  "127.0.0.1",
]);

function isAllowedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (ALLOWED_HOSTS.has(h)) return true;
  if (h.endsWith(".local")) return true;
  if (h.endsWith(".ebenezerdigital.com")) return true;
  if (h.endsWith(".ebenezerdigital.info")) return true;
  return false;
}

/** Resolve a public URL from env, falling back to canonical when env points outside the ecosystem. */
export function resolveEcosystemUrl(envValue: string | undefined, canonical: string): string {
  const fallback = canonical.replace(/\/$/, "");
  const raw = (envValue || "").trim().replace(/\/$/, "");
  if (!raw) return fallback;

  for (const bad of FORBIDDEN_URL_FRAGMENTS) {
    if (raw.toLowerCase().includes(bad)) {
      if (process.env.NODE_ENV === "production") {
        console.error(`[ecosystem-urls] Blocked forbidden URL "${raw}" → using ${fallback}`);
      }
      return fallback;
    }
  }

  try {
    const { hostname } = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (isAllowedHost(hostname)) return raw.startsWith("http") ? raw : `https://${raw}`;
  } catch {
    /* invalid URL */
  }

  if (process.env.NODE_ENV === "production") {
    console.error(`[ecosystem-urls] Rejected non-ecosystem URL "${raw}" → using ${fallback}`);
  }
  return fallback;
}
