import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function emptyLoc(en = "") {
  return { en, ta: en, hi: en };
}

function emptyList(en: string[] = []) {
  return { en, ta: en, hi: en };
}

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

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const packages = await prisma.travelPackage.findMany({
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    select: {
      id: true,
      slug: true,
      destinationSlug: true,
      nights: true,
      days: true,
      priceFrom: true,
      pricingMode: true,
      featured: true,
      published: true,
      image: true,
      category: true,
      titleJson: true,
      updatedAt: true,
    },
  });
  return NextResponse.json({
    packages: packages.map((p) => ({
      ...p,
      titleEn: JSON.parse(p.titleJson || "{}")?.en ?? p.slug,
    })),
  });
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
  if (!slug || !body.titleEn) {
    return NextResponse.json(
      { error: "slug and titleEn are required" },
      { status: 400 },
    );
  }

  const dest = body.destinationSlug
    ? await prisma.destination.findUnique({
        where: { slug: String(body.destinationSlug) },
        select: { id: true },
      })
    : null;

  const title = {
    en: String(body.titleEn),
    ta: String(body.titleTa || body.titleEn),
    hi: String(body.titleHi || body.titleEn),
  };
  const blurb = {
    en: String(body.blurbEn || ""),
    ta: String(body.blurbTa || body.blurbEn || ""),
    hi: String(body.blurbHi || body.blurbEn || ""),
  };
  const bodyLoc = {
    en: String(body.bodyEn || ""),
    ta: String(body.bodyTa || body.bodyEn || ""),
    hi: String(body.bodyHi || body.bodyEn || ""),
  };
  const highlights = {
    en: Array.isArray(body.highlightsEn) ? body.highlightsEn : [],
    ta: Array.isArray(body.highlightsTa)
      ? body.highlightsTa
      : body.highlightsEn || [],
    hi: Array.isArray(body.highlightsHi)
      ? body.highlightsHi
      : body.highlightsEn || [],
  };

  const details = body.detailsJson
    ? typeof body.detailsJson === "string"
      ? JSON.parse(body.detailsJson)
      : body.detailsJson
    : {
        suitableFor: emptyLoc("Travellers"),
        startingLocation: emptyLoc("As planned after enquiry"),
        destination: emptyLoc(String(body.destinationSlug || "")),
        hotelCategory: emptyLoc("Confirmed after enquiry"),
        transportSummary: emptyLoc("As quoted"),
        mealPlan: emptyLoc("As quoted"),
        pricingAssumptions: emptyList([
          "Enquiry-based pricing unless a published rate is shown",
        ]),
        inclusions: highlights,
        exclusions: emptyList(["Items not in your confirmed quote"]),
        accommodationNote: emptyLoc(
          "Stay category confirmed after enquiry.",
        ),
        transportDetails: emptyList(["Transfers as quoted"]),
        cancellationPolicy: emptyLoc("See /cancellation"),
        paymentTerms: emptyLoc("Shared on confirmation"),
        itinerary: [],
        faqs: [],
      };

  const pricingMode =
    body.pricingMode === "confirmed" ? "confirmed" : "enquiry";
  const priceFrom =
    pricingMode === "enquiry" ? 0 : Number(body.priceFrom) || 0;

  const pkg = await prisma.travelPackage.create({
    data: {
      slug,
      destinationSlug: String(body.destinationSlug || "kodaikanal"),
      destinationId: dest?.id ?? null,
      nights: Number(body.nights) || 1,
      days: Number(body.days) || 2,
      priceFrom,
      currency: "INR",
      image: String(body.image || "/images/travel/d/kodaikanal.jpg"),
      category: String(body.category || "escape"),
      featured: Boolean(body.featured),
      published: body.published !== false,
      pricingMode,
      sortOrder: Number(body.sortOrder) || 0,
      titleJson: JSON.stringify(title),
      blurbJson: JSON.stringify(blurb),
      bodyJson: JSON.stringify(bodyLoc),
      taglineJson: JSON.stringify({
        en: String(body.taglineEn || ""),
        ta: String(body.taglineTa || body.taglineEn || ""),
        hi: String(body.taglineHi || body.taglineEn || ""),
      }),
      highlightsJson: JSON.stringify(highlights),
      sharedInclusionsJson: JSON.stringify(emptyList()),
      tiersJson: JSON.stringify(body.tiers || []),
      groupNoteJson: JSON.stringify({}),
      detailsJson: JSON.stringify(details),
      seoTitleEn: String(body.seoTitleEn || ""),
      seoDescriptionEn: String(body.seoDescriptionEn || ""),
    },
  });

  try {
    await syncPackagesJson();
  } catch {
    // Non-fatal on read-only filesystems
  }
  revalidatePath("/en/packages");
  revalidatePath("/ta/packages");
  revalidatePath("/hi/packages");
  return NextResponse.json({ package: pkg });
}
