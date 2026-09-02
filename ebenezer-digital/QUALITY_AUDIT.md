# Ebenezer Digital — Master Ecosystem Sprint Audit

**Last updated:** September 2, 2026  
**Build:** `npm run typecheck` · `npm run lint` · `npm run build` · `npm run audit:quality`

---

## Sprint deliverables

| Phase | Item | Status |
|-------|------|--------|
| **P0** | Host-aware `SiteChrome` via `siteKindFromHost()` | ✓ PASS |
| **P0** | Studio chrome hidden on all non-studio hosts | ✓ PASS |
| **P0** | `<html lang>` + `content-language` from locale header | ✓ PASS |
| **P1** | Pretty URL roots: tools/store/catalog/network | ✓ PASS |
| **P1** | Sitemap + canonical pretty-root alignment | ✓ PASS |
| **P1** | Ecosystem URL sanitizer (blocks poisoned env domains) | ✓ PASS |
| **P2** | `/privacy`, `/terms`, `/sitemap` on every host | ✓ PASS |
| **P2** | Shared legal pages via `/site-legal/*` rewrite | ✓ PASS |
| **P3** | Single `SEO_LOCALES` source in middleware | ✓ PASS |
| **P3** | Info locale paths (`/hi/about`, etc.) | ✓ PASS |
| **P3** | `publicPathForLocale()` + expanded sitemaps | ✓ PASS |
| **P3** | `LanguageSwitcher` on all 11 surfaces (select on mobile) | ✓ PASS |
| **P3** | Article sitemap hreflang (en + x-default) | ✓ PASS |
| **P4** | Redis cache layer (`lib/cache.ts`) + blog list cache | ✓ PASS |
| **P4** | Journal SSR initial posts (`revalidate: 300`) | ✓ PASS |
| **P4** | News SSR initial wire (`revalidate: 300`) | ✓ PASS |
| **P4** | News image 16:9 aspect frames | ✓ PASS |
| **P5** | SaaS CTAs → `/saas/login` (not billing subdomain) | ✓ PASS |
| **P5** | Discover: popular intents + ecosystem map sections | ✓ PASS |
| **P5** | Admin login placeholder → `admin@ebenezar.com` | ✓ PASS |
| **P6** | Content engine (`lib/content-engine/`) | ✓ PASS |
| **P6** | Studio `/insights` hub + article routes | ✓ PASS |
| **P6** | `npm run seed:topics` (300 scaffold topics) | ✓ PASS |
| **P6** | `npm run generate:content` batch script | ✓ PASS |
| **P7** | AI hybrid fast path (Groq via `GROQ_API_KEY`) | ✓ PASS |
| **P7** | `audit-all.mjs` + `audit-quality.mjs` | ✓ PASS |
| **P7** | `/llms.txt` per host (GEO) | ✓ PASS |

---

## Site scorecard

| Site | Chrome | URLs | Legal | SEO/i18n | Perf | Status |
|------|--------|------|-------|----------|------|--------|
| **.com** Studio | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **.info** Gateway | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **news.** | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **journal.** | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **tools.** | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **products.** | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **.store** | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **.net** Network | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **ai.** | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **saas.** | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **discover.** | PASS | PASS | PASS | PASS | PASS | **PASS** |

---

## Content engine targets (ongoing batches)

| Surface | Target | Pipeline |
|---------|--------|----------|
| `.com/insights` | 1,000 | `npm run seed:topics` then `npm run generate:content -- --surface=studio-insights --limit=200` |
| Journal | 5,000+ | Existing edu + CMS + quality gate |
| Other sites | 500 each | `--surface=tools-guides`, `network-guides`, `info-guides`, etc. |

Set `REDIS_URL` on VPS for API caching. Set `GROQ_API_KEY` for AI hybrid fast replies.

**VPS:** Ensure `NEXT_PUBLIC_SITE_URL=https://ebenezerdigital.com` (not Canaan or other client URLs).

---

## Deploy

```bash
cd ~/jebathottam && git pull origin main
cp /home/dani/ebenezer-digital/data/store.json /tmp/store.json.bak
rsync -a --delete --exclude node_modules --exclude .next --exclude data/store.json \
  --exclude .env --exclude .env.local \
  ~/jebathottam/ebenezer-digital/ /home/dani/ebenezer-digital/
cp /tmp/store.json.bak /home/dani/ebenezer-digital/data/store.json
cd /home/dani/ebenezer-digital && npm ci && npm run build && pm2 restart ebenezer-digital
```

Verify: no studio header/footer on subdomain hosts; pretty roots on tools/store/catalog/net; logo links point to Ebenezer domains.
