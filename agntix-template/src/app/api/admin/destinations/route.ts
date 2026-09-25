import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const destinations = await prisma.destination.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    select: {
      id: true,
      slug: true,
      nameEn: true,
      country: true,
      continent: true,
      status: true,
      featured: true,
      image: true,
      priceFrom: true,
      sortOrder: true,
      updatedAt: true,
      _count: { select: { places: true, blogs: true, packages: true } },
    },
  });
  return NextResponse.json({ destinations });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const slug = String(body.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
  if (!slug || !body.nameEn) {
    return NextResponse.json(
      { error: "slug and nameEn are required" },
      { status: 400 },
    );
  }
  const dest = await prisma.destination.create({
    data: {
      slug,
      nameEn: String(body.nameEn),
      nameTa: String(body.nameTa || body.nameEn),
      nameHi: String(body.nameHi || body.nameEn),
      country: String(body.country || "India"),
      continent: String(body.continent || "Asia"),
      region: String(body.region || ""),
      taglineEn: String(body.taglineEn || ""),
      taglineTa: String(body.taglineTa || body.taglineEn || ""),
      taglineHi: String(body.taglineHi || body.taglineEn || ""),
      bodyEn: String(body.bodyEn || ""),
      bodyTa: String(body.bodyTa || body.bodyEn || ""),
      bodyHi: String(body.bodyHi || body.bodyEn || ""),
      image: String(body.image || "/images/travel/d/kodaikanal.jpg"),
      status: String(body.status || "enquiry"),
      featured: Boolean(body.featured),
      priceFrom:
        body.priceFrom === "" || body.priceFrom == null
          ? null
          : Number(body.priceFrom),
      sortOrder: Number(body.sortOrder) || 0,
    },
  });
  revalidatePath("/en/destinations");
  revalidatePath("/ta/destinations");
  revalidatePath("/hi/destinations");
  return NextResponse.json({ destination: dest });
}
