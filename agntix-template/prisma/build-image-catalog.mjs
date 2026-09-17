/**
 * Assign a unique Wikimedia photo to every destination, place, and place blog.
 * Run: node prisma/build-image-catalog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WORLD_DESTINATIONS, placesForDestination } from "./seed-world.mjs";
import { allExpandedPlaces } from "./world-places-expanded.mjs";
import { SEO_ANGLES } from "./seo-angles.mjs";
import { photosForPlace, markUsed } from "./commons-images.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "image-catalog.json");
const expanded = allExpandedPlaces();

function mergePlaces(dest) {
  const bySlug = new Map();
  for (const place of [...placesForDestination(dest), ...(expanded[dest.slug] ?? [])]) {
    if (!bySlug.has(place.slug)) bySlug.set(place.slug, place);
  }
  return [...bySlug.values()];
}

const catalog = fs.existsSync(OUT)
  ? JSON.parse(fs.readFileSync(OUT, "utf8"))
  : { destinations: {}, places: {}, blogs: {} };

for (const bucket of Object.values(catalog)) {
  for (const row of Object.values(bucket)) markUsed(row.url);
}

let donePlaces = 0;
for (const dest of WORLD_DESTINATIONS) {
  const places = mergePlaces(dest);
  if (!catalog.destinations[dest.slug]) {
    const [hero] = await photosForPlace(dest.nameEn, dest.country, dest.country, 1);
    if (hero) catalog.destinations[dest.slug] = hero;
  }
  for (const place of places) {
    const placeKey = `${dest.slug}/${place.slug}`;
    const blogSlugs = SEO_ANGLES.map(
      (angle) => `${dest.slug}-${place.slug}-${angle.slug}`,
    );
    const missingBlogs = blogSlugs.filter((slug) => !catalog.blogs[slug]);
    if (catalog.places[placeKey] && missingBlogs.length === 0) {
      donePlaces += 1;
      continue;
    }
    const needed = (catalog.places[placeKey] ? 0 : 1) + missingBlogs.length;
    const photos = await photosForPlace(
      place.nameEn,
      dest.nameEn,
      dest.country,
      needed,
    );
    let i = 0;
    if (!catalog.places[placeKey] && photos[i]) {
      catalog.places[placeKey] = photos[i];
      i += 1;
    }
    for (const slug of missingBlogs) {
      if (!photos[i]) break;
      catalog.blogs[slug] = photos[i];
      i += 1;
    }
    donePlaces += 1;
    fs.writeFileSync(OUT, JSON.stringify(catalog));
    process.stdout.write(
      `\rPlaces ${donePlaces}  blogs ${Object.keys(catalog.blogs).length}   `,
    );
  }
}

const summary = {
  destinations: Object.keys(catalog.destinations).length,
  places: Object.keys(catalog.places).length,
  blogs: Object.keys(catalog.blogs).length,
};
console.log("\n", summary);
fs.writeFileSync(OUT, JSON.stringify(catalog));
