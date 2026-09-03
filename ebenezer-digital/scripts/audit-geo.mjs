#!/usr/bin/env node
/**
 * AI / GEO + sitemap consistency audit (static — no server required).
 * Usage: npm run audit:geo
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
let failed = 0;

function check(name, ok, detail) {
  if (ok) console.log(`[ok] ${name}`);
  else {
    failed++;
    console.error(`[fail] ${name}${detail ? `: ${detail}` : ""}`);
  }
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

check("llms.txt route", exists("app/llms.txt/route.ts"));
check("HTML sitemap page", exists("app/site-sitemap/page.tsx"));
check("sitemap.xml route", exists("app/sitemap.xml/route.ts"));
check("sitemap chunk route", exists("app/sitemaps/[id]/route.ts"));
check("html-sitemap helper", exists("lib/html-sitemap.ts"));
check("sitemap validate helper", exists("lib/sitemap-validate.ts"));
check("sitemap xml builder", exists("lib/sitemap-xml.ts"));

const siteUrl = read("lib/site-url.ts");
check(
  "canonicalFor uses publicUrlForInternalPath",
  siteUrl.includes("publicUrlForInternalPath(normalized, siteKindFromPath(normalized))")
);
check(
  "articleLanguageAlternates uses publicUrlForInternalPath",
  siteUrl.includes("publicUrlForInternalPath(path, resolvedKind)")
);

const robots = read("app/robots.ts");
check("robots allows /llms.txt", robots.includes('"/llms.txt"'));
check("robots allows /sitemap.html", robots.includes('"/sitemap.html"'));
check("robots references sitemap.xml", robots.includes("sitemap.xml"));
check("robots allows AI crawlers", robots.includes("GPTBot"));

const middleware = read("middleware.ts");
check("middleware rewrites /sitemap.html", middleware.includes('"/sitemap.html"'));
check("middleware matcher includes /sitemap", middleware.includes('"/sitemap"'));

const llms = read("app/llms.txt/route.ts");
check("llms.txt links to sitemap.xml", llms.includes("sitemap.xml"));
check("llms.txt links to sitemap.html", llms.includes("sitemap.html"));

const newsService = read("lib/news-service.ts");
check("news API sitemap uses publicUrlForInternalPath", newsService.includes("publicUrlForInternalPath"));

console.log("\n--- Sitemap hreflang consistency ---");
const tsx = spawnSync("npx", ["tsx", "scripts/audit-sitemap-consistency.mjs"], {
  cwd: root,
  encoding: "utf8",
  shell: true,
});

if (tsx.status !== 0) {
  failed++;
  console.error(tsx.stdout || tsx.stderr || "sitemap consistency script failed");
} else if (tsx.stdout) {
  console.log(tsx.stdout.trim());
}

console.log(failed ? `\n${failed} GEO/sitemap check(s) failed.` : "\nAll GEO/sitemap checks passed.");
process.exit(failed ? 1 : 0);
