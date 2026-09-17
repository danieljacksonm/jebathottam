# Ebenezer Digital — Architecture Report

Generated as Phase 0 of the Global Multilingual & SEO plan. **Read-only inventory** — no production changes implied.

## Applications

| App | Path | Runtime | Port (VPS) |
|-----|------|---------|------------|
| Main ecosystem | `ebenezer-digital/` | Next.js 14.2 | 3000 |
| Yegova SaaS API | `yegova-saas/apps/api` | NestJS + Prisma SQLite | 4000 |
| Yegova SaaS Web | `yegova-saas/apps/web` | Next.js | 3004 |

## Domains → SiteKind → Internal routes

| Public host | SiteKind | Internal base |
|-------------|----------|---------------|
| ebenezerdigital.com | studio | `/`, `/services`, `/insights`, `/work` |
| ebenezerdigital.info | info | `/info/*` |
| journal.ebenezerdigital.info | journal | `/blog`, `/blog/[slug]` |
| news.ebenezerdigital.info | news | `/blog/news/*` |
| ebenezerdigital.net | network | `/network/tools/*` |
| ebenezerdigital.store | store | `/products/*` |
| tools.ebenezerdigital.com | tools | `/tools/*` |
| saas.ebenezerdigital.com | saas | `/saas/*` (+ nginx split to Yegova) |
| ai.ebenezerdigital.com | ai | `/ai` |
| discover.ebenezerdigital.com | discover | `/discover` |
| products.ebenezerdigital.com | products | `/catalog/*` |

Routing: [`middleware.ts`](../middleware.ts), canonical URLs: [`lib/ecosystem-urls.ts`](../lib/ecosystem-urls.ts), [`lib/site-url.ts`](../lib/site-url.ts).

## Content sources

| Type | Primary source | Secondary |
|------|----------------|-----------|
| Journal | Prisma `JournalPost`, `lib/edu-blog.ts` | `data/store.json` blogPosts, `data/content/*.article.json` |
| News | Live wire, file archive, Prisma `NewsArticle` | CMS seed |
| Store products | `app/products/data.ts` | `data/store.json` digitalProducts |
| .net tools | `lib/network/registry.ts` (~45 live) | — |
| Affiliate tools | `app/tools/discovery-tools.ts` | — |
| Services | `app/services/[slug]/page.tsx` + `data/store.json` | — |
| SaaS | `app/saas/` marketing | Yegova monorepo |

## Multilingual (before plan implementation)

- **22 locale codes** in `SEO_LOCALES`; URL prefix `/{locale}/path`
- **Published for SEO:** English only (`PUBLISHED_HREFLANG_LOCALES = ["en"]`)
- Non-published locales: 301 to English or `noindex`
- Store UI partial i18n; **no translated article bodies**
- News: English-only by design

## SEO infrastructure

- Dynamic `robots.txt`, per-host `sitemap.xml`, chunked `/sitemaps/[id]`
- Google News sitemap on news host only
- Audit scripts: `npm run audit:quality`, `audit:site`, `audit:all`
- GSC verification meta per kind via `gscVerificationForKind()`

## GSC ~0 views — hypotheses to verify

1. Sitemaps not submitted per GSC property (11 hosts)
2. Large edu journal corpus excluded from sitemap (by design)
3. News traffic only visible on news.* property
4. Recent server instability / malware history
5. Env pollution (`canaantravelhub.com` in `.env.local`) — fix on VPS
6. Locale shells previously noindex (correct until real translations)

## Performance risks

- News desk SSR + file archive merge (mitigated: memo TTL, cron off hot path)
- Large sitemap generation (mitigated: chunking, cache headers)
- Prisma optional — app falls back to JSON/archive

## Safety constraints (plan)

- No nginx/DNS/PM2 changes without explicit approval
- Additive DB migrations only
- No deletion of existing routes/content
- Locale publish gated via `NEXT_PUBLIC_EBEN_I18N_PUBLISHED_LOCALES`
