# EBENEZER DIGITAL — MASTER ECOSYSTEM AUDIT

**Date:** 2026-09-03  
**Phase:** 1 complete · Phase 2 P0 fixes in progress (local)  
**Scope:** `ebenezer-digital/` (+ nested `yegova-saas/`)  
**Method:** Full codebase inspection of routing, SEO, auth, content, deploy, security

---

## Phase 2 progress (this session)

| ID | Fix | Files | Verified |
|----|-----|-------|----------|
| P0-2 | Locale paths run `foreignSectionRedirect` on de-localized `rest` | `middleware.ts` | Logic review |
| P0-5 | Newsroom kind + public path (`/newsroom/...` not `/room/...`) | `lib/site-url.ts` | `tsx` smoke |
| P0-6 | Stronger admin cookie gate; no prod password bootstrap without env; no known JWT fallback | `middleware.ts`, `lib/auth.ts`, `.env.example` | `tsc` |
| P0-7 | AI API: key OR first-party Origin/Referer; deny anonymous cross-origin in prod | `lib/ai.ts`, `.env.example` | `tsc` |
| P1-2 | Duplicate news home sitemap entry removed | `lib/site-sitemaps.ts` | Logic review |
| P0-4 | Sitemap package present (`app/sitemap.xml/route.ts`, chunks) | already on disk | `tsc` |
| P0-1 / P0-3 | Pretty + foreign redirects already in middleware | `middleware.ts` | **Needs VPS deploy + live HTTP smoke** |

**Not yet verified on production:** store `/blog/news` → 308, tools `/runway` → 200, `/sitemap.xml` → 200.

---

## Executive Summary

Ebenezer Digital is a **single Next.js 14 application** serving **11 host identities** via middleware host detection, plus a separate **Yegova** NestJS + Next billing stack behind `saas.ebenezerdigital.com` path splits.

The ecosystem has solid foundations (host-aware URLs, canonical helpers, legal pages, per-host sitemaps, ecosystem URL sanitizer). It is **not** yet a production-grade multi-site company system because:

1. **Cross-domain content is possible** — any host can hit App Router paths like `/blog/news` unless middleware redirects (fix present locally; **not verified as deployed**).
2. **Pretty URLs in sitemaps/canonicals ahead of live routing** — Google indexes `/runway` while production often only serves `/tools/runway`.
3. **Content scale without editorial control** — ~1,100+ generated `learn-*` journal posts; live news aggregation republishes wire copy.
4. **Security defaults** — weak admin password fallback, cookie length check instead of JWT verify, open AI chat when key unset.
5. **Uncommitted critical SEO/routing work** — sitemap route swap + middleware pretty-URL/foreign redirects must ship together or risk breaking `/sitemap.xml`.

**Positioning target (from brief):** digital technology company with clear parent → product/media/labs architecture. Current public surfaces exist but brand/trust/content governance are incomplete.

---

## Architecture

```
Browser → nginx (Host header)
            ├─ most hosts → :3000 Next.js (SiteKind via middleware)
            └─ saas.ebenezerdigital.com
                  ├─ /api/*     → :4000 Nest (Yegova)
                  ├─ /login|/register|/app → :3001 Yegova Next
                  └─ /          → :3000 marketing (/saas)
```

| Layer | Implementation |
|-------|----------------|
| Main app | `ebenezer-digital` — Next 14 App Router |
| CMS | `data/store.json` via `lib/db.ts` (not Prisma) |
| Billing | `yegova-saas` — Nest + Prisma SQLite + Next web |
| Cache | Optional Redis (`REDIS_URL`) + memory fallback |
| Auth | Admin JWT; SaaS stub JWT; Yegova Nest JWT |
| Payments | PayPal HTML checkout (store); Yegova separate |

### Applications / packages

| Unit | Path | Port (intent) |
|------|------|----------------|
| Public ecosystem | `ebenezer-digital/` | 3000 |
| Yegova API | `yegova-saas/apps/api` | 4000 |
| Yegova Web | `yegova-saas/apps/web` | 3001 |
| Yegova Mobile | `yegova-saas/apps/mobile` | — |

---

## Domain Map

