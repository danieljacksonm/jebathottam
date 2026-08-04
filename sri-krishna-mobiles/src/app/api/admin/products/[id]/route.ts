import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.error;

  const id = Number((await params).id);
  if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.error;

  const id = Number((await params).id);
  if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const body = await request.json();
  const {
    name,
    slug,
    description,
    price,
    categoryId,
    imageUrl,
    inStock,
    stockQty,
    wholesalePrice,
    sku,
    barcode,
  } = body;
  const qty = stockQty != null ? Number(stockQty) : undefined;
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name != null && { name }),
      ...(slug != null && { slug }),
      ...(description != null && { description }),
      ...(price != null && { price: Number(price) }),
      ...(wholesalePrice !== undefined && {
        wholesalePrice: wholesalePrice != null ? Number(wholesalePrice) : null,
      }),
      ...(sku !== undefined && { sku: sku || null }),
      ...(barcode !== undefined && { barcode: barcode || null }),
      ...(qty !== undefined && { stockQty: qty }),
      ...(categoryId != null && { categoryId: Number(categoryId) }),
      ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      ...(inStock !== undefined && { inStock: !!inStock }),
      ...(qty !== undefined && { inStock: qty > 0 }),
    },
    include: { category: true },
  });
  return NextResponse.json(product);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.error;

  const id = Number((await params).id);
  if (Number.isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
