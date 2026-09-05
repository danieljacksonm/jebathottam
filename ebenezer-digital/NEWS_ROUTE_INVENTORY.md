# NEWS ROUTE INVENTORY

**Date:** 2026-09-04  
**App:** Single Next.js 14 app (`ebenezer-digital`) multi-host via middleware `SiteKind`  
**CMS:** `data/store.json` + live RSS/Guardian + `data/news-sitemap-archive.json`

## Root cause of duplication

1. One App Router tree serves all hosts (`ebenezerdigital.com`, `.store`, `tools…`, `news…`, etc.).
2. News UI lives at internal path `/blog/news/*`.
3. Without host gates, every hostname could render the same News pages.
4. Historical slug generation used **source URLs** → public slugs like `www-thehindu-com-…`.
5. Locale middleware (`/kn/`, `/pa/`, …) rewrote the same English News HTML under many prefixes (soft duplicates).

## Canonical ownership

| Property | Host | News articles indexable? |
|----------|------|---------------------------|
| News | `news.ebenezerdigital.info` | **YES — sole owner** |
| Main | `ebenezerdigital.com` | No — redirect to News |
| Store | `ebenezerdigital.store` | No — redirect to News |
| Tools | `tools.ebenezerdigital.com` | No — redirect to News |
| Journal | `journal.ebenezerdigital.info` | No — redirect News paths |

## Chosen public URL architecture

```text
https://news.ebenezerdigital.info/{category}/{slug}
```

Examples: `/world/…`, `/india/…`, `/technology/…`

Internal App Router path (unchanged): `/blog/news/[slug]`

## Route patterns

| Pattern | Domain(s) | Content source | Indexable? | Action |
|---------|-----------|----------------|------------|--------|
| `/blog/news` | non-News hosts | News home | No | **301** → `news…/` |
| `/blog/news/{slug}` | non-News hosts | Article | No | **301** → `news…/{category}/{slug}` (via strip + resolve) |
| `/blog/news` | News host | — | No | **301** → `/` |
| `/blog/news/{slug}` | News host | — | No | **301** → `/{slug}` then category canonical |
| `/{category}/{slug}` | News host | Article | Yes | Rewrite → `/blog/news/{slug}` |
| `/{slug}` | News host | Article | Soft | Rewrite; page **301** → `/{category}/{slug}` |
| `/kn|/pa|/hi/…/blog/news*` | any | Soft locale | No | Foreign gate + News host strips locale |
| `/blog/newsroom/*` | non-News | Newsroom | No | **301** → News `/newsroom/*` |
| `/api/news/*` | any host hitting app | Feeds/API | N/A | Links must use News absolute URLs |

## Content sources

| Source | Identity | Notes |
|--------|----------|-------|
| Live RSS / Guardian | `origin: live` | Title-based slug; `originalUrl` metadata |
| CMS (`store.json`) | `origin: cms` | Admin-managed |
| Seed `WORLD_NEWS` | `origin: seed` | Fallback when wire thin |
| Sitemap archive | file JSON | 7-day retention; must not re-emit legacy www-* as canonical |

## Sitemap ownership

| Sitemap host | May include News article URLs? |
|--------------|--------------------------------|
| `news.ebenezerdigital.info` | Yes — category canonicals only |
| Main / Store / Tools / Journal | **No** |

## Locale notes

`SEO_LOCALES` includes `kn`, `pa`, etc. These are **not** verified News translations.  
On the News host, non-`en` prefixes **301** to the English path. Article metadata already uses `en` + `x-default` only.
