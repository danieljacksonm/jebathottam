import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category");
  try {
    const where = categorySlug
      ? { category: { slug: categorySlug }, stockQty: { gt: 0 } }
      : { stockQty: { gt: 0 } };
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