| Domain | Purpose | App surface | Canonical base | Sitemap | Status |
|--------|---------|-------------|----------------|---------|--------|
| `ebenezerdigital.com` | Corporate / studio | `/` studio | CANONICAL_URLS.studio | Host-scoped XML | Live |
| `ebenezerdigital.info` | Info gateway | `/info` | .info | Host-scoped | Live |
| `journal.ebenezerdigital.info` | E> Journal | `/blog` | journal | Host-scoped | Live — pretty slug gaps |
| `news.ebenezerdigital.info` | E> News | `/blog/news` | news | XML + `/api/news/sitemap` | Live — pretty slug gaps |
| `ebenezerdigital.store` | Digital store | `/products` | store | Host-scoped | Live — **cross-path news risk** |
| `products.ebenezerdigital.com` | Hardware catalog | `/catalog` | products | Host-scoped | Live |
| `tools.ebenezerdigital.com` | Tools discovery | `/tools` | tools | Host-scoped | Live — **pretty URL 404s** |
| `ai.ebenezerdigital.com` | Eben AI | `/ai` | ai | Host-scoped | Live |
| `saas.ebenezerdigital.com` | Yegova marketing + app | `/saas` + Yegova | saas | Host-scoped | Live — nginx path-split required |
| `discover.ebenezerdigital.com` | Intent router | `/discover` | discover | Host-scoped | Live |
| `ebenezerdigital.net` | Free tools network | `/network` | network | Host-scoped | Live |

Config sources: `lib/ecosystem-urls.ts`, `lib/site-url.ts`, `nginx-info-store.conf`, `.env.example`.

---

## Cross-Domain Content (P0 root cause)

### Symptom
`https://www.ebenezerdigital.store/blog/news` returns the full News desk UI.

### Root cause (verified)
1. **One Next.js app** mounts all routes (`app/blog/news/*` always exists).
2. **Committed middleware** redirects `/blog/news` off **studio / .info / journal** only — **not** store, tools, saas, etc.
3. Store host block only maps products; `/blog/news` falls through → News layout renders.
4. SiteChrome correctly hides studio chrome on store; news still renders via its own layout.

### Local mitigation (working tree)
`foreignSectionRedirect()` + `mapPrettyPathForHost()` in `middleware.ts` — **must be committed, built, and deployed**. Locale paths (`/hi/blog/news`) must also run the foreign check (currently locale rewrite can return before foreign redirect).

### Required end state
| Wrong URL | Response |
|-----------|----------|
| `*.store/blog/news*` | 308 → `news.ebenezerdigital.info` (pretty) |
| `tools.*/blog/news*` | 308 → news |
| `news.*/{slug}` | 200 (pretty) |
| News sitemap / canonical / OG / JSON-LD / RSS | News host only |

---

## P0 — Critical (fix next)

| ID | Issue | Domain | Root cause | Fix | Status |
|----|-------|--------|------------|-----|--------|
| P0-1 | Cross-host News (and Journal) 200 OK | store, tools, saas, … | No foreign-host gate on committed middleware | Ship `foreignSectionRedirect`; host allowlists; GSC cleanup | Local partial |
| P0-2 | Locale bypass of foreign redirect | all | `localeRewrite` returns before foreign check | Apply foreign map after locale `rest` | Open |
| P0-3 | Pretty URLs 404 (e.g. `/runway`) | tools, journal, news | Sitemap/canonicals pretty; live middleware incomplete | Ship `mapPrettyPathForHost` + ugly→pretty 308s | Local partial |
| P0-4 | Sitemap package incomplete in git | all | `app/sitemap.ts` deleted; `sitemap.xml/route` untracked | Commit route + `lib/sitemap-xml.ts` with deletion | Open |
| P0-5 | Newsroom path/canonical bugs | news | `/blog/newsroom` treated as `/blog/news*` strip → wrong public path; `siteKindFromPath` → journal | Fix `publicPathForLocale` + `siteKindFromPath` | Open |
| P0-6 | Weak admin auth defaults | admin | Default `admin123`; JWT fallback secret; cookie length-only gate | Force strong env secrets; verify JWT in middleware | Open |
| P0-7 | Open AI chat when key unset | `/api/ai/chat` | `validateInternalApiKey` true if unset | Fail closed without key; rate limit | Open |
| P0-8 | Canaan env contamination risk | all | Shared VPS / copied `.env` | Audit VPS env; keep `resolveEcosystemUrl` | Mitigated in code |
| P0-9 | Mass thin journal content | journal | ~1,134 `learn-*` edu posts | Governance: noindex subset, quality bar, stop mass publish | Open |
| P0-10 | Wire news republish / fake desks | news | Live RSS body + invented “desks” | Clear source attribution; no fake journalists; editorial policy | Open |

