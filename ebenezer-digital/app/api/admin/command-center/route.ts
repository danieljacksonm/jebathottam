import { NextRequest, NextResponse } from "next/server";
import { getLiveTools } from "@/lib/network/registry";
import { NEWS_GOOGLE_NEWS_MAX_URLS } from "@/lib/news-sitemap-archive";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { verifyToken } from "@/lib/auth";
import {
  gscVerificationForKind,
  type SiteKind,
} from "@/lib/site-url";
import { ECOSYSTEM_SITES, checkAllSites } from "@/lib/command-center/health-check";
import { runStaticSeoAudit } from "@/lib/seo/ecosystem-audit";

export const dynamic = "force-dynamic";

async function newsSitemapStats() {
  const newsUrl = ECOSYSTEM_SITES.find((s) => s.kind === "news")?.url;
  if (!newsUrl) return null;
  try {
    const [standard, google] = await Promise.all([
      fetch(`${newsUrl}/sitemap.xml`, { cache: "no-store", signal: AbortSignal.timeout(15000) }),
      fetch(`${newsUrl}/api/news/sitemap`, { cache: "no-store", signal: AbortSignal.timeout(15000) }),
    ]);
    const standardXml = standard.ok ? await standard.text() : "";
    const googleXml = google.ok ? await google.text() : "";
    const standardCount = (standardXml.match(/<loc>/g) || []).length;

    let googleCount = 0;
    let dates: string[] = [];
    let chunkFiles = 0;

    if (googleXml.includes("<sitemapindex")) {
      const chunkLocs = Array.from(
        googleXml.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)
      ).map((m) => m[1]);
      chunkFiles = chunkLocs.length;
      const chunks = await Promise.all(
        chunkLocs.map((loc) =>
          fetch(loc, { cache: "no-store", signal: AbortSignal.timeout(15000) })
            .then(async (r) => (r.ok ? r.text() : ""))
            .catch(() => "")
        )
      );
      for (const xml of chunks) {
        googleCount += (xml.match(/<loc>/g) || []).length;
        dates.push(
          ...Array.from(xml.matchAll(/<news:publication_date>([^<]+)<\/news:publication_date>/g)).map(
            (m) => m[1]
          )
        );
      }
    } else {
      chunkFiles = 1;
      googleCount = (googleXml.match(/<loc>/g) || []).length;
      dates = Array.from(
        googleXml.matchAll(/<news:publication_date>([^<]+)<\/news:publication_date>/g)
      ).map((m) => m[1]);
    }

    dates.sort();
    return {
      standardCount,
      googleCount,
      chunkFiles,
      capPerFile: NEWS_GOOGLE_NEWS_MAX_URLS,
      atCap: chunkFiles > 0 && googleCount >= NEWS_GOOGLE_NEWS_MAX_URLS * chunkFiles,
      windowDays: 7,
      archiveDays: null,
      oldest: dates[0] || null,
      newest: dates.at(-1) || null,
      ok: standard.ok && google.ok,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [sites, newsSitemap] = await Promise.all([checkAllSites(), newsSitemapStats()]);
  const tools = getLiveTools();

  const gsc: Partial<Record<SiteKind, boolean>> = {};
  for (const site of ECOSYSTEM_SITES) {
    gsc[site.kind] = Boolean(gscVerificationForKind(site.kind));
  }

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    sites,
    newsSitemap,
    seo: runStaticSeoAudit(),
    tools: {
      total: tools.length,
      featured: tools.filter((t) => t.featured).length,
      live: tools.filter((t) => t.status === "live").length,
    },
    analytics: {
      ga4: GA_MEASUREMENT_ID ? "configured" : "unavailable",
      measurementId: GA_MEASUREMENT_ID ? `${GA_MEASUREMENT_ID.slice(0, 4)}…` : null,
    },
    searchConsole: gsc,
  });
}
