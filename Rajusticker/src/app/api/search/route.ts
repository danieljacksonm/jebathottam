import { searchProducts } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit") || 8)));
  const results = (await searchProducts(q))
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.images[0],
      category: p.category,
    }));

  return Response.json({ query: q, results });
}
