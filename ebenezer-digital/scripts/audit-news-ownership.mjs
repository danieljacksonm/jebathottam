/**
 * P0/P1 News ownership / redirect / sitemap architecture checks (static + unit).
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
const liveNews = read("lib/live-news.ts");
const apiNews = read("app/api/news/route.ts");
const infoHome = read("app/info/page.tsx");
const robots = read("app/robots.ts");

check("redirects use HTTP 301", mw.includes("return NextResponse.redirect(dest, 301)"));
check("strip tracking params on redirects", mw.includes("stripTrackingParams"));
check("foreign News paths redirect off non-News hosts", mw.includes("foreignSectionRedirect"));
check("News host strips non-en locales", mw.includes('isNewsHost(host) && locale !== "en"'));
check("studio News paths strip /blog/news before redirect", mw.includes('pathname.replace(/^\\/blog\\/news/, "")'));
check("Edge rejects wp-admin / php probes", mw.includes("/wp-admin") && mw.includes("status: 404"));
check("newsPublicUrl / category paths exist", newsUrl.includes("newsPublicPath") && newsUrl.includes("newsPublicUrl"));
check("legacy source-domain slug detection", newsUrl.includes("isLegacySourceDomainSlug"));
check("title-only slugify", newsUrl.includes("slugifyNewsTitle"));
check("legacy slug resolution in news-service", newsService.includes("findArchivedNewsByLegacySlug"));
check("getPublicNewsBySlug request-deduped with cache()", newsService.includes("cache(async"));
check("listPublicNewsPreview for hubs", newsService.includes("listPublicNewsPreview"));
check("listPublicNewsForHome caps chrome payload", newsService.includes("listPublicNewsForHome") && newsService.includes("NEWS_HOME_CLIENT_LIMIT"));
check("listPublicNews memo TTL", newsService.includes("LIST_PUBLIC_TTL_MS") || newsService.includes("listPublicMemo"));
check("in-process RSS off unless LIVE_NEWS_INPROCESS=1", liveNews.includes('LIVE_NEWS_INPROCESS === "1"'));
check("foreign /api/news redirects to News host", mw.includes('pathname.startsWith("/api/news")') && mw.includes("NEWS_URL"));
check("soft locale URLs send X-Robots-Tag noindex", mw.includes('x-robots-tag') && mw.includes("noindex, follow"));
check("News legacy www-* rewrites to article surface", mw.includes('x-eben-news-surface", "article"') && mw.includes("isLegacySourceDomainSlug"));
check(
  "archive excludes www-* from sitemap",
  archive.includes("isLegacySourceDomainSlug(n.slug)") || archive.includes("if (isLegacySourceDomainSlug")
);
check("news sitemap uses newsPublicUrl", sitemaps.includes("newsPublicUrl"));
check("site-nav newsArticleHref uses newsPublicPath", siteNav.includes("newsPublicPath"));
check(
  "article page permanentRedirect to category canonical",
  articlePage.includes("permanentRedirect(canonicalPath)")
);
check("article OG/canonical use newsPublicUrl", articlePage.includes("newsPublicUrl"));
check("JSON-LD mainEntityOfPage uses canonical", articlePage.includes("mainEntityOfPage"));
check("API news limit capped", apiNews.includes("MAX_LIMIT") && apiNews.includes("80"));
check(
  "Info home uses preview not full listPublicNews",
  infoHome.includes("listPublicNewsPreview") && !infoHome.includes("listPublicNews()")
);
check(
  "Info People category links to News home not /blog/news",
  infoHome.includes("SITE_NAV.news") && !infoHome.includes("${SITE_NAV.news}/blog/news")
);
check(
  "robots does not Disallow /blog/news (redirects must be crawlable)",
  !robots.includes('"/blog/news"')
);

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
{
  const journalBlock = sitemaps.match(/async function journalSitemap[\s\S]*?(?=\nasync function newsSitemap)/)?.[0] || "";
  check("journal sitemap does not list news articles", !journalBlock.includes("listPublicNewsForSitemap"));
}

console.log(failed ? `\n${failed} news-ownership check(s) failed.` : "\nAll news-ownership checks passed.");
process.exit(failed ? 1 : 0);
