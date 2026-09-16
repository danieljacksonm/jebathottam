import { NextRequest, NextResponse } from "next/server";
import { refreshLiveNewsWire } from "@/lib/live-news";
import { invalidatePublicNewsMemo } from "@/lib/news-service";
import { rememberNewsForSitemap } from "@/lib/news-sitemap-archive";
import { upsertNewsLibrary } from "@/lib/news-library";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Cron/wire refresh. Set CRON_SECRET and call with Authorization: Bearer secret.
// Schedule: every 10 minutes — see scripts/install-news-wire-cron.sh
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET not configured" }, { status: 503 });
  }
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items, fetchedAt } = await refreshLiveNewsWire();
    invalidatePublicNewsMemo();
    try {
      rememberNewsForSitemap(items);
      await upsertNewsLibrary(items);
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
