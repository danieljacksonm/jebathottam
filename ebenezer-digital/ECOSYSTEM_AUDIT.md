# Ebenezer Digital Ecosystem Audit

**Date:** 2026-09-02  
**Scope:** All subdomains in the unified Next.js app (`ebenezer-digital/`)

---

## 0. CRITICAL — Wrong domain links ✅ FIXED (code)

### Findings
- **No hardcoded `canaantravelhub.com` in React/TS nav components.** The only references are in `data/store.json` portfolio entries (intentional — Canaan is a client project in the work portfolio).
- **Root cause of live SaaS bug:** `SITE_NAV.home` used `NEXT_PUBLIC_SITE_URL` from env. On the VPS, this was almost certainly set to `https://canaantravelhub.com` (Caanan deploy uses the same shell / copied `.env`).
- **SaasHeader** logo and footer "Ebenezer Digital" both used `SITE_NAV.home` → poisoned env → Canaan URL.

### Fixes applied
- `lib/ecosystem-urls.ts` — canonical URLs + `resolveEcosystemUrl()` blocks forbidden domains
- `STUDIO_HOME_URL` — always `https://ebenezerdigital.com`, never env-poisoned
- `SITE_NAV.home` / `.studio` use `STUDIO_HOME_URL`
- SaaS logo → `SAAS_URL` (product home on saas subdomain)
- Footer "Ebenezer Digital" → `SITE_NAV.studio` (hardcoded .com)
- `.env.example` warning added

### VPS action required
```bash
grep NEXT_PUBLIC_SITE_URL /home/dani/ebenezer-digital/.env /home/dani/ebenezer-digital/.env.local
# Must be: NEXT_PUBLIC_SITE_URL=https://ebenezerdigital.com
```

### Link checklist (verify in browser after deploy)
| Surface | Logo / brand | Footer studio link |
|---------|--------------|-------------------|
| ebenezerdigital.com | / | N/A (studio footer) |
| saas.ebenezerdigital.com | saas root | ebenezerdigital.com |
| ebenezerdigital.store | store root | ebenezerdigital.com |
| tools.ebenezerdigital.com | tools root | disclosure + legal |
| ebenezerdigital.net | network root | ebenezerdigital.com |
| ebenezerdigital.info | info root | legal column |
| journal / news .info | journal/news nav | ecosystem links |
| ai / discover / products | respective nav | legal links |

---

## 1. Why visitors aren't increasing — diagnostic

| Check | Status | Notes |
|-------|--------|-------|
| GA4 installed | ⚠️ **Optional** | `NEXT_PUBLIC_GA_MEASUREMENT_ID` empty in `.env.example` — if unset on VPS, **no analytics fire** on any subdomain |
| GSC verification meta | ⚠️ **Optional** | Per-host tokens in env; empty = no verification tag |
| Sitemap generation | ✅ Code | Per-host `sitemap.xml` via `lib/site-sitemaps.ts` |
| Sitemap submitted to GSC | ❓ **Manual** | Cannot verify from code — check Search Console per property |
| Wrong-domain links | ✅ Fixed | Was trust/conversion leak on SaaS |
| Mobile speed | ❓ **Manual** | Run PageSpeed per subdomain post-deploy |
| Redis crash loop | ⚠️ VPS | PM2 restart count ~5400+ — install Redis or remove `REDIS_URL` |

**Likely diagnosis (without live GSC/GA access):**
- **Technical:** Analytics probably not configured → traffic looks lower than reality
- **Discovery:** Sitemaps exist in code but may not be submitted/verified per subdomain in GSC
- **Conversion:** Wrong SaaS links were sending users to Canaan (now fixed in code; fix VPS `.env` too)

---

## 2. Color system

| Item | Status |
|------|--------|
| Primary brand | `#10b981` emerald — in `tailwind.config.ts`, `theme-color` meta, studio CSS |
| Shared tokens | ✅ Added `lib/brand-tokens.ts` |
| SaaS surface | Separate gold palette (`--saas-gold: #c4a36a`) — intentional product branding |
| Store surface | `--s-brand: #10b981` in `store.css` |
| One-off CTAs | Audit needed per-page — tools use dark "aff" theme, network uses `--nx-*` |

**Next pass:** Import `BRAND_CSS_VARS` into subdomain CSS files to reduce drift.

---

## 3. Design breakage

| Item | Status |
|------|--------|
| Duplicate footers | ✅ Fixed (SiteChrome host-aware) |
| "Loading services…" stuck | ✅ Improved — 12s timeout + static fallback services |
| Duplicate footers on network/discover | ✅ Prior sprint |

---

## 4. Mobile responsiveness

**Not fully audited in this pass** (requires browser/device testing). Priority areas flagged:
- Store filter sidebar
- SaaS pricing cards (3-col → stack)
- LanguageSwitcher with 22 locales on info/discover

---

## 5. SEO / GEO

| Item | Status |
|------|--------|
| Unique title/meta per page | ✅ Mostly via `pageMetadata()` |
| Sitemaps all routes | ✅ Prior sprint + public URL fix |
| robots.txt | ✅ Blocks admin; allows RSS |
| AI bots (GPTBot, etc.) | ✅ **Not blocked** — allowed by default |
| Schema.org | ⚠️ Partial — products, network tools; not all surfaces |
| llms.txt | ✅ Added `/llms.txt` per host |
| hreflang | ✅ Prior sprint |

---

## 6. SaaS login page

| Item | Status |
|------|--------|
| Design | ✅ Redesigned with SaasHeader, proper saas.css, legal links |
| noindex | ✅ robots.txt disallows `/saas/login` |
| End-to-end signup | ❌ **Stub only** — see section 7 |

---

## 7. Yegova codebase — what's actually deployed

**Finding: The full Yegova NestJS/Next monorepo (`yegova-saas/`) is NOT deployed at saas.ebenezerdigital.com.**

What is live:
- Marketing landing page (`app/saas/page.tsx`)
- Stub auth (`lib/saas-auth.ts`) — single env email/password, JWT cookie
- After login → redirects to `/saas` marketing page, **not** a billing app

What exists in repo but not wired:
- `yegova-saas/apps/api` — NestJS + Prisma (Invoice Studio, GST, Stock, etc.)
- `yegova-saas/apps/web` — separate Next billing UI

**Recommendation:** Deploy `yegova-saas` as separate PM2 process (or subdomain `billing.`) and point SaaS CTAs there — do not assume `/saas/login` is the real product yet.

---

## 8. Images

**Not audited in this pass.** Store product covers use gradient frames + Unsplash URLs in data. Portfolio includes Canaan images (correct for that client entry).

---

## Deploy after this commit

```bash
cd ~/jebathottam && git pull origin main
cp /home/dani/ebenezer-digital/data/store.json /tmp/store.json.bak
rsync -a --delete --exclude node_modules --exclude .next --exclude data/store.json \
  --exclude .env --exclude .env.local \
  ~/jebathottam/ebenezer-digital/ /home/dani/ebenezer-digital/
cp /tmp/store.json.bak /home/dani/ebenezer-digital/data/store.json
# Fix env if wrong:
# sed -i 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://ebenezerdigital.com|' /home/dani/ebenezer-digital/.env
cd /home/dani/ebenezer-digital && npm ci && npm run build && pm2 restart ebenezer-digital
```
