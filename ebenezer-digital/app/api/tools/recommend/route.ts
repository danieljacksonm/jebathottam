import { NextResponse } from "next/server";
import { searchTools } from "@/lib/tools/context";

export const dynamic = "force-dynamic";

/** Deterministic tool recommendations — no invented tools or prices. */
export async function POST(request: Request) {
  let body: { query?: string; limit?: number } = {};
  try {
    body = (await request.json()) as { query?: string; limit?: number };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const query = (body.query || "").trim();
  if (!query) {
    return NextResponse.json({ error: "query required" }, { status: 400 });
  }
  const tools = searchTools(query, Math.min(body.limit || 6, 12));
  return NextResponse.json({
    query,
    tools: tools.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      tagline: t.tagline,
      bestFor: t.bestFor,
      pricing: t.pricing,
      href: `/tools/${t.id}`,
      url: t.url,
    })),
    note: "Recommendations use the Ebenezer Tools catalog only. Verify live pricing on each vendor site.",
  });
}
