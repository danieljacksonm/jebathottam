/**
 * Seed worldwide destinations, tourist places, and 50 SEO blogs per place.
 * Run: node prisma/seed.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import {
  WORLD_DESTINATIONS,
  REGION_IMAGES,
  placesForDestination,
} from "./seed-world.mjs";
import { allExpandedPlaces } from "./world-places-expanded.mjs";
import { SEO_ANGLES, paragraphsForAngle } from "./seo-angles.mjs";
import { uniqueTravelImage, uniquePlaceImage } from "./travel-images.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const BLOG_JSON = path.join(__dirname, "../content/db/blogs.json");
const expanded = allExpandedPlaces();

function copyEn(text) {
  return text ?? "";
}

function tagsJson(tags) {
  return JSON.stringify(tags);
}

function bodyJson(paragraphs) {
  return JSON.stringify(paragraphs);
}

function mergePlaces(dest) {
  const base = placesForDestination(dest);
  const extra = expanded[dest.slug] ?? [];
  const bySlug = new Map();
  for (const place of [...base, ...extra]) {
    if (!bySlug.has(place.slug)) bySlug.set(place.slug, place);
  }
  // Ensure every destination has at least 4 places for catalogue density
  if (bySlug.size < 4) {
    const fillers = [
      {
        slug: `${dest.slug}-old-town`,
        nameEn: `${dest.nameEn} Old Town`,
        summaryEn: `Historic streets and local life at the heart of ${dest.nameEn}.`,
        detailEn: `Wander the older quarters of ${dest.nameEn} for cafés, markets, and orientation before longer day trips.`,
        bestTimeEn: "Morning or evening for cooler, calmer walks.",
      },
      {
        slug: `${dest.slug}-viewpoint`,
        nameEn: `${dest.nameEn} Viewpoint`,
        summaryEn: `A classic elevated outlook over ${dest.nameEn}.`,
        detailEn: `Viewpoints reward clear weather. Carry water and avoid unsafe edges for photos.`,
        bestTimeEn: "Sunrise or late afternoon when skies allow.",
      },
      {
        slug: `${dest.slug}-cultural-site`,
        nameEn: `${dest.nameEn} Cultural Site`,
        summaryEn: `A principal cultural or heritage stop visitors associate with ${dest.nameEn}.`,
        detailEn: `Dress respectfully, follow photography rules, and allow unhurried time inside.`,
        bestTimeEn: "Opening hours on weekdays are often quieter.",
      },
      {
        slug: `${dest.slug}-food-street`,
        nameEn: `${dest.nameEn} Food Street`,
        summaryEn: `Local flavours near the visitor core of ${dest.nameEn}.`,
        detailEn: `Choose busy stalls, wash hands, and keep meals proportional to the walking still ahead.`,
        bestTimeEn: "Lunch or early dinner.",
      },
    ];
    for (const place of fillers) {
      if (!bySlug.has(place.slug)) bySlug.set(place.slug, place);
    }
  }
  return [...bySlug.values()];
}

async function upsertDestination(dest) {
  const image =
    dest.image ?? REGION_IMAGES[dest.region] ?? REGION_IMAGES.asia;

  return prisma.destination.upsert({
    where: { slug: dest.slug },
    create: {
      slug: dest.slug,
      nameEn: dest.nameEn,
      nameTa: copyEn(dest.nameEn),
      nameHi: copyEn(dest.nameEn),
      country: dest.country,
      continent: dest.continent,
      region: dest.region,
      taglineEn: dest.taglineEn,
      taglineTa: copyEn(dest.taglineEn),
      taglineHi: copyEn(dest.taglineEn),
      bodyEn: dest.bodyEn,
      bodyTa: copyEn(dest.bodyEn),
      bodyHi: copyEn(dest.bodyEn),
      image,
      status: dest.status ?? "enquiry",
      featured: dest.featured ?? false,
      priceFrom: dest.priceFrom ?? null,
      sortOrder: dest.sortOrder ?? 0,
    },
    update: {
      nameEn: dest.nameEn,
      country: dest.country,
      continent: dest.continent,
      region: dest.region,
      taglineEn: dest.taglineEn,
      bodyEn: dest.bodyEn,
      image,
      status: dest.status ?? "enquiry",
      featured: dest.featured ?? false,
      priceFrom: dest.priceFrom ?? null,
      sortOrder: dest.sortOrder ?? 0,
    },
  });
}

async function upsertPlace(destRow, dest, place, sortOrder) {
  const detail =
    place.detailEn ??
    `${place.nameEn} is a visitor highlight in ${dest.nameEn}, ${dest.country}. ${place.summaryEn} Plan unhurried time, confirm local rules, and enquire with Canaan for custom routing.`;
  const bestTime =
    place.bestTimeEn ??
    `Choose seasons that match your comfort for ${dest.nameEn}; shoulder weeks often balance weather and crowds.`;
  const image = uniquePlaceImage(dest.slug, place.slug, place.nameEn);

  return prisma.touristPlace.upsert({
    where: {
      destinationId_slug: {
        destinationId: destRow.id,
        slug: place.slug,
      },
    },
    create: {
      destinationId: destRow.id,
      slug: place.slug,
      nameEn: place.nameEn,
      nameTa: copyEn(place.nameEn),
      nameHi: copyEn(place.nameEn),
      summaryEn: place.summaryEn,
      summaryTa: copyEn(place.summaryEn),
      summaryHi: copyEn(place.summaryEn),
      detailEn: detail,
      detailTa: copyEn(detail),
      detailHi: copyEn(detail),
      bestTimeEn: bestTime,
      bestTimeTa: copyEn(bestTime),
      bestTimeHi: copyEn(bestTime),
      image,
      sortOrder,
    },
    update: {
      nameEn: place.nameEn,
      summaryEn: place.summaryEn,
      detailEn: detail,
      bestTimeEn: bestTime,
      image,
      sortOrder,
    },
  });
}

function buildPlaceBlog(dest, placeRow, place, angle, dayOffset) {
  const title = angle.title(place.nameEn, dest.nameEn);
  const excerpt = angle.excerpt(place.nameEn, dest.nameEn);
  const paragraphs = paragraphsForAngle(angle, place, dest);
  const slug = `${dest.slug}-${place.slug}-${angle.slug}`;
  const image = uniqueTravelImage(slug, place.nameEn);
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - (dayOffset % 800));
  const dateStr = date.toISOString().slice(0, 10);
  const tags = [dest.nameEn, place.nameEn, ...angle.tags].slice(0, 5);

  return {
    slug,
    destinationId: placeRow.destinationId,
    placeId: placeRow.id,
    date: dateStr,
    readMinutes: angle.minutes,
    image,
    tagsEn: tagsJson(tags),
    tagsTa: tagsJson(tags),
    tagsHi: tagsJson(tags),
    titleEn: title,
    titleTa: title,
    titleHi: title,
    excerptEn: excerpt,
    excerptTa: excerpt,
    excerptHi: excerpt,
    bodyEn: bodyJson(paragraphs),
    bodyTa: bodyJson(paragraphs),
    bodyHi: bodyJson(paragraphs),
  };
}

async function importLegacyBlogs(destBySlug) {
  if (!fs.existsSync(BLOG_JSON)) return 0;
  const table = JSON.parse(fs.readFileSync(BLOG_JSON, "utf8"));
  let n = 0;
  for (const row of table.rows ?? []) {
    const destSlug =
      row.destination ??
      (/kodai|kodaikanal|coaker|berijam|bryant|pillar|poombarai|mannavanur|vattakanal|kurinji|dolphin|silver|pambar|moir|fairy|lake|pine/i.test(
        `${row.slug} ${row.id} ${row.title?.en ?? ""}`,
      )
        ? "kodaikanal"
        : null);
    const dest = destSlug ? destBySlug.get(destSlug) : null;
    const tagsEn = row.tags?.en ?? [];
    const bodyEn = row.body?.en ?? [];
    await prisma.blogPost.upsert({
      where: { slug: row.slug },
      create: {
        slug: row.slug,
        destinationId: dest?.id ?? null,
        date: row.date,
        readMinutes: row.readMinutes,
        image: row.image || dest?.image || REGION_IMAGES.asia,
        tagsEn: tagsJson(tagsEn),
        tagsTa: tagsJson(row.tags?.ta ?? tagsEn),
        tagsHi: tagsJson(row.tags?.hi ?? tagsEn),
        titleEn: row.title?.en ?? "",
        titleTa: row.title?.ta ?? row.title?.en ?? "",
        titleHi: row.title?.hi ?? row.title?.en ?? "",
        excerptEn: row.excerpt?.en ?? "",
        excerptTa: row.excerpt?.ta ?? row.excerpt?.en ?? "",
        excerptHi: row.excerpt?.hi ?? row.excerpt?.en ?? "",
        bodyEn: bodyJson(bodyEn),
        bodyTa: bodyJson(row.body?.ta ?? bodyEn),
        bodyHi: bodyJson(row.body?.hi ?? bodyEn),
      },
      update: {
        destinationId: dest?.id ?? null,
        date: row.date,
        readMinutes: row.readMinutes,
        image: row.image || dest?.image || REGION_IMAGES.asia,
      },
    });
    n++;
  }
  return n;
}

async function main() {
  console.log("Seeding destinations…");
  const destBySlug = new Map();
  for (const dest of WORLD_DESTINATIONS) {
    destBySlug.set(dest.slug, await upsertDestination(dest));
  }

  console.log("Seeding tourist places…");
  let placeCount = 0;
  const placeRows = [];
  for (const dest of WORLD_DESTINATIONS) {
    const destRow = destBySlug.get(dest.slug);
    const places = mergePlaces(dest);
    for (const [i, place] of places.entries()) {
      const row = await upsertPlace(destRow, dest, place, i);
      placeRows.push({ dest, place, row });
      placeCount++;
    }
  }
  console.log(`Places upserted: ${placeCount}`);

  console.log("Importing legacy blogs.json (if present)…");
  const legacy = await importLegacyBlogs(destBySlug);
  console.log(`Legacy blogs upserted: ${legacy}`);

  console.log(`Generating ${SEO_ANGLES.length} SEO blogs per place…`);
  let created = 0;
  let skipped = 0;
  const batch = [];
  const existing = new Set(
    (await prisma.blogPost.findMany({ select: { slug: true } })).map(
      (r) => r.slug,
    ),
  );

  let dayOffset = 0;
  for (const { dest, place, row } of placeRows) {
    for (const angle of SEO_ANGLES) {
      const blog = buildPlaceBlog(dest, row, place, angle, dayOffset++);
      if (existing.has(blog.slug)) {
        skipped++;
        continue;
      }
      batch.push(blog);
      existing.add(blog.slug);
      if (batch.length >= 100) {
        await prisma.blogPost.createMany({ data: batch });
        created += batch.length;
        batch.length = 0;
        process.stdout.write(`\rBlogs created: ${created}`);
      }
    }
  }
  if (batch.length) {
    await prisma.blogPost.createMany({ data: batch });
    created += batch.length;
  }
  console.log(`\nNew place blogs created: ${created} (skipped existing: ${skipped})`);

  const [destinations, places, blogs] = await Promise.all([
    prisma.destination.count(),
    prisma.touristPlace.count(),
    prisma.blogPost.count(),
  ]);
  console.log({ destinations, places, blogs });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
