import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import {
  WORLD_DESTINATIONS,
  REGION_IMAGES,
  blogTemplates,
  placesForDestination,
  placeBlogTemplate,
} from "./seed-world.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const BLOG_JSON = path.join(__dirname, "../content/db/blogs.json");

function copyEn(text) {
  return text;
}

function tagsJson(tags) {
  return JSON.stringify(tags);
}

function bodyJson(paragraphs) {
  return JSON.stringify(paragraphs);
}

async function upsertDestination(dest) {
  const image =
    dest.image ??
    REGION_IMAGES[dest.region] ??
    REGION_IMAGES.asia;
  const places = placesForDestination(dest);

  const row = await prisma.destination.upsert({
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

  for (const [i, place] of places.entries()) {
    await prisma.touristPlace.upsert({
      where: {
        destinationId_slug: {
          destinationId: row.id,
          slug: place.slug,
        },
      },
      create: {
        destinationId: row.id,
        slug: place.slug,
        nameEn: place.nameEn,
        nameTa: copyEn(place.nameEn),
        nameHi: copyEn(place.nameEn),
        summaryEn: place.summaryEn,
        summaryTa: copyEn(place.summaryEn),
        summaryHi: copyEn(place.summaryEn),
        sortOrder: i,
      },
      update: {
        nameEn: place.nameEn,
        summaryEn: place.summaryEn,
        sortOrder: i,
      },
    });
  }

  return { ...row, places };
}

async function upsertBlogFromLegacy(row, destinationId, imageFallback) {
  const tagsEn = row.tags?.en ?? row.tags ?? [];
  const bodyEn = row.body?.en ?? row.body ?? [];
  await prisma.blogPost.upsert({
    where: { slug: row.slug },
    create: {
      slug: row.slug,
      destinationId,
      date: row.date,
      readMinutes: row.readMinutes,
      image: row.image || imageFallback,
      tagsEn: tagsJson(tagsEn),
      tagsTa: tagsJson(row.tags?.ta ?? tagsEn),
      tagsHi: tagsJson(row.tags?.hi ?? tagsEn),
      titleEn: row.title?.en ?? row.title ?? "",
      titleTa: row.title?.ta ?? row.title?.en ?? "",
      titleHi: row.title?.hi ?? row.title?.en ?? "",
      excerptEn: row.excerpt?.en ?? row.excerpt ?? "",
      excerptTa: row.excerpt?.ta ?? row.excerpt?.en ?? "",
      excerptHi: row.excerpt?.hi ?? row.excerpt?.en ?? "",
      bodyEn: bodyJson(bodyEn),
      bodyTa: bodyJson(row.body?.ta ?? bodyEn),
      bodyHi: bodyJson(row.body?.hi ?? bodyEn),
    },
    update: {
      destinationId,
      date: row.date,
      readMinutes: row.readMinutes,
      image: row.image || imageFallback,
    },
  });
}

async function upsertGeneratedBlog(template, destinationId, image) {
  await prisma.blogPost.upsert({
    where: { slug: template.slug },
    create: {
      slug: template.slug,
      destinationId,
      date: new Date().toISOString().slice(0, 10),
      readMinutes: template.readMinutes,
      image,
      tagsEn: tagsJson(template.tagsEn),
      tagsTa: tagsJson(template.tagsEn),
      tagsHi: tagsJson(template.tagsEn),
      titleEn: template.titleEn,
      titleTa: copyEn(template.titleEn),
      titleHi: copyEn(template.titleEn),
      excerptEn: template.excerptEn,
      excerptTa: copyEn(template.excerptEn),
      excerptHi: copyEn(template.excerptEn),
      bodyEn: bodyJson(template.paragraphs),
      bodyTa: bodyJson(template.paragraphs),
      bodyHi: bodyJson(template.paragraphs),
    },
    update: {
      destinationId,
      readMinutes: template.readMinutes,
      image,
    },
  });
}

async function main() {
  console.log("Seeding destinations…");
  const destBySlug = new Map();
  for (const dest of WORLD_DESTINATIONS) {
    const row = await upsertDestination(dest);
    destBySlug.set(dest.slug, row);
  }

  let legacyImported = 0;
  if (fs.existsSync(BLOG_JSON)) {
    console.log("Importing legacy blogs.json…");
    const table = JSON.parse(fs.readFileSync(BLOG_JSON, "utf8"));
    for (const row of table.rows ?? []) {
      const destSlug =
        row.destination ??
        ( /kodai|kodaikanal|coaker|berijam|bryant|pillar|poombarai|mannavanur|vattakanal|kurinji|dolphin|silver|pambar|moir|fairy|lake|pine/i.test(
          `${row.slug} ${row.id} ${row.title?.en ?? ""}`,
        )
          ? "kodaikanal"
          : null);
      const dest = destSlug ? destBySlug.get(destSlug) : null;
      await upsertBlogFromLegacy(
        row,
        dest?.id ?? null,
        dest?.image ?? REGION_IMAGES.asia,
      );
      legacyImported++;
    }
  }

  let generated = 0;
  let placeBlogs = 0;
  for (const dest of WORLD_DESTINATIONS) {
    const row = destBySlug.get(dest.slug);
    const places = placesForDestination(dest);

    for (const template of blogTemplates({ ...dest, places })) {
      const found = await prisma.blogPost.findUnique({
        where: { slug: template.slug },
      });
      if (found) continue;
      await upsertGeneratedBlog(template, row.id, row.image);
      generated++;
    }

    for (const place of places) {
      const template = placeBlogTemplate(dest, place);
      const found = await prisma.blogPost.findUnique({
        where: { slug: template.slug },
      });
      if (found) continue;
      await upsertGeneratedBlog(template, row.id, row.image);
      placeBlogs++;
    }
  }

  const [destCount, blogCount, placeCount] = await Promise.all([
    prisma.destination.count(),
    prisma.blogPost.count(),
    prisma.touristPlace.count(),
  ]);

  console.log(`Destinations: ${destCount}`);
  console.log(`Tourist places: ${placeCount}`);
  console.log(
    `Blog posts: ${blogCount} (legacy: ${legacyImported}, destination guides: ${generated}, place guides: ${placeBlogs})`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
