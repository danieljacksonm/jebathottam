/**
 * Sync packages.json + package-details into Prisma TravelPackage.
 * Usage: npx tsx prisma/sync-packages.ts
 */
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { packageDetails } from "../src/data/package-details";

const root = process.cwd();
const prisma = new PrismaClient();
const table = JSON.parse(
  fs.readFileSync(path.join(root, "content/db/packages.json"), "utf8"),
);

async function main() {
  const destRows = await prisma.destination.findMany({
    select: { id: true, slug: true },
  });
  const destBySlug = new Map(destRows.map((d) => [d.slug, d.id]));

  // Also dump details for tooling
  fs.writeFileSync(
    path.join(root, "content/db/package-details.json"),
    JSON.stringify(packageDetails, null, 2) + "\n",
  );

  let n = 0;
  for (const [index, row] of table.rows.entries()) {
    const details = packageDetails[row.id];
    if (!details) {
      console.warn("Missing details for", row.id, "— skipping");
      continue;
    }
    await prisma.travelPackage.upsert({
      where: { slug: row.id },
      create: {
        slug: row.id,
        destinationSlug: row.destinationSlug,
        destinationId: destBySlug.get(row.destinationSlug) ?? null,
        nights: row.nights,
        days: row.days,
        priceFrom: row.priceFrom ?? 0,
        currency: row.currency || "INR",
        image: row.image,
        category: row.category || "escape",
        featured: Boolean(row.featured),
        published: row.published !== false,
        pricingMode:
          row.pricingMode || (row.priceFrom > 0 ? "confirmed" : "enquiry"),
        sortOrder: index,
        titleJson: JSON.stringify(row.title),
        blurbJson: JSON.stringify(row.blurb),
        bodyJson: JSON.stringify(row.body),
        taglineJson: JSON.stringify(row.tagline || {}),
        highlightsJson: JSON.stringify(row.highlights),
        sharedInclusionsJson: JSON.stringify(row.sharedInclusions || {}),
        tiersJson: JSON.stringify(row.tiers || []),
        groupNoteJson: JSON.stringify(row.groupNote || {}),
        detailsJson: JSON.stringify(details),
      },
      update: {
        destinationSlug: row.destinationSlug,
        destinationId: destBySlug.get(row.destinationSlug) ?? null,
        nights: row.nights,
        days: row.days,
        priceFrom: row.priceFrom ?? 0,
        currency: row.currency || "INR",
        image: row.image,
        category: row.category || "escape",
        featured: Boolean(row.featured),
        published: row.published !== false,
        pricingMode:
          row.pricingMode || (row.priceFrom > 0 ? "confirmed" : "enquiry"),
        sortOrder: index,
        titleJson: JSON.stringify(row.title),
        blurbJson: JSON.stringify(row.blurb),
        bodyJson: JSON.stringify(row.body),
        taglineJson: JSON.stringify(row.tagline || {}),
        highlightsJson: JSON.stringify(row.highlights),
        sharedInclusionsJson: JSON.stringify(row.sharedInclusions || {}),
        tiersJson: JSON.stringify(row.tiers || []),
        groupNoteJson: JSON.stringify(row.groupNote || {}),
        detailsJson: JSON.stringify(details),
      },
    });
    n += 1;
  }
  console.log(`Synced ${n} packages`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
