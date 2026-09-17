/**
 * Read-only SEO health audit (static + optional live checks).
 * Usage: node scripts/seo-audit.mjs [baseUrl]
 */
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv[2] || "";

const HOSTS = [
  { name: "studio", url: "https://ebenezerdigital.com" },
  { name: "info", url: "https://ebenezerdigital.info" },
  { name: "journal", url: "https://journal.ebenezerdigital.info" },
  { name: "news", url: "https://news.ebenezerdigital.info" },
  { name: "network", url: "https://ebenezerdigital.net" },
  { name: "store", url: "https://ebenezerdigital.store" },
  { name: "tools", url: "https://tools.ebenezerdigital.com" },
  { name: "saas", url: "https://saas.ebenezerdigital.com" },
];

function read(path) {
  try {
    return readFileSync(join(ROOT, path), "utf8");
  } catch {
    return "";
  }
}

console.log("\n=== Ebenezer SEO Audit (static) ===\n");

const checks = [];

// Env example
const envEx = read(".env.example");
if (envEx.includes("NEXT_PUBLIC_EBEN_I18N_PUBLISHED_LOCALES")) {
  checks.push({ ok: true, msg: "i18n publish env documented in .env.example" });
} else {
  checks.push({ ok: false, msg: "Missing NEXT_PUBLIC_EBEN_I18N_PUBLISHED_LOCALES in .env.example" });
}

// Prisma LocalizedContent
const schema = read("prisma/schema.prisma");
checks.push({
  ok: schema.includes("model LocalizedContent"),
  msg: "LocalizedContent model in Prisma schema",
});

// Architecture doc
checks.push({
  ok: existsSync(join(ROOT, "docs/ARCHITECTURE-REPORT.md")),
  msg: "docs/ARCHITECTURE-REPORT.md present",
});

// Journal images module
checks.push({
  ok: existsSync(join(ROOT, "lib/journal-images.ts")),
  msg: "lib/journal-images.ts present",
});

for (const c of checks) {
  console.log(`${c.ok ? "OK" : "WARN"} — ${c.msg}`);
}

if (BASE) {
  console.log(`\n=== Live checks @ ${BASE} ===\n`);
  for (const host of HOSTS.slice(0, 3)) {
    try {
      const res = await fetch(`${host.url}/robots.txt`, {
        signal: AbortSignal.timeout(8000),
      });
      console.log(`${host.name} robots.txt: ${res.status}`);
    } catch (e) {
      console.log(`${host.name} robots.txt: FAIL (${e.message})`);
    }
  }
}

console.log("\nDone. Run npm run seo:validate with server up for full HTTP checks.\n");
