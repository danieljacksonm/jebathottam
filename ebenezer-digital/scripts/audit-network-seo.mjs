/**
 * Audit .net tool registry for SEO completeness.
 * Usage: node scripts/audit-network-seo.mjs
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "lib/network/registry.ts"), "utf8");

const tools = [];
const re = /tool\(\{([\s\S]*?)\}\),/g;
let m;
while ((m = re.exec(src))) {
  const block = m[1];
  const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
  const seoTitle = block.match(/seoTitle:\s*"([^"]+)"/)?.[1];
  const seoDescription = block.match(/seoDescription:\s*\n?\s*"([^"]+)"/)?.[1];
  const faqs = block.includes("faqs:");
  if (slug) tools.push({ slug, seoTitle, seoDescription, faqs });
}

console.log(`\n=== Network tools SEO audit (${tools.length} tools) ===\n`);
let warn = 0;
for (const t of tools) {
  const issues = [];
  if (!t.seoTitle) issues.push("missing seoTitle");
  if (!t.seoDescription) issues.push("missing seoDescription");
  if (!t.faqs) issues.push("missing faqs");
  if (issues.length) {
    warn++;
    console.log(`WARN ${t.slug}: ${issues.join(", ")}`);
  }
}
if (!warn) console.log("OK — all live tools have seoTitle, seoDescription, and faqs.");
console.log(`\nDone. ${warn} tool(s) need attention.\n`);
