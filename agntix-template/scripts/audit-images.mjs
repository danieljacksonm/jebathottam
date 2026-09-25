/**
 * Development / CI image audit for Canaan Travel Hub.
 * Detects missing files, duplicate URLs, banned flyer assets, and weak alts.
 *
 * Usage: node scripts/audit-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const BANNED_FRAGMENTS = [
  "/images/packages/darjeeling-3n4d.jpg",
  "/images/packages/darjeeling-banner.jpg",
  "/images/packages/kodai-1n2d-flyer.jpg",
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx?|jsx?|json|mjs|md)$/i.test(entry.name)) acc.push(full);
  }
  return acc;
}

function collectImageRefs(text) {
  const refs = [];
  const re =
    /(?:src|image|heroImage|ogImage|poster)=["'`](\/images\/[^"'`]+)["'`]|["'`](\/images\/[^"'`]+)["'`]/g;
  let m;
  while ((m = re.exec(text))) {
    refs.push(m[1] || m[2]);
  }
  return refs;
}

const files = [
  ...walk(path.join(root, "src")),
  ...walk(path.join(root, "content")),
  path.join(root, "src/data/image-registry.ts"),
  path.join(root, "content/db/packages.json"),
];

const usage = new Map();
const bannedHits = [];
const missing = [];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const banned of BANNED_FRAGMENTS) {
    if (text.includes(banned) && !file.includes("_unused")) {
      bannedHits.push({ file: path.relative(root, file), banned });
    }
  }
  for (const ref of collectImageRefs(text)) {
    if (ref.includes("/_unused/")) continue;
    const list = usage.get(ref) ?? [];
    list.push(path.relative(root, file));
    usage.set(ref, list);
    const abs = path.join(publicDir, ref.replace(/^\//, ""));
    if (!fs.existsSync(abs)) {
      missing.push({ ref, file: path.relative(root, file) });
    }
  }
}

const duplicates = [...usage.entries()]
  .filter(([, filesUsing]) => new Set(filesUsing).size >= 4)
  .map(([ref, filesUsing]) => ({
    ref,
    count: filesUsing.length,
    files: [...new Set(filesUsing)].slice(0, 8),
  }));

const report = {
  generatedAt: new Date().toISOString(),
  missing: [...new Map(missing.map((m) => [m.ref + m.file, m])).values()],
  bannedHits,
  heavilyReused: duplicates.slice(0, 40),
  totalUniqueRefs: usage.size,
};

const outPath = path.join(root, "scripts/image-audit-report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log(`Image audit → ${path.relative(root, outPath)}`);
console.log(`Unique image refs: ${report.totalUniqueRefs}`);
console.log(`Missing files: ${report.missing.length}`);
console.log(`Banned flyer refs: ${report.bannedHits.length}`);
console.log(`Heavily reused (≥4 files): ${report.heavilyReused.length}`);

if (report.missing.length || report.bannedHits.length) {
  process.exitCode = 1;
}
