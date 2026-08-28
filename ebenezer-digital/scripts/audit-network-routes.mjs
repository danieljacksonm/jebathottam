/**
 * Network route audit — all live tools + hub pages.
 * Usage: node scripts/audit-network-routes.mjs [baseUrl]
 * Default baseUrl: http://127.0.0.1:3000
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const BASE = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadToolSlugs() {
  const raw = readFileSync(join(ROOT, "lib/network/registry.ts"), "utf8");
  return [...new Set([...raw.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]))];
}

const HUB_ROUTES = [
  "/network",
  "/network/tools",
  "/network/tools/c/developer",
  "/network/tools/c/seo",
  "/network/tools/c/image",
  "/network/tools/c/text",
  "/network/tools/c/calculators",
  "/network/tools/c/business",
  "/network/tools/c/ai",
  "/network/developers",
  "/network/resources",
  "/network/guides",
  "/network/guides/what-is-json",
  "/network/finder",
  "/network/about",
  "/network/contact",
  "/network/privacy",
  "/network/terms",
  "/network/affiliate-disclosure",
  "/network/this-page-should-404-xyz",
];

const TOOL_ROUTES = loadToolSlugs().map((slug) => `/network/tools/${slug}`);
const ROUTES = [...HUB_ROUTES.slice(0, -1), ...TOOL_ROUTES, HUB_ROUTES.at(-1)];

async function check(path) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { Accept: "text/html" },
    });
    const text = await res.text();
    const title = (text.match(/<title[^>]*>([^<]*)<\/title>/i) || [, ""])[1].trim();
    const expect404 = path.includes("should-404");
    const ok = expect404
      ? res.status === 404 || /doesn.?t exist|not found|couldn.?t find/i.test(text)
      : res.status === 200 && text.length > 200 && !/Application error|Unhandled/i.test(text);
    return {
      path,
      status: res.status,
      title: title.slice(0, 80),
      ok,
      bytes: text.length,
    };
  } catch (e) {
    return { path, status: 0, title: "", ok: false, error: String(e.message || e), bytes: 0 };
  }
}

async function main() {
  console.log(`Auditing ${ROUTES.length} routes (${TOOL_ROUTES.length} tools) against ${BASE}\n`);
  const results = [];
  for (const r of ROUTES) {
    const row = await check(r);
    results.push(row);
    if (!row.ok) {
      console.log(`[BROKEN] ${row.status} ${row.path} — ${row.title || row.error || ""}`);
    }
  }
  const working = results.filter((r) => r.ok).length;
  const broken = results.filter((r) => !r.ok);
  console.log("\n========== SUMMARY ==========");
  console.log(`TOTAL:   ${results.length}`);
  console.log(`WORKING: ${working}`);
  console.log(`BROKEN:  ${broken.length}`);
  if (broken.length) {
    console.log("\nBroken routes:");
    for (const b of broken) {
      console.log(`  ${b.status} ${b.path} ${b.error || b.title || ""}`);
    }
    process.exitCode = 1;
  } else {
    console.log("All routes OK.");
  }
}

main();
