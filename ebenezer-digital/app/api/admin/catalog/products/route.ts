import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getAnalyticsSummary, loadCatalogStore, mutateCatalog } from "@/lib/catalog/repository";
import type { CatalogProduct } from "@/app/catalog/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const store = loadCatalogStore();
  return NextResponse.json({
    products: store.products,
    summary: getAnalyticsSummary(),
  });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const product: CatalogProduct = {
      id: body.id || `p_${Date.now()}`,
      slug: body.slug,
      name: body.name,
      brand: body.brand || "",
      model: body.model || body.name,
      categoryId: body.categoryId || "laptops",
      shortDescription: body.shortDescription || "",
      description: body.description || "",
      image: body.image || "",
      gallery: body.gallery || [],
      specs: body.specs || {},
      pros: body.pros || [],
      cons: body.cons || [],
      bestFor: body.bestFor || [],
      notIdealFor: body.notIdealFor || [],
      rating: body.rating,
      reviewCount: body.reviewCount,
      status: body.status === "archived" ? "archived" : "active",
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      updatedAt: now,
    };
    if (!product.slug || !product.name) {
      return NextResponse.json({ error: "name and slug required" }, { status: 400 });
    }
    mutateCatalog((store) => {
      store.products.push(product);
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
    let updated: CatalogProduct | null = null;
    mutateCatalog((store) => {
      const idx = store.products.findIndex((p) => p.id === body.id);
      if (idx < 0) return;
      store.products[idx] = {
        ...store.products[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      updated = store.products[idx];
    });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  mutateCatalog((store) => {
    store.products = store.products.filter((p) => p.id !== id);
    store.offers = store.offers.filter((o) => o.productId !== id);
  });
  return NextResponse.json({ ok: true });
}
