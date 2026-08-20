import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { loadCatalogStore, mutateCatalog } from "@/lib/catalog/repository";
import type { Merchant } from "@/app/catalog/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  return NextResponse.json({ merchants: loadCatalogStore().merchants });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const body = await request.json();
  const merchant: Merchant = {
    id: body.id || String(body.name || "merchant")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"),
    name: body.name,
    logo: body.logo,
    website: body.website,
    country: body.country || "IN",
    currency: body.currency || "INR",
    affiliateNetwork: body.affiliateNetwork,
    status: body.status === "paused" ? "paused" : "active",
  };
  if (!merchant.name || !merchant.website) {
    return NextResponse.json({ error: "name and website required" }, { status: 400 });
  }
  mutateCatalog((s) => s.merchants.push(merchant));
  return NextResponse.json({ merchant }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  let updated: Merchant | null = null;
  mutateCatalog((store) => {
    const idx = store.merchants.findIndex((m) => m.id === body.id);
    if (idx < 0) return;
    store.merchants[idx] = { ...store.merchants[idx], ...body };
    updated = store.merchants[idx];
  });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ merchant: updated });
}
