/**
 * Unique place photographs. Prefer the Wikimedia catalog built by
 * prisma/build-image-catalog.mjs (one real photo per page, never reused).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const catalogPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "image-catalog.json",
);

let catalog = null;
function loadCatalog() {
  if (catalog) return catalog;
  if (!fs.existsSync(catalogPath)) return null;
  catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  return catalog;
}

function hashString(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable unique travel image URL for a blog slug. */
export function uniqueTravelImage(key, hint = "travel") {
  const row = loadCatalog()?.blogs?.[key];
  if (row?.url) return row.url;
  const lock = hashString(`canaan:${key}:${hint}`);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Placeholder.svg/1600px-Placeholder.svg?lock=${lock}`;
}

/** Place hero image. */
export function uniquePlaceImage(destinationSlug, placeSlug) {
  const row = loadCatalog()?.places?.[`${destinationSlug}/${placeSlug}`];
  if (row?.url) return row.url;
  return uniqueTravelImage(`${destinationSlug}-${placeSlug}-hero`, placeSlug);
}
