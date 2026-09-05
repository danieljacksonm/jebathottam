# NEWS ROUTE MIGRATION

**Date:** 2026-09-05  
**Related:** `NEWS_ROUTE_INVENTORY.md`

## A. ROOT CAUSE

One Next.js app serves all Ebenezer hosts. News UI lives at internal `/blog/news/*`. Without host gates, Main / Store / Tools could render the same articles. Historical ingestion slugified **source URLs** → `www-thehindu-…` public paths. Locale prefixes (`/kn/`, `/pa/`, …) rewrote the same English HTML under many URLs.

## B. ROUTES FOUND (duplicate patterns)

| Old pattern | Hosts |
|-------------|--------|
| `/blog/news` | `.com`, `.store`, `tools…`, journal, info |
| `/blog/news/{slug}` | same |
| `/blog/news/www-{source}-…` | indexed legacy |
| `/{locale}/blog/news…` (`kn`, `pa`, `hi`, …) | soft duplicates |
| `/blog/news` on News host | non-pretty internal |

## C. REDIRECTS (permanent **301**)

| Old | New | Code |
|-----|-----|------|
| `{any-non-news}/blog/news` | `https://news.ebenezerdigital.info/` | 301 |
| `{any-non-news}/blog/news/{slug}` | `https://news.ebenezerdigital.info/{slug}` → page → `/{category}/{slug}` | 301 |
| `news…/blog/news` | `news…/` | 301 |
| `news…/blog/news/{slug}` | served once; page **301** → `/{category}/{slug}` | 301 |
| `news…/{locale}/…` (non-en) | English path on News host | 301 |
| `news…/{flat-slug}` | `/{category}/{slug}` when resolved | 301 |
| Tracking `?utm_*` on redirects | stripped from Location | — |

Status code: **301** (replaces prior 308 for ownership migrations).

## D. CANONICAL FIX

- Generator: `newsPublicUrl(region, slug)` in `lib/news-url.ts`
- Applied in: `app/blog/news/[slug]/page.tsx` (`alternates.canonical`, `openGraph.url`, JSON-LD `mainEntityOfPage`)
- Shape: `https://news.ebenezerdigital.info/{category}/{slug}`
- Languages: `en` + `x-default` only (no fake hreflang cluster on articles)

## E. SITEMAP FIX

| Sitemap | News article URLs? |
|---------|-------------------|
| `news.ebenezerdigital.info/sitemap.xml` | Yes — category canonicals via `newsPublicUrl`; **no** `www-*` locs |
| Main / Store / Tools | No article URLs (ownership split unchanged) |

Archive (`data/news-sitemap-archive.json`) remaps legacy www-* → title slugs and keeps `legacySlugs` for redirect resolution only.

## F. ROBOTS

Unchanged policy: do **not** Disallow duplicate News URLs (redirects must be crawlable). Admin/auth remain blocked where previously configured. News sitemap declared on News host.

## G. LANGUAGE ROUTES (`/kn/`, `/pa/`)

- Confirmed as SEO locale prefixes (`SEO_LOCALES`), **not** verified Kannada/Punjabi News translations.
- On **News host**: non-`en` → **301** to English path.
- Cross-host `/{locale}/blog/news` still hits foreign News gate → News domain.
- Article metadata already `noindex` when `x-eben-locale !== en`.

## H. SOURCE SLUGS (`www-thehindu`, `www-nytimes`, `www-bbc`)

- New ingestion: `slugifyNewsTitle(title)` only (`lib/live-news.ts` + `lib/news-url.ts`).
- Legacy: `isLegacySourceDomainSlug` + `legacySlugFromSourceUrl` + archive `legacySlugs`.
- Lookup: `getPublicNewsBySlug` resolves legacy → current article → **301** to category URL.
- Sitemap: legacy www-* locs excluded / remapped.

## I. TEST RESULTS

| Check | Result |
|-------|--------|
| Lint | PASS |
| Typecheck | PASS |
| Build | PASS |
| `npm run audit:news` | PASS |
| `npm run audit:geo` | (optional; news ownership covered by audit:news) |
| Live redirects | Prior prod used **308**; this commit switches to **301** — verify after VPS deploy |

## J. REMAINING RISKS

1. **VPS must deploy** this commit; live sitemap still showed www-* before deploy.
2. Google index removal is **not** claimed — depends on crawl of 301s + Search Console.
3. Some legacy www-* URLs may **404** if the story aged out of the 7-day archive and live feeds.
4. Foreign host → flat `/{slug}` → category URL can still be **two hops** when category is unknown at middleware (Edge has no article DB). Preferred single hop used for `news…/blog/news/{slug}`.
5. Do not claim Search Console “duplicates removed” without GSC evidence.
