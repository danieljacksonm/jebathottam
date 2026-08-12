import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const products = await db.getDigitalProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    const slug =
      body.slug ||
      String(body.name || "product")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const product = await db.createDigitalProduct({
      slug,
      name: body.name,
      tagline: body.tagline || "",
      description: body.description || "",
      story: body.story || "",
      category: body.category || "Templates",
      price: Number(body.price) || 0,
      compareAt: body.compareAt != null ? Number(body.compareAt) : undefined,
      badge: body.badge || undefined,
      image: body.image || "/images/journal/hero.jpg",
      gallery: Array.isArray(body.gallery) ? body.gallery : body.image ? [body.image] : [],
      features: Array.isArray(body.features) ? body.features : [],
      includes: Array.isArray(body.includes) ? body.includes : [],
      compatibility: Array.isArray(body.compatibility) ? body.compatibility : [],
      license: Array.isArray(body.license) ? body.license : ["Personal"],
      whoItIsFor: body.whoItIsFor,
      downloadContentsPlan: Array.isArray(body.downloadContentsPlan) ? body.downloadContentsPlan : undefined,
      isSoftware: Boolean(body.isSoftware),
      externalUrl: body.externalUrl,
      externalCta: body.externalCta,
      rating: body.rating != null ? Number(body.rating) : undefined,
      reviews: body.reviews != null ? Number(body.reviews) : undefined,
      isFree: Boolean(body.isFree) || Number(body.price) === 0,
      isBundle: Boolean(body.isBundle),
      bundleItems: Array.isArray(body.bundleItems) ? body.bundleItems : undefined,
      status: body.status || "draft",
      publishedAt: body.status === "published" ? new Date() : undefined,
      downloadFile: body.downloadFile,
      fileName: body.fileName,
      fileSize: body.fileSize,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create store product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const { id, ...data } = body;
    if (data.price != null) data.price = Number(data.price);
    if (data.compareAt != null) data.compareAt = Number(data.compareAt);
    if (data.status === "published" && !data.publishedAt) data.publishedAt = new Date();
    const product = await db.updateDigitalProduct(id, data);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update store product error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth.error) return auth.error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
  const deleted = await db.deleteDigitalProduct(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
