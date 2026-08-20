/**
 * Add manufacturer/model identifiers to seed products (MPN = model, SKU = id).
 * Does not invent GTIN/EAN values.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "data", "catalog.json");
const store = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
let n = 0;
for (const p of store.products || []) {
  if (!p.mpn && p.model) {
    p.mpn = String(p.model);
    n++;
  }
  if (!p.sku) {
    p.sku = p.id;
    n++;
  }
}
fs.writeFileSync(catalogPath, JSON.stringify(store, null, 2));
console.log("Identifier fields touched:", n);
