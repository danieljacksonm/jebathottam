import { NextRequest, NextResponse } from "next/server";
import {
  applyProductFilters,
  getBestOffer,
  getProductBySlug,
  listActiveProducts,
  paginate,
} from "@/lib/catalog/query";
import { parseNaturalQuery, recommend } from "@/lib/catalog/scoring";
import { trackEvent } from "@/lib/catalog/repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get("q") || undefined;
  const category = sp.get("category") || undefined;
  const page = Number(sp.get("page") || 1);
  const pageSize = Number(sp.get("pageSize") || 12);
  const natural = sp.get("natural") === "1";

  if (natural && q) {
    const req = parseNaturalQuery(q);
    if (category) req.categoryId = category as typeof req.categoryId;
    const result = recommend(req);
    trackEvent({ type: "search", query: q, meta: { natural: true, hits: result.ranked.length } });
    return NextResponse.json({
      mode: "recommend",
      request: req,
      result,
    });
  }

  let products = listActiveProducts();
  if (category) products = products.filter((p) => p.categoryId === category);

  const filters: Record<string, string | undefined> = { q };
  for (const key of [
    "brand",
    "os",
    "ram_gb",
    "storage_gb",
    "capacity_gb",
    "refresh_hz",
    "price_max",
    "ddr_gen",
    "form_factor",
    "interface",
    "panel",
    "display_inches",
    "size_inches",
    "speed_mt",
    "read_mbps",
    "vram_gb",
  ]) {
    const v = sp.get(key);
    if (v) filters[key] = v;
  }

  products = applyProductFilters(products, filters, getBestOffer);
  const pageData = paginate(products, page, pageSize);

  if (q) trackEvent({ type: "search", query: q, meta: { hits: pageData.total } });

  return NextResponse.json({
    mode: "list",
    ...pageData,
    items: pageData.items.map((p) => ({
      ...p,
      bestOffer: getBestOffer(p.id),
    })),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.slug) {
      const product = getProductBySlug(body.slug);
      if (product) trackEvent({ type: "product_view", productId: product.id });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
