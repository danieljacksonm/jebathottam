/**
 * Fill places and blogs that Commons did not cover on the first pass.
 * Still one unique photograph per page, never a repeated URL.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WORLD_DESTINATIONS, placesForDestination } from "./seed-world.mjs";
import { allExpandedPlaces } from "./world-places-expanded.mjs";
import { SEO_ANGLES } from "./seo-angles.mjs";
import { markUsed, photosForPlace } from "./commons-images.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "image-catalog.json");
const catalog = JSON.parse(fs.readFileSync(OUT, "utf8"));
const expanded = allExpandedPlaces();

for (const bucket of Object.values(catalog)) {
  for (const [key, row] of Object.entries(bucket)) {
    if (!row?.url) {
      delete bucket[key];
      continue;
    }
    markUsed(row.url);
  }
}

function simplify(name) {
  return String(name)
    .replace(/[’']/g, "")
    .split(/[&(]/)[0]
    .replace(/safari|viewpoint|walk|slots|zone|area|town|food lanes/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function placesOf(dest) {
  const by = new Map();
  for (const place of [
    ...placesForDestination(dest),
    ...(expanded[dest.slug] ?? []),
  ]) {
    if (!by.has(place.slug)) by.set(place.slug, place);
  }
  return [...by.values()];
}

for (const dest of WORLD_DESTINATIONS) {
  const missing = [];
  for (const place of placesOf(dest)) {
    const placeKey = `${dest.slug}/${place.slug}`;
    const blogSlugs = SEO_ANGLES.map(
      (angle) => `${dest.slug}-${place.slug}-${angle.slug}`,
    ).filter((slug) => !catalog.blogs[slug]);
    if (!catalog.places[placeKey] || blogSlugs.length) {
      missing.push({ place, placeKey, blogSlugs });
    }
  }
  if (!missing.length) continue;

  const needed = missing.reduce(
    (n, row) => n + (catalog.places[row.placeKey] ? 0 : 1) + row.blogSlugs.length,
    0,
  );
  const photos = await photosForPlace(
    dest.nameEn,
    dest.country,
    dest.country,
    Math.min(needed, 200),
  );
  let i = 0;
  const take = () => photos[i++] ?? null;

  for (const row of missing) {
    if (!catalog.places[row.placeKey]) {
      const named = await photosForPlace(
        simplify(row.place.nameEn),
        dest.nameEn,
        dest.country,
        1,
      );
      const photo = named[0] ?? take();
      if (photo?.url) catalog.places[row.placeKey] = photo;
    }
    for (const slug of row.blogSlugs) {
      const photo = take();
      if (!photo) break;
      catalog.blogs[slug] = photo;
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(catalog));
  process.stdout.write(
    `\r${dest.slug}  places ${Object.keys(catalog.places).length}  blogs ${Object.keys(catalog.blogs).length}   `,
  );
}

console.log("\n", {
  destinations: Object.keys(catalog.destinations).length,
  places: Object.keys(catalog.places).length,
  blogs: Object.keys(catalog.blogs).length,
});
