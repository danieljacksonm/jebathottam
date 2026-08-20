import { NextRequest, NextResponse } from "next/server";
import { classifyDiscoverQuery } from "@/lib/discover/classify";
import { trackDiscover } from "@/lib/discover/analytics";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "click") {
      trackDiscover({
        type: "destination_clicked",
        query: body.query,
        intent: body.intent,
        destination: body.destination,
      });
      return NextResponse.json({ ok: true });
    }

    const q = String(body.q || body.query || "").trim();
    if (!q) {
      return NextResponse.json({ error: "Describe what you need" }, { status: 400 });
    }

    const result = classifyDiscoverQuery(q);
    trackDiscover({ type: "search", query: q });
    trackDiscover({ type: "intent_detected", query: q, intent: result.primaryIntent });
    trackDiscover({
      type: "recommendation_shown",
      query: q,
      intent: result.primaryIntent,
      destination: result.options.map((o) => o.id).join(","),
    });

    return NextResponse.json({ result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
