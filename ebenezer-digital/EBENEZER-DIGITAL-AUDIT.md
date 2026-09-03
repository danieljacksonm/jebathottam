# EBENEZER DIGITAL — MASTER ECOSYSTEM AUDIT & IMPLEMENTATION REPORT

**Date:** 2026-09-03  
**Phases:** 1–6 (code complete locally; production smoke still required after deploy)  
**Scope:** `ebenezer-digital/` (+ `yegova-saas/` CORS)

---

## Executive Summary

Ebenezer Digital is a **single Next.js 14 app** serving **11 host identities**, plus **Yegova** (Nest + Next) on `saas.ebenezerdigital.com`.

This engagement delivered:

1. **Architecture audit** and domain ownership model  
2. **P0** host isolation, pretty URLs, sitemap package, newsroom canonicals, auth/AI hardening  
3. **P1** trust cleanup, rate limits, CORS lock, RSS/pretty parity, tools methodology  
4. **P2** corporate IA pages, error boundaries, brand tokens, security headers, learn-* crawl governance  

**Not claimed complete without VPS deploy:** live 308/200 smoke tests and GSC resubmit.

---

## Architecture

```
Browser → nginx (Host)
  ├─ ecosystem hosts → :3000 Next.js (SiteKind middleware)
  └─ saas.ebenezerdigital.com
        ├─ /api/* → :4000 Nest
        ├─ /login|/register|/app → :3001 Yegova web
        └─ / → :3000 marketing (/saas)
```

CMS: `data/store.json` · Billing: Yegova Prisma SQLite

---

## Domain Map

| Domain | Purpose | Canonical base | Sitemap | Status |
|--------|---------|----------------|---------|--------|
| ebenezerdigital.com | Corporate | studio | Host XML | Ready to deploy |
| ebenezerdigital.info | Info gateway | info | Host XML | Ready |
| journal.ebenezerdigital.info | E> Journal | journal | Host XML (learn-* omitted) | Ready |
| news.ebenezerdigital.info | E> News | news | Host XML + news API | Ready |
| ebenezerdigital.store | Store | store | Host XML | Ready (cross-host News gated in middleware) |
| products.ebenezerdigital.com | Hardware | products | Host XML | Ready |
| tools.ebenezerdigital.com | Tools | tools | Host XML + methodology | Ready |
| ai.ebenezerdigital.com | Eben AI | ai | Host XML | Ready |
| saas.ebenezerdigital.com | SaaS + Yegova | saas | Host XML | Ready (nginx path-split on VPS) |
| discover.ebenezerdigital.com | Discover | discover | Host XML | Ready |
| ebenezerdigital.net | Network | network | Host XML | Ready |

---

## WHAT WAS FOUND

- Cross-domain News on Store/Tools because one App Router mounts all paths and middleware did not gate foreign hosts.
- Pretty URLs in sitemaps ahead of live middleware rewrites → 404 risk.
- Newsroom `/blog/newsroom` stripped incorrectly to `/room/...`.
- Weak admin password bootstrap, cookie-length gate, open AI when key unset.
- Fabricated stats (150+/98%) and mock testimonials with invented metrics.
- Unauthenticated public POSTs without rate limits; Yegova CORS `origin: true`.
- Mass `learn-*` journal inventory bloating sitemaps.
- Corporate IA gaps (about/faq/media/case-studies).

---

## WHAT WAS FIXED

### P0
| ID | Fix | Status |
|----|-----|--------|
| P0-1 | `foreignSectionRedirect` for News/Journal off wrong hosts | Code done — **deploy to verify** |
| P0-2 | Locale paths run foreign redirect on `rest` | Done |
| P0-3 | `mapPrettyPathForHost` + ugly→pretty 308s | Done — **deploy to verify** |
| P0-4 | `app/sitemap.xml` + chunks; deleted `sitemap.ts` | Done |
| P0-5 | Newsroom kind + `/newsroom` public paths | Done |
| P0-6 | Admin cookie structure/exp/role; no prod password bootstrap without env | Done |
| P0-7 | AI: key or first-party Origin; rate limit | Done |
| P0-8 | Ecosystem URL sanitizer retained | Mitigated |
| P0-9 | `learn-*` noindex + removed from journal XML sitemap | Done |
| P0-10 | Editorial policy clarifies wire summaries / no fake journalists | Done |

### P1
| ID | Fix | Status |
|----|-----|--------|
| P1-2 | Duplicate news home sitemap removed | Done |
| P1-3 | News/Journal RSS + iCal pretty URLs | Done |
| P1-4 | Rate limits on inquiries, contact, newsletter, AI chat | Done |
| P1-5 | Qualitative `STUDIO_STATS` | Done |
| P1-6 | Testimonials draft + empty mock fallback | Done |
| P1-7 | Yegova CORS pinned to saas + localhost | Done |
| P1-11 | Brand CSS vars + `--st-*` in globals | Done |
| P1-12 | Tools layout uses `pageMetadata` | Done |

