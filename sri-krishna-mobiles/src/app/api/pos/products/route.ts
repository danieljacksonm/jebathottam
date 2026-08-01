import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requirePosSession } from "@/lib/pos-auth";

export async function GET() {
  const auth = await requirePosSession();
  if (auth.error) return auth.error;

  try {
    const products = await prisma.product.findMany({
      where: {
        stockQty: { gt: 0 },
      },
      include: { category: true },
      orderBy: { name: "asc" },
    });

    const mapped = products.map((p) => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      wholesalePrice: p.wholesalePrice,
      stock: p.stockQty,
      sku: p.sku || `SKU-${p.id}`,
      barcode: p.barcode || "",
      category: p.category?.name || "General",
      imageUrl: p.imageUrl,
    }));

    return NextResponse.json({ products: mapped });
  } catch (error) {
    console.error("POS products error:", error);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
