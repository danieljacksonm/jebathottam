# Ebenezer Growth Execution Plan

Status: **code complete** for the platform. Google/Microsoft still need a one-time human submit (links below).

## Phase 1 — Separate SaaS login — DONE

- SaaS login: `/saas/login`
- Cookie: `saas-auth-token` (not store, not admin)
- Env: `SAAS_LOGIN_EMAIL`, `SAAS_LOGIN_PASSWORD`, `SAAS_JWT_SECRET`

## Phase 2 — Language UX — DONE

- Custom language picker on Journal and News (no Google Translate bar)
- Reader languages: English + Indian languages + ES/FR/AR
- Google chrome is hidden globally

## Phase 3 — 1000+ blogs — DONE in engine

- Educational catalog in `lib/edu-blog.ts` generates 1000+ unique lesson URLs
- Each lesson is a long, detailed article (FAQ + India example + steps)
- Unique related images in the gallery and **in between** article sections
- Internal “continue the chain” links on every post

## Phase 4 — News in many languages — DONE (reader layer)

- Same quiet language picker on `/blog/news`
- Source language stays English for SEO quality
- Readers can switch Hindi, Tamil, and more in the header

## Phase 5 — Distribution — DONE technically

Submit these after deploy:

- News RSS: `https://ebenezerdigital.info/api/news/rss`
- News sitemap: `https://ebenezerdigital.info/api/news/sitemap`
- Journal RSS: `https://ebenezerdigital.info/api/blog/rss`
- HTML sitemap: `https://ebenezerdigital.info/sitemap.xml`
- Guide page: `/blog/newsroom/feeds`

Also live:

- `/blog/newsroom/about`
- `/blog/newsroom/editorial-policy`
- `/blog/newsroom/contact`
- NewsArticle + NewsMediaOrganization JSON-LD

**You still do by hand (cannot be coded):**

1. Google Search Console → add sitemaps
2. Google Publisher Center → add publication
3. Bing Webmaster Tools → verify + submit RSS/sitemap

## Phase 6 — Quality gate

- Do not dump 1000 low-quality AI pages on one day beyond the lesson engine
- Lesson engine is structured teaching, not spam news
- News stays live-wire + CMS with sources
