/**
 * Write unique place photographs from image-catalog.json into SQLite.
 * Run after: node prisma/build-image-catalog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, "image-catalog.json"), "utf8"),
);
const prisma = new PrismaClient();

const destinations = await prisma.destination.findMany({
  select: { id: true, slug: true },
});
for (const dest of destinations) {
  const photo = catalog.destinations[dest.slug];
  if (!photo?.url) continue;
  await prisma.destination.update({
    where: { id: dest.id },
    data: { image: photo.url },
  });
}

const places = await prisma.touristPlace.findMany({
  select: { id: true, slug: true, destination: { select: { slug: true } } },
});
for (const place of places) {
  const photo = catalog.places[`${place.destination.slug}/${place.slug}`];
  if (!photo?.url) continue;
  await prisma.touristPlace.update({
    where: { id: place.id },
    data: { image: photo.url },
  });
}

const blogs = await prisma.blogPost.findMany({
  select: { id: true, slug: true },
});
let updated = 0;
const chunk = [];
for (const blog of blogs) {
  const photo = catalog.blogs[blog.slug];
  if (!photo?.url) continue;
  chunk.push(
    prisma.blogPost.update({
      where: { id: blog.id },
      data: { image: photo.url },
    }),
  );
  if (chunk.length >= 40) {
    await Promise.all(chunk);
    updated += chunk.length;
    chunk.length = 0;
    process.stdout.write(`\rBlogs updated: ${updated}`);
  }
}
if (chunk.length) {
  await Promise.all(chunk);
  updated += chunk.length;
}

let backfilled = 0;
const missing = await prisma.blogPost.findMany({
  where: {
    OR: [
      { image: { startsWith: "/images/kodai/" } },
      { image: { contains: "loremflickr" } },
      { image: "" },
    ],
  },
  select: {
    id: true,
    place: { select: { image: true } },
    destination: { select: { image: true } },
  },
});
const bf = [];
for (const blog of missing) {
  const photo = blog.place?.image || blog.destination?.image;
  if (!photo) continue;
  bf.push(
    prisma.blogPost.update({ where: { id: blog.id }, data: { image: photo } }),
  );
  backfilled++;
  if (bf.length >= 50) {
    await Promise.all(bf);
    bf.length = 0;
  }
}
if (bf.length) await Promise.all(bf);

console.log("\n", {
  destinations: Object.keys(catalog.destinations).length,
  places: Object.keys(catalog.places).length,
  blogsUpdated: updated,
  blogsBackfilledFromPlace: backfilled,
});
await prisma.$disconnect();