---

## P1 — High

| ID | Issue | Fix direction |
|----|-------|----------------|
| P1-1 | Soft duplicate: wrong-host 200 + news canonical | Host 308 + optional noindex belt |
| P1-2 | Duplicate news home in sitemap (`""` + `/blog/news`) | Single loc |
| P1-3 | RSS/iCal ugly paths vs pretty sitemap | Align `publicUrlForInternalPath` |
| P1-4 | Unauthenticated write APIs, no rate limits | Auth where needed + rate limit |
| P1-5 | Fabricated homepage stats (150+ / 98%) | Replace with verifiable claims |
| P1-6 | Mock testimonials / Learn Desk authorship | Remove or label honestly |
| P1-7 | Nest CORS `origin: true` | Restrict to saas frontend |
| P1-8 | SaaS stub vs real Yegova confusion | Docs + CTAs only to `/login` `/register` |
| P1-9 | Nginx config drift (all-sites vs info-store saas split) | Single source of truth on VPS |
| P1-10 | Port collision risk (ministry :3001 vs yegova-web) | Reconcile PM2 ports |
| P1-11 | Brand tokens unused across CSS | Wire `lib/brand-tokens.ts` |
| P1-12 | Tools/layout hardcoded canonical | Rely on `pageMetadata` |
| P1-13 | framer-motion weight; unused three scenes | Trim client JS |
| P1-14 | News uses raw `<img>` | Prefer `next/image` where safe |
| P1-15 | Docs drift (`EXTRA_DOMAINS`, ECOSYSTEM §7 Yegova) | Update to path-split reality |
| P1-16 | GSC/GA optional env empty | Configure per property + GA4 |

---

## P2 — Growth / polish

| ID | Issue |
|----|-------|
| P2-1 | Corporate IA expansion (services children, case study model) — only with real content |
| P2-2 | Tools methodology / verified pricing dates |
| P2-3 | Case study CMS fields (no invented metrics) |
| P2-4 | Help center / docs / changelog for SaaS |
| P2-5 | Security headers (CSP staged carefully) |
| P2-6 | Staging environment + noindex |
| P2-7 | CI link/sitemap validation (`audit:geo` already exists) |
| P2-8 | Author profiles for original content only |
| P2-9 | Filter/search noindex policy |
| P2-10 | Labs surface if/when real |

---

## SEO Changes Needed (summary)

1. **Host isolation** — never 200 News/Journal on Store/Tools.
2. **Pretty URL parity** — public path = middleware rewrite = sitemap loc = RSS link.
3. **Newsroom** — fix strip/canonical/kind.
4. **Sitemaps** — domain-specific only (already mostly true); validate URLs return 200.
5. **Robots** — consider disallow `/blog/` on non-journal/news hosts after redirects.
6. **Content** — quality gate; stop mass `learn-*` expansion; differentiate News vs Journal.

---

## Security Changes Needed (summary)

| Item | Action |
|------|--------|
| Admin password / JWT | Require strong env; no insecure fallbacks in production |
| Middleware admin gate | Verify JWT signature/claims |
| AI API | Require key; rate limit |
| Public POST APIs | Rate limit + validation |
| Yegova CORS | Pin to saas origin |
| Secrets in reports | Never print values |
| PayPal / downloads | Server-side ownership checks (review) |

**Note:** No payment secrets found in `NEXT_PUBLIC_*` in `.env.example` (good).

---

## Performance Notes

- Optional Redis; OOM history on VPS → `max-old-space-size=768` in ecosystem config.
- Widespread `framer-motion`; `three` largely unused — remove dead scenes.
- News images bypass `next/image`.
- Journal sitemap ~1100+ URLs — chunked index approach is correct when shipped.

---

## Design Notes

- Host-aware `SiteChrome` — PASS.
- Brand tokens exist, underused — P1/P2.
- SaaS gold/dark ink contrast — local CSS improvements exist; deploy required.
- Do not unify all sites to one visual skin; keep related-but-distinct surfaces per brief §17.

---

## Content Governance (required)

