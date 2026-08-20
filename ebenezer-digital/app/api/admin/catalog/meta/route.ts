import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { getAnalyticsSummary, loadCatalogStore, mutateCatalog, type BuyingGuide } from "@/lib/catalog/repository";
import { normalizeImportRows } from "@/lib/catalog/import";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const store = loadCatalogStore();
  return NextResponse.json({
    guides: store.guides,
    comparisons: store.comparisons,
    analytics: getAnalyticsSummary(),
  });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const body = await request.json();

  if (body.action === "import") {
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const { products, offers, errors } = normalizeImportRows(rows);
    mutateCatalog((store) => {
      for (const p of products) {
        const idx = store.products.findIndex((x) => x.id === p.id || x.slug === p.slug);
        if (idx >= 0) store.products[idx] = p;
        else store.products.push(p);
      }
      for (const o of offers) {
        const idx = store.offers.findIndex((x) => x.id === o.id);
        if (idx >= 0) store.offers[idx] = o;
        else store.offers.push(o);
      }
    });
    return NextResponse.json({ imported: products.length, offers: offers.length, errors });
  }

  if (body.action === "guide") {
    const guide: BuyingGuide = {
      id: body.id || `guide_${Date.now()}`,
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt || "",
      content: body.content || "",
      categoryId: body.categoryId,
      relatedProductIds: body.relatedProductIds || [],
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      status: body.status === "draft" ? "draft" : "published",
      updatedAt: new Date().toISOString(),
    };
    if (!guide.slug || !guide.title) {
      return NextResponse.json({ error: "slug and title required" }, { status: 400 });
    }
    mutateCatalog((s) => {
      const idx = s.guides.findIndex((g) => g.id === guide.id);
      if (idx >= 0) s.guides[idx] = guide;
      else s.guides.push(guide);
    });
    return NextResponse.json({ guide }, { status: 201 });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
