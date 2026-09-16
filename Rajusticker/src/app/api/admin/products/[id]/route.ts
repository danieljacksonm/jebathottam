import { staffFromRequest } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { mapProduct } from "@/lib/products";
import { payloadToWrite, productPayloadSchema } from "@/lib/product-payload";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Ctx) {
  if (!staffFromRequest(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id } = await params;
  const row = await prisma.product.findUnique({ where: { id }, include: { sizes: true } });
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(mapProduct(row));
}

export async function PUT(request: Request, { params }: Ctx) {
  if (!staffFromRequest(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const json = await request.json().catch(() => null);
  const parsed = productPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Check the product fields" }, { status: 400 });
  }

  const data = payloadToWrite(parsed.data, id);
  const { sizes, id: _id, ...rest } = data;

  await prisma.$transaction([
    prisma.productSize.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        ...rest,
        sizes: { create: sizes },
      },
    }),
  ]);

  return Response.json({ id, slug: data.slug });
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!staffFromRequest(request)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { published?: boolean } | null;
  if (typeof body?.published !== "boolean") {
    return Response.json({ error: "Nothing to update" }, { status: 400 });
  }
  await prisma.product.update({ where: { id }, data: { published: body.published } });
  return Response.json({ ok: true });
}
