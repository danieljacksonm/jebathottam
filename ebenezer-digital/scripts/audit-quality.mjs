#!/usr/bin/env node
/**
 * Quality regression checks — legal footers, billing URLs, hreflang helper usage.
 * Usage: npm run audit:quality
 */
import fs from "fs";
import path from "path";

const root = path.join(process.cwd());
let failed = 0;

function check(name, ok, detail) {
  if (ok) {
    console.log(`[ok] ${name}`);
  } else {
    failed++;
    console.error(`[fail] ${name}${detail ? `: ${detail}` : ""}`);
  }
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function fileExists(rel) {
  return fs.existsSync(path.join(root, rel));
}

// SiteLegalLinks on subdomain footers
const legalTargets = [
  "app/blog/BlogIndexClient.tsx",
  "app/blog/news/components/NewsHome.tsx",
  "app/saas/page.tsx",
  "app/discover/DiscoverClient.tsx",
  "app/tools/page.tsx",
  "app/products/page.tsx",
  "components/network/NetworkShell.tsx",
  "app/catalog/page.tsx",
];
for (const f of legalTargets) {
  check(`SiteLegalLinks in ${f}`, read(f).includes("SiteLegalLinks"));
}

// No /saas fallback without /login on store flows
const productsData = read("app/products/data.ts");
check("Store SaaS product uses /saas/login", productsData.includes('externalUrl: "/saas/login"'));
const successPage = read("app/products/success/page.tsx");
check("Success page SaaS fallback is /saas/login", !successPage.includes('"/saas"') || successPage.includes('"/saas/login"'));

// Hreflang uses public paths
const siteUrl = read("lib/site-url.ts");
check("pageMetadata uses languageAlternatesForPath", siteUrl.includes("languageAlternatesForPath(path, origin, kind)"));
check("articleLanguageAlternates helper exists", siteUrl.includes("articleLanguageAlternates"));

// News pinned wired
check("Admin news has pinned field", read("app/admin/(panel)/news/page.tsx").includes("pinned"));
check("News API saves pinned", read("app/api/admin/news/route.ts").includes("pinned: Boolean"));

// Content pipeline
check("Anthropic content generator", fileExists("lib/content-engine/anthropic.ts"));
check("Generate content script", read("scripts/generate-content.mjs").includes("--provider=anthropic"));

// Tools guides indexable
// Forbidden external domains in source (portfolio CMS data excluded)
const FORBIDDEN = ["canaantravelhub.com", "canaan.yegova.store"];
for (const f of FORBIDDEN) {
  let hit = false;
  for (const rel of [
    "app/saas/SaasHeader.tsx",
    "app/saas/page.tsx",
    "lib/site-nav.ts",
    "lib/ecosystem-urls.ts",
  ]) {
    const text = read(rel);
    if (text.includes(f) && !rel.includes("ecosystem-urls")) hit = true;
  }
  check(`No hardcoded ${f} in nav components`, !hit);
}
check("Ecosystem URL sanitizer exists", read("lib/ecosystem-urls.ts").includes("resolveEcosystemUrl"));
check("STUDIO_HOME_URL is canonical", read("lib/site-nav.ts").includes("STUDIO_HOME_URL"));
check("llms.txt route", fileExists("app/llms.txt/route.ts"));
check("Brand tokens shared config", fileExists("lib/brand-tokens.ts"));

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll quality checks passed.");
process.exit(failed ? 1 : 0);
