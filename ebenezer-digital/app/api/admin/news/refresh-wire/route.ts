import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { refreshLiveNewsWire } from "@/lib/live-news";
import { invalidatePublicNewsMemo } from "@/lib/news-service";
import { rememberNewsForSitemap } from "@/lib/news-sitemap-archive";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Admin-only wire refresh. Does not run on page renders.
 * Persists to data/live-news-cache.json + sitemap archive (throttled).
 */
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;

  try {
    const { items, fetchedAt } = await refreshLiveNewsWire();
    invalidatePublicNewsMemo();
    try {
      rememberNewsForSitemap(items);
    } catch {
      /* archive best-effort */
    }
    return NextResponse.json({
      ok: true,
      count: items.length,
      fetchedAt,
      latestPublishedAt: items[0]?.publishedAt || null,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "refresh failed" },
      { status: 500 }
    );
  }
}
