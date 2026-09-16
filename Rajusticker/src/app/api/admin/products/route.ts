import { staffFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { payloadToWrite, productPayloadSchema } from "@/lib/product-payload";
import { slugify } from "@/lib/slug";

export async function GET(request: Request) {
  if (!staffFromRequest(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  const products = await prisma.product.findMany({
    include: { sizes: true },
    orderBy: { updatedAt: "desc" },
  });
  return Response.json(products);
}

export async function POST(request: Request) {
  if (!staffFromRequest(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  const json = await request.json().catch(() => null);
  const parsed = productPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Check the product fields" }, { status: 400 });
  }

  const slug = slugify(parsed.data.slug || parsed.data.name);
  const id = `rs-${slug}-${Date.now().toString(36)}`;
  const data = payloadToWrite(parsed.data, id);

  const created = await prisma.product.create({
    data: {
      ...data,
      sizes: { create: data.sizes },
    },
  });

  return Response.json({ id: created.id, slug: created.slug });
}
