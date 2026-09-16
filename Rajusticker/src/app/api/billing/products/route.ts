import { staffFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { mapProduct } from "@/lib/products";

export async function GET(request: Request) {
  if (!staffFromRequest(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  const q = new URL(request.url).searchParams.get("q")?.trim().toLowerCase() || "";
  const rows = await prisma.product.findMany({
    where: { published: true },
    include: { sizes: true },
    orderBy: { name: "asc" },
  });
  const products = rows.map(mapProduct).filter((product) => {
    if (!q) return true;
    return [product.name, product.sku, product.color, product.finishLabel]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
  return Response.json(products.slice(0, 24));
}
