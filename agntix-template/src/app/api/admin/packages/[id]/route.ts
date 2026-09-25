import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

async function syncPackagesJson() {
  const rows = await prisma.travelPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
  });
  const jsonRows = rows.map((row) => ({
    id: row.slug,
    destinationSlug: row.destinationSlug,
    nights: row.nights,
    days: row.days,
    priceFrom: row.priceFrom,
    currency: row.currency,
    category: row.category,
    featured: row.featured,
    published: row.published,
    pricingMode: row.pricingMode,
    image: row.image,
    tagline: JSON.parse(row.taglineJson || "{}"),
    highlights: JSON.parse(row.highlightsJson || '{"en":[],"ta":[],"hi":[]}'),
    title: JSON.parse(row.titleJson),
    blurb: JSON.parse(row.blurbJson),
    body: JSON.parse(row.bodyJson),
    sharedInclusions: JSON.parse(
      row.sharedInclusionsJson || '{"en":[],"ta":[],"hi":[]}',
    ),
    tiers: JSON.parse(row.tiersJson || "[]"),
    groupNote: JSON.parse(row.groupNoteJson || "{}"),
  }));
  const outPath = path.join(process.cwd(), "content/db/packages.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({ table: "packages", version: 5, rows: jsonRows }, null, 2) +
      "\n",
  );
}

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const pkg = await prisma.travelPackage.findUnique({ where: { id } });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ package: pkg });
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const existing = await prisma.travelPackage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const destSlug =
    body.destinationSlug != null
      ? String(body.destinationSlug)
      : existing.destinationSlug;
  const dest = await prisma.destination.findUnique({
    where: { slug: destSlug },
    select: { id: true },
  });

  const pricingMode =
    body.pricingMode != null
      ? body.pricingMode === "confirmed"
        ? "confirmed"
        : "enquiry"
      : existing.pricingMode;

  const title =
    body.titleEn != null
      ? {
          en: String(body.titleEn),
          ta: String(body.titleTa || body.titleEn),
          hi: String(body.titleHi || body.titleEn),
        }
      : null;
  const blurb =
    body.blurbEn != null
      ? {
          en: String(body.blurbEn),
          ta: String(body.blurbTa || body.blurbEn),
          hi: String(body.blurbHi || body.blurbEn),
        }
      : null;
  const bodyLoc =
    body.bodyEn != null
      ? {
          en: String(body.bodyEn),
          ta: String(body.bodyTa || body.bodyEn),
          hi: String(body.bodyHi || body.bodyEn),
        }
      : null;
  const highlights =
    body.highlightsEn != null
      ? {
          en: Array.isArray(body.highlightsEn) ? body.highlightsEn : [],
          ta: Array.isArray(body.highlightsTa)
            ? body.highlightsTa
            : body.highlightsEn,
          hi: Array.isArray(body.highlightsHi)
            ? body.highlightsHi
            : body.highlightsEn,
        }
      : null;

  const pkg = await prisma.travelPackage.update({
    where: { id },
    data: {
      slug: body.slug
        ? String(body.slug)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
        : undefined,
      destinationSlug: destSlug,
      destinationId: dest?.id ?? null,
      nights: body.nights != null ? Number(body.nights) : undefined,
      days: body.days != null ? Number(body.days) : undefined,
      priceFrom:
        body.priceFrom != null || body.pricingMode != null
          ? pricingMode === "enquiry"
            ? 0
            : Number(body.priceFrom ?? existing.priceFrom) || 0
          : undefined,
      pricingMode,
      image: body.image != null ? String(body.image) : undefined,
      category: body.category != null ? String(body.category) : undefined,
      featured: typeof body.featured === "boolean" ? body.featured : undefined,
      published:
        typeof body.published === "boolean" ? body.published : undefined,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : undefined,
      titleJson: title ? JSON.stringify(title) : undefined,
      blurbJson: blurb ? JSON.stringify(blurb) : undefined,
      bodyJson: bodyLoc ? JSON.stringify(bodyLoc) : undefined,
      taglineJson:
        body.taglineEn != null
          ? JSON.stringify({
              en: String(body.taglineEn),
              ta: String(body.taglineTa || body.taglineEn),
              hi: String(body.taglineHi || body.taglineEn),
            })
          : undefined,
      highlightsJson: highlights ? JSON.stringify(highlights) : undefined,
      detailsJson:
        body.detailsJson != null
          ? typeof body.detailsJson === "string"
            ? body.detailsJson
            : JSON.stringify(body.detailsJson)
          : undefined,
      seoTitleEn:
        body.seoTitleEn != null ? String(body.seoTitleEn) : undefined,
      seoDescriptionEn:
        body.seoDescriptionEn != null
          ? String(body.seoDescriptionEn)
          : undefined,
    },
  });

  try {
    await syncPackagesJson();
  } catch {
    // ignore
  }
  revalidatePath("/en/packages");
  revalidatePath(`/en/packages/${pkg.slug}`);
  return NextResponse.json({ package: pkg });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.travelPackage.delete({ where: { id } }).catch(() => null);
  try {
    await syncPackagesJson();
  } catch {
    // ignore
  }
  revalidatePath("/en/packages");
  return NextResponse.json({ ok: true });
}
