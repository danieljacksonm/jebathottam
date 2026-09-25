import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const destination = await prisma.destination.findUnique({ where: { id } });
  if (!destination) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ destination });
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const existing = await prisma.destination.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const destination = await prisma.destination.update({
    where: { id },
    data: {
      slug: body.slug
        ? String(body.slug)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
        : undefined,
      nameEn: body.nameEn != null ? String(body.nameEn) : undefined,
      nameTa: body.nameTa != null ? String(body.nameTa) : undefined,
      nameHi: body.nameHi != null ? String(body.nameHi) : undefined,
      country: body.country != null ? String(body.country) : undefined,
      continent: body.continent != null ? String(body.continent) : undefined,
      region: body.region != null ? String(body.region) : undefined,
      taglineEn: body.taglineEn != null ? String(body.taglineEn) : undefined,
      taglineTa: body.taglineTa != null ? String(body.taglineTa) : undefined,
      taglineHi: body.taglineHi != null ? String(body.taglineHi) : undefined,
      bodyEn: body.bodyEn != null ? String(body.bodyEn) : undefined,
      bodyTa: body.bodyTa != null ? String(body.bodyTa) : undefined,
      bodyHi: body.bodyHi != null ? String(body.bodyHi) : undefined,
      image: body.image != null ? String(body.image) : undefined,
      status: body.status != null ? String(body.status) : undefined,
      featured: typeof body.featured === "boolean" ? body.featured : undefined,
      priceFrom:
        body.priceFrom === ""
          ? null
          : body.priceFrom != null
            ? Number(body.priceFrom)
            : undefined,
      sortOrder:
        body.sortOrder != null ? Number(body.sortOrder) : undefined,
    },
  });

  revalidatePath("/en/destinations");
  revalidatePath(`/en/destinations/${destination.slug}`);
  revalidatePath("/ta/destinations");
  revalidatePath("/hi/destinations");
  return NextResponse.json({ destination });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.destination.delete({ where: { id } }).catch(() => null);
  revalidatePath("/en/destinations");
  return NextResponse.json({ ok: true });
}
