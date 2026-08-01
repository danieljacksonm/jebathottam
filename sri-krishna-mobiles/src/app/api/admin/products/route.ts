import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAdmin(request: Request): boolean {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_SECRET;
}

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, slug, description, price, categoryId, imageUrl, inStock, stockQty, wholesalePrice, sku, barcode } = body;
    if (!name || !slug || !description || price == null || !categoryId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const qty = Number(stockQty ?? 0);
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        wholesalePrice: wholesalePrice != null ? Number(wholesalePrice) : null,
        sku: sku || null,
        barcode: barcode || null,
        stockQty: qty,
        categoryId: Number(categoryId),
        imageUrl: imageUrl ?? null,
        inStock: inStock !== false && qty > 0,
      },
      include: { category: true },
    });
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
