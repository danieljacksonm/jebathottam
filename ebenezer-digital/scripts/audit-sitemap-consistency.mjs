/**
 * Validates generated sitemap entries: `<loc>` must match hreflang `en`.
 * Imported by audit-geo.mjs via tsx.
 */
import { sitemapForKind } from "../lib/site-sitemaps.ts";
import { validateSitemap } from "../lib/sitemap-validate.ts";

const kinds = [
  "studio",
  "info",
  "journal",
  "news",
  "store",
  "products",
  "tools",
  "ai",
  "saas",
  "discover",
  "network",
];

let totalErrors = 0;

for (const kind of kinds) {
  const entries = await sitemapForKind(kind);
  const { ok, errors } = validateSitemap(entries);
  if (ok) {
    console.log(`[ok] ${kind} sitemap (${entries.length} URLs)`);
  } else {
    totalErrors += errors.length;
    console.error(`[fail] ${kind} sitemap — ${errors.length} error(s)`);
    for (const e of errors.slice(0, 5)) console.error(`  • ${e}`);
    if (errors.length > 5) console.error(`  • … and ${errors.length - 5} more`);
  }
}

if (totalErrors) process.exit(1);
