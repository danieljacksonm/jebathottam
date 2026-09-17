/**
 * Validates SEO endpoints when the app is running.
 * Usage: npm run build && npm run start &  npm run seo:validate [baseUrl]
 */
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv[2] || "http://127.0.0.1:3000";

const PATHS = [
  { path: "/robots.txt", host: "ebenezerdigital.com" },
  { path: "/sitemap.xml", host: "ebenezerdigital.com" },
  { path: "/robots.txt", host: "news.ebenezerdigital.info" },
  { path: "/sitemap.xml", host: "journal.ebenezerdigital.info" },
  { path: "/robots.txt", host: "ebenezerdigital.net" },
  { path: "/sitemap.xml", host: "ebenezerdigital.store" },
];

console.log(`\n=== SEO Validate @ ${BASE} ===\n`);

spawnSync(process.execPath, [join(ROOT, "scripts", "seo-audit.mjs")], {
  stdio: "inherit",
  cwd: ROOT,
});

let failed = 0;
for (const item of PATHS) {
  try {
    const res = await fetch(`${BASE}${item.path}`, {
      headers: { Host: item.host },
      signal: AbortSignal.timeout(15000),
      redirect: "manual",
    });
    const ok = res.status === 200;
    if (!ok) failed++;
    console.log(`${ok ? "OK" : "FAIL"} ${item.host}${item.path} → ${res.status}`);
    if (item.path.endsWith("sitemap.xml") && ok) {
      const xml = await res.text();
      const locs = (xml.match(/<loc>/g) || []).length;
      console.log(`     ${locs} URL entries`);
    }
  } catch (e) {
    failed++;
    console.log(`FAIL ${item.host}${item.path} → ${e.message}`);
  }
}

console.log(failed ? `\n${failed} check(s) failed.\n` : "\nAll checks passed.\n");
process.exit(failed ? 1 : 0);
