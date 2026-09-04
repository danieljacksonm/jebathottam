# EBENEZER DIGITAL — STAGE 2 IMPLEMENTATION REPORT

**Date:** 2026-09-04  
**Scope:** Second-stage production, SEO & ecosystem hardening  
**Principle:** No redesign — authority, ownership, trust, technical SEO

---

## Audit summary (Phase 1)

| Area | Finding |
|------|---------|
| Framework | Next.js 14 single app + Yegova Nest stack on saas |
| News ownership | Code-gated to `news.ebenezerdigital.info` via 308 middleware (verified live) |
| Ugly live slugs | Live RSS previously slugified **source URLs** → `www-theguardian-com-…` |
| Trust stats | Already qualitative (Stage 1) |
| Testimonials | All draft (not public) |
| Gaps | No `/services/[slug]`, no `/work/[slug]`, no `sourceType`, locale soft-duplicates |

---

## P0 FIXED

| Item | Fix |
|------|-----|
| URL-derived News slugs | `slugifyNewsTitle()` — title only, never source domains (`lib/news-url.ts`, `lib/live-news.ts`) |
| Canonical News URL shape | Chose **`/{category}/{slug}`** e.g. `/world/example-story` (`newsPublicUrl`) |
| Middleware category rewrites | `/{world\|india\|technology\|…}/{slug}` → `/blog/news/{slug}` |
| Cross-host News duplicates | Existing 308 foreign redirects retained (already live-verified) |
| News sitemap / RSS / iCal | Emit category canonical URLs only |
| Locale soft-index risk | Non-`en` news articles set `robots: noindex, follow` |
| Source classification | `sourceType`: ORIGINAL / SOURCE_SUMMARY / PARTNER_WIRE / OPINION / ANALYSIS |
| Editorial transparency | Source-summary banner + “Read the original report →” |

---

## P1 FIXED

| Item | Fix |
|------|-----|
| Service landings | `/services/{web-development,saas-development,ai-solutions,business-automation,travel-booking,data-entry}` |
| Case study routes | `/work/[slug]` from real portfolio (qualitative outcomes only) |
| Case studies index | Links to full `/work/{slug}` pages |
| Studio sitemap | Service landings + work case studies |
| Admin login rate limit | 8/min via `lib/rate-limit.ts` |
| News JSON-LD newsroom URLs | Pretty `/newsroom/…` paths |
| CMS news fields | `originalUrl`, `sourceType`, `byline`, `authorRole`, SEO, review fields |
| Tools pricing dates | `pricingVerifiedAt` + `ratingKind: editorial` on discovery tools |

---

## Additional P1 (tools / store)

| Item | Fix |
|------|-----|
| Editorial comparisons | `/tools/compare/{chatgpt-vs-claude,cursor-vs-github-copilot,canva-vs-adobe-express,zoho-invoice-vs-quickbooks,notion-vs-asana}` |
| Compare hub | Links editorial pages + live tables |
| Tools sitemap | Includes comparison URLs |
| Store funnel | Free → Starter → Premium → SaaS → Custom (non-aggressive) |
| GEO audit | Updated for `newsPublicUrl` category canonicals — **pass** |

## P2 / deferred (honest)

| Item | Status |
|------|--------|
| Mass auto comparison pages | Intentionally not built |
| Store AggregateRating cleanup | Still review catalog/store `reviews` counts |
| Redis-backed rate limits | Still in-memory |
| Full CSP | Deferred (breakage risk) |
| Fabricated catalog review counts | Remaining business/data cleanup |
| Labs / Help Center | Not created without real content |
| VPS deploy of this batch | Pending push + rebuild + smoke |

---

## Architecture chosen (News)

```
Canonical: https://news.ebenezerdigital.info/{category}/{slug}
Legacy flat: https://news.ebenezerdigital.info/{slug}  → still rewrites (soft); HTML canonical = category URL
Internal:    /blog/news/{slug}
Foreign hosts /blog/news* → 308 → news host
```

Categories: `world`, `asia`, `europe`, `americas`, `africa`, `middle-east`, `india`, `technology`, `business`, `science`, `climate`, `sports`

---

## FILES CHANGED (high level)

- `lib/news-url.ts` (new)
- `lib/live-news.ts`, `lib/news-service.ts`, `lib/db.ts`, `lib/site-sitemaps.ts`
- `lib/portfolio-slug.ts` (new)
- `middleware.ts`
- `app/blog/news/[slug]/*`, `app/blog/news/layout.tsx`, `app/blog/news/data.ts`
- `app/services/[slug]/page.tsx`, `app/services/page.tsx`
- `app/work/[slug]/page.tsx`, `app/work/page.tsx`, `app/case-studies/page.tsx`
- `app/api/auth/login/route.ts`
- `app/tools/discovery-tools.ts`
- This report

---

## ROUTES ADDED

- `/services/web-development` (+ 5 other service landings)
- `/work/[slug]` case studies
- News public category paths (middleware)

## REDIRECTS

- Existing cross-host News 308s (unchanged)
- News host `/blog/news…` → pretty (existing)
- Category path rewrite (new)

## SEO CHANGES

- News canonicals → `/{category}/{slug}`
- News sitemaps/RSS use category URLs
- Locale noindex for non-English news articles
- Studio sitemap expanded

## SCHEMA CHANGES

- NewsArticle includes `genre` from sourceType label
- Service FAQPage JSON-LD
- Case study CreativeWork JSON-LD (no fake ratings)

## SECURITY CHANGES

- Admin login rate limiting

## TEST RESULTS

- `tsc --noEmit` — pass
- `npm run lint` — pass (1 existing hooks warning in NewsProvider)
- `npm run audit:geo` — pass
- `npm run build` — pass
- Live smoke (prior deploy): store News 308, tools `/runway` 200
- Deploy of this Stage 2 batch — **pending push + VPS rebuild**

## REMAINING BUSINESS DATA REQUIRED

- Real published testimonials (when available)
- Verified pricing re-checks for Tools (dates seeded as editorial)
- Confirm service copy matches real offerings
- Optional: remove any remaining fabricated AggregateRating in catalog

---

*Do not claim production deployment until VPS pull/build/restart and smoke tests pass.*