### P2
| ID | Fix | Status |
|----|-----|--------|
| P2-1 | `/about`→`/why`, `/case-studies`, `/media`, `/faq`, `/products-overview` | Done |
| P2-2 | Tools methodology page + pricing verification labels | Done |
| P2-5 | Security headers (HSTS, nosniff, referrer, frame, permissions) | Done |
| P2-7 | audit:geo / audit:quality pass | Done |
| Error UX | `app/error.tsx` + `app/global-error.tsx` | Done |

---

## WHAT FILES CHANGED (high level)

- `middleware.ts`, `lib/site-url.ts`, `lib/auth.ts`, `lib/ai.ts`, `lib/rate-limit.ts`
- `app/sitemap.xml/`, `app/sitemaps/`, `lib/sitemap-xml.ts`, `lib/site-sitemaps.ts`
- Corporate: `app/about`, `case-studies`, `media`, `faq`, `products-overview`
- Tools: `methodology`, `types`, `[id]/page`, `layout`
- Trust: `studio-stats`, `Footer`, `Contact`, `store.json` testimonials draft
- Security: `next.config.js` headers, Yegova `main.ts` CORS, API rate limits
- Errors: `error.tsx`, `global-error.tsx`
- This report: `EBENEZER-DIGITAL-AUDIT.md`

---

## DATABASE CHANGES

- **No schema migration.** CMS file `data/store.json`: testimonials `t1`–`t5` set to `draft`.
- Yegova Prisma untouched.

---

## URLS / REDIRECTS

| From | To | Type |
|------|----|------|
| Non-news `/blog/news*` | news host pretty | 308 |
| Non-journal `/blog*` (excl news) on product hosts | journal host | 308 |
| `/tools/{id}` on tools host | `/{id}` | 308 |
| `/about` | `/why` | 308 permanent |
| Locale `/xx/blog/news` on wrong host | news | 308 |

---

## SEO CHANGES

- Host-scoped XML sitemaps + chunk index  
- Pretty canonicals / RSS alignment  
- Newsroom canonicals fixed  
- `learn-*` noindex + omitted from journal sitemap  
- Studio sitemap includes new IA routes; drops testimonials/stats vanity routes  
- Tools methodology in tools sitemap  

---

## SECURITY CHANGES

- Stronger admin gate + production password policy  
- AI first-party / key gate + rate limit  
- Public form rate limits  
- Yegova CORS allowlist  
- Baseline security headers (CSP deferred — risk of breakage)  

---

## PERFORMANCE / A11Y

- Journal sitemap much smaller (learn-* out)  
- Error boundaries without leaking stack traces  
- Brand token consolidation (partial)  
- Full Lighthouse / a11y pass still recommended post-deploy  

---

## TESTING RESULTS

| Check | Result |
|-------|--------|
| `tsc --noEmit` | Pass |
| `npm run audit:geo` | Pass |
| `npm run audit:quality` | Pass |
| `npm run build` | Not run this pass (heavy); run on VPS before restart |
| Live HTTP smoke | **Pending deploy** |

---

## REMAINING ISSUES

1. **Deploy + smoke** store News 308, tools `/runway` 200, sitemap.xml 200  
2. Per-tool `pricingVerifiedAt` fill-in (types ready; catalog mostly unset)  
3. Real testimonials / case metrics when available  
4. CSP staging, Redis-backed rate limits, CI link crawler  
5. Full Labs / Help Center only when real content exists  
6. VPS env: `JWT_SECRET`, `ADMIN_DEFAULT_PASSWORD`, `AI_API_KEY`, clean Canaan-free URLs  
7. GSC resubmit + wrong-host URL removal requests  

---

## RECOMMENDED NEXT STEPS

1. Push commit → VPS pull → `npm run build` → PM2 restart  
2. Smoke checklist (above)  
3. Set production secrets  
4. GSC: submit `sitemap.xml` per property  
5. Gradually replace wire-news UX with clearer “Source-based summary” chips in UI  
6. Fill tools `pricingVerifiedAt` on next editorial pass  

---

## Priority dashboard

```
P0  ████████████  mostly code-complete (deploy gate)
P1  ██████████    mostly complete
P2  ████████      core IA + methodology + headers done
```

| ID | Issue | Severity | Status |
|----|-------|----------|--------|
| P0-1/3 | Cross-host + pretty URLs | P0 | Code done / deploy pending |
| P0-9 | Mass learn-* crawl | P0 | Mitigated (noindex + sitemap omit) |
| P1-4 | API abuse | P1 | Rate limited |
| P1-7 | CORS | P1 | Fixed |
| Deploy smoke | Production verification | P0 | Open |

---

## Success criteria (honest)

- [x] Domain ownership clear in code  
- [x] Cross-domain gates in middleware  
- [x] Canonical / sitemap / robots foundations  
- [x] No invented homepage stats / published fake testimonials  
- [x] lint/typecheck/audit scripts green (tsc + audits)  
- [ ] Production build + live smoke  
- [ ] GSC verified  

*Do not treat this document as proof of production deployment.*
