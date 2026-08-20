import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/catalog/repository";

export const dynamic = "force-dynamic";

/** Public analytics beacon — no secrets, rate-limit lightly via small payload only */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const type = body.type as
      | "product_view"
      | "search"
      | "compare"
      | "affiliate_click"
      | "recommend"
      | undefined;
    if (!type) return NextResponse.json({ error: "type required" }, { status: 400 });
    trackEvent({
      type,
      productId: body.productId,
      offerId: body.offerId,
      query: body.query,
      meta: body.meta,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