| Surface | Owns | Must not publish |
|---------|------|------------------|
| Company (.com) | Corporate, services, work | News wire, store SKUs as “news” |
| Store | Digital products | News desk, journal mass learn posts |
| Tools | Software discovery | News articles |
| News | Current events | Evergreen learn series as “breaking” |
| Journal | Evergreen guides | Wire republishing as original reporting |
| SaaS | Yegova billing | Unrelated CMS blog |

**Absolute:** Do not invent clients, testimonials, stats, journalists, or awards.

---

## Redirect Map (intended)

| From | To | Type |
|------|-----|------|
| `{any non-news}/blog/news` | `https://news.ebenezerdigital.info/` | 308 |
| `{any non-news}/blog/news/{slug}` | `https://news.ebenezerdigital.info/{slug}` | 308 |
| `{non-journal}/blog/{slug}` (excl. news) | `https://journal.ebenezerdigital.info/{slug}` | 308 |
| `tools…/tools/{id}` | `tools…/{id}` | 308 |
| `news…/blog/news/{slug}` | `news…/{slug}` | 308 |
| `.com/ai|/saas|/discover|/products|/info|/blog` | dedicated hosts | 308 (exists) |

Avoid redirect chains: old → intermediate → final.

---

## Uncommitted Local Work (deploy risk)

| Change | Risk if not shipped carefully |
|--------|-------------------------------|
| Delete `app/sitemap.ts` without `app/sitemap.xml/route.ts` | `/sitemap.xml` broken |
| Middleware pretty + foreign redirects | Cross-domain + 404s remain live |
| `saas.css` / SaasHeader CTA fixes | Design issues remain |
| `lib/sitemap-xml.ts`, audit scripts | Incomplete GEO tooling |

**Ship rule:** one atomic commit/deploy for sitemap swap + middleware host fixes.

---

## Implementation Order (aligned to brief §92)

| Step | Focus | Phase |
|------|-------|-------|
| 1 | This audit document | **Done (Phase 1)** |
| 2 | P0-4 sitemap package commit | Phase 2 |
| 3 | P0-1/2/3 middleware host + pretty + locale | Phase 2 |
| 4 | P0-5 newsroom canonical/path | Phase 2 |
| 5 | P0-6/7 security fail-closed | Phase 2 |
| 6 | VPS env Canaan + nginx saas verify | Phase 2 |
| 7 | Align RSS/JSON-LD/links to pretty URLs | Phase 3 |
| 8 | Content governance (learn-*, news attribution, stats) | Phase 3 |
| 9 | Brand system + corporate IA (real pages only) | Phase 3–4 |
| 10 | Store / Tools / News / Journal quality | Phase 4 |
| 11 | Performance + a11y + analytics | Phase 4–5 |
| 12 | Validation + final report | Phase 5–6 |

---

## Testing Commands (existing)

```bash
npm run lint
npm run typecheck
npm run build
npm run audit:quality
npm run audit:geo
npm run audit:site   # needs running server
```

Do not invent new package scripts without adding them.

---

## Success Criteria (Phase 1 gate)

- [x] Architecture mapped
- [x] Domains mapped
- [x] Cross-domain root cause traced
- [x] P0 / P1 / P2 classified
- [ ] P0 fixed and verified on production (Phase 2)
- [ ] No claim of “ecosystem complete” until P0 verified live

---

## Recommended Immediate Next Step (Phase 2 start)

1. **Commit & push** together: middleware (pretty + foreign + locale fix), sitemap.xml routes, sitemap-xml helper, robots `/sitemaps/` allow, newsroom path/kind fixes.
2. **Deploy** main app; smoke-test:
   - `store…/blog/news` → 308 news
   - `tools…/runway` → 200
   - `journal…/{learn-slug}` → 200
   - `/sitemap.xml` → 200 XML with `<loc>`
3. **Hardening:** admin JWT verify + AI key fail-closed.
4. **GSC:** re-submit sitemaps; request removal of wrong-host news URLs if indexed.

---

## What This Audit Explicitly Does *Not* Do Yet

- Mass redesign of all sites
- Mass generation of SEO pages
- Deletion of production CMS data
- Invented case studies / testimonials / stats
- Full Labs / Help Center builds without real content
- Claiming Yegova or nginx state without VPS verification in this phase

---

*Audit authored for the Master Ecosystem Prompt Phase 1. Proceed to Phase 2 only with atomic, verified P0 fixes.*
