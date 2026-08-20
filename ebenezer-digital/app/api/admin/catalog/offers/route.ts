import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { loadCatalogStore, mutateCatalog } from "@/lib/catalog/repository";
import type { Offer } from "@/app/catalog/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  return NextResponse.json({ offers: loadCatalogStore().offers });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const offer: Offer = {
      id: body.id || `off_${Date.now()}`,
      productId: body.productId,
      variantId: body.variantId,
      merchantId: body.merchantId,
      price: Number(body.price),
      currency: body.currency || "INR",
      availability: body.availability || "unknown",
      url: body.url,
      affiliateUrl: body.affiliateUrl,
      shippingNote: body.shippingNote,
      warranty: body.warranty,
      lastCheckedAt: body.lastCheckedAt || new Date().toISOString(),
      source: body.source || "manual",
      confidence: body.confidence || "medium",
    };
    if (!offer.productId || !offer.merchantId || !offer.url || !Number.isFinite(offer.price)) {
      return NextResponse.json({ error: "productId, merchantId, url, price required" }, { status: 400 });
    }
    mutateCatalog((s) => s.offers.push(offer));
    return NextResponse.json({ offer }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  let updated: Offer | null = null;
  mutateCatalog((store) => {
    const idx = store.offers.findIndex((o) => o.id === body.id);
    if (idx < 0) return;
    store.offers[idx] = { ...store.offers[idx], ...body };
    if (body.price != null) store.offers[idx].price = Number(body.price);
    updated = store.offers[idx];
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ offer: updated });
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  mutateCatalog((s) => {
    s.offers = s.offers.filter((o) => o.id !== id);
  });
  return NextResponse.json({ ok: true });
}
