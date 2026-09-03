import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { JOURNAL_URL, publicUrlForInternalPath } from "@/lib/site-url";

export const dynamic = "force-dynamic";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 for feed readers — pretty journal URLs matching sitemap/canonicals. */
export async function GET() {
  try {
    const posts = await db.getBlogPosts(true);
    const origin = JOURNAL_URL.replace(/\/$/, "");
    const channelLink = publicUrlForInternalPath("/blog", "journal");
    const latest = posts.slice(0, 200);

    const items = latest
      .map((p) => {
        const link = publicUrlForInternalPath(`/blog/${p.slug}`, "journal");
        const pub = p.publishedAt?.toUTCString?.() || new Date().toUTCString();
        const desc = escapeXml(p.seoDescription || p.excerpt || "");
        const cats = [p.category, ...(p.tags || []).slice(0, 4)]
          .filter(Boolean)
          .map((c) => `<category>${escapeXml(c)}</category>`)
          .join("");
        const enclosure = p.coverImage
          ? `<enclosure url="${escapeXml(p.coverImage)}" type="image/jpeg" />`
          : "";
        return `<item>
<title>${escapeXml(p.title)}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${pub}</pubDate>
<description>${desc}</description>
${cats}
${enclosure}
</item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>Ebenezer Journal — Digital Learn Desk</title>
<link>${channelLink}</link>
<description>Simple, detailed digital explainers (Class‑5 English) plus journal stories. Explore deeper with Ebenezer AI at /ai.</description>
<language>en-in</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<atom:link href="${origin}/api/blog/rss" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("Blog RSS error:", error);
    return NextResponse.json({ error: "RSS failed" }, { status: 500 });
  }
}
