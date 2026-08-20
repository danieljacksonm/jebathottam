import { NextResponse } from "next/server";
import { findOffer, resolveOutboundUrl } from "@/lib/catalog/affiliate";
import { trackEvent } from "@/lib/catalog/repository";

type Params = { params: { offerId: string } };

export function GET(req: Request, { params }: Params) {
  const offer = findOffer(params.offerId);
  if (!offer) {
    return NextResponse.redirect(new URL("/catalog", req.url));
  }
  trackEvent({
    type: "affiliate_click",
    productId: offer.productId,
    offerId: offer.id,
  });
  return NextResponse.redirect(resolveOutboundUrl(offer), 302);
}
