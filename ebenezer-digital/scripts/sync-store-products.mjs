/**
 * Sync data/store.json digitalProducts from app/products/data.ts
 * Run: npx tsx scripts/sync-store-products.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STORE_PRODUCTS } from "../app/products/data.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const storePath = path.join(root, "data", "store.json");

const raw = fs.existsSync(storePath) ? JSON.parse(fs.readFileSync(storePath, "utf8")) : {};
const now = new Date().toISOString();
const bySlug = new Map((raw.digitalProducts || []).map((p) => [p.slug, p]));

raw.digitalProducts = STORE_PRODUCTS.map((p) => {
  const existing = bySlug.get(p.slug);
  return {
    ...p,
    id: existing?.id || p.id,
    publishedAt: p.publishedAt || now,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    status: p.status || "published",
  };
});

fs.writeFileSync(storePath, JSON.stringify(raw, null, 2));
console.log("Synced", raw.digitalProducts.length, "digital products to data/store.json");
