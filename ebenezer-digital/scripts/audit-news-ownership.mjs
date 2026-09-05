/**
 * P0 News ownership / redirect / sitemap architecture checks (static + unit).
 * Run: node scripts/audit-news-ownership.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function check(name, ok) {
  if (ok) console.log(`[ok] ${name}`);
  else {
    failed++;
    console.error(`[fail] ${name}`);
  }
}

const mw = read("middleware.ts");
const newsUrl = read("lib/news-url.ts");
const newsService = read("lib/news-service.ts");
const archive = read("lib/news-sitemap-archive.ts");
const sitemaps = read("lib/site-sitemaps.ts");
const siteNav = read("lib/site-nav.ts");
const articlePage = read("app/blog/news/[slug]/page.tsx");

check("redirects use HTTP 301", mw.includes("return NextResponse.redirect(dest, 301)"));
check("strip tracking params on redirects", mw.includes("stripTrackingParams"));
check("foreign News paths redirect off non-News hosts", mw.includes("foreignSectionRedirect"));
check("News host strips non-en locales", mw.includes('isNewsHost(host) && locale !== "en"'));
check("studio News paths strip /blog/news before redirect", mw.includes('pathname.replace(/^\\/blog\\/news/, "")'));
check("newsPublicUrl / category paths exist", newsUrl.includes("newsPublicPath") && newsUrl.includes("newsPublicUrl"));
check("legacy source-domain slug detection", newsUrl.includes("isLegacySourceDomainSlug"));
check("title-only slugify", newsUrl.includes("slugifyNewsTitle"));
check("legacy slug resolution in news-service", newsService.includes("findArchivedNewsByLegacySlug"));
check("archive excludes www-* from sitemap", archive.includes("isLegacySourceDomainSlug(n.slug)") || archive.includes("if (isLegacySourceDomainSlug"));
check("news sitemap uses newsPublicUrl", sitemaps.includes("newsPublicUrl"));
check("site-nav newsArticleHref uses newsPublicPath", siteNav.includes("newsPublicPath"));
check("article page redirects to category canonical", articlePage.includes("redirect(canonicalPath)"));
check("article OG/canonical use newsPublicUrl", articlePage.includes("newsPublicUrl"));
check("JSON-LD mainEntityOfPage uses canonical", articlePage.includes("mainEntityOfPage"));

// Studio / store / tools sitemaps must not push News article locs
const studioFn = sitemaps.match(/function studioSitemap[\s\S]*?\nfunction /);
check(
  "studio sitemap does not list news articles",
  !studioFn || !studioFn[0].includes("listPublicNewsForSitemap")
);
check(
  "store sitemap does not list news articles",
  !/function storeSitemap[\s\S]*?listPublicNewsForSitemap/.test(sitemaps)
);
check(
  "tools sitemap does not list news articles",
  !/function toolsSitemap[\s\S]*?listPublicNewsForSitemap/.test(sitemaps)
);

console.log(failed ? `\n${failed} news-ownership check(s) failed.` : "\nAll news-ownership checks passed.");
process.exit(failed ? 1 : 0);
