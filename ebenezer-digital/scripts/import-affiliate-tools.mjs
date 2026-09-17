/**
 * Import affiliate software entries from CSV/JSON (does not auto-publish).
 * Usage: node scripts/import-affiliate-tools.mjs path/to/tools.json
 *
 * JSON shape: [{ "id", "name", "category", "tagline", "url", "affiliateUrl", "pricing", "lastVerified" }]
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data", "affiliate-import-pending.json");

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/import-affiliate-tools.mjs <file.json|file.csv>");
  process.exit(1);
}

const raw = readFileSync(input, "utf8");
let items = [];
if (input.endsWith(".json")) {
  items = JSON.parse(raw);
} else {
  console.error("CSV import: convert to JSON first. Only .json supported in this script.");
  process.exit(1);
}

const normalized = items.map((row, i) => ({
  id: String(row.id || row.slug || `import-${i}`).trim(),
  name: String(row.name || "").trim(),
  category: String(row.category || "software").trim(),
  tagline: String(row.tagline || row.description || "").trim(),
  url: String(row.url || row.website || "").trim(),
  affiliateUrl: String(row.affiliateUrl || row.url || "").trim(),
  pricing: String(row.pricing || "See official site").trim(),
  lastVerified: String(row.lastVerified || new Date().toISOString().slice(0, 10)),
  status: "pending_review",
}));

writeFileSync(OUT, JSON.stringify({ importedAt: new Date().toISOString(), items: normalized }, null, 2));
console.log(`Wrote ${normalized.length} pending entries to data/affiliate-import-pending.json`);
console.log("Review in admin before merging into app/tools/discovery-tools.ts");
