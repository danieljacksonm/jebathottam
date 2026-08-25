# Ebenezer Digital — Subdomains & SEO URL map

Use **subdomains** for each product surface (not path-on-.com).

## Required DNS / SSL hosts

| Subdomain / domain | Purpose | App path (internal) |
|--------------------|---------|---------------------|
| `ebenezerdigital.com` | Studio / services | `/` |
| `ai.ebenezerdigital.com` | Eben AI | `/ai` |
| `saas.ebenezerdigital.com` | SaaS / Yegova landing | `/saas` |
| `discover.ebenezerdigital.com` | Find / intent router | `/discover` |
| `ebenezerdigital.info` | Information Network gateway | `/info` |
| `journal.ebenezerdigital.info` | Journal (blogs) | `/blog` |
| `news.ebenezerdigital.info` | News channel | `/blog/news` |
| `ebenezerdigital.store` | Digital store | `/products` |
| `products.ebenezerdigital.com` | Hardware catalog | `/catalog` |
| `tools.ebenezerdigital.com` | Software / AI affiliate compare | `/tools` |
| `ebenezerdigital.net` | Free tools Network | `/network` (pretty `/tools/*` on host) |
| `billing.ebenezerdigital.com` | Yegova SaaS (separate app) | — |

Optional alias: `deals.ebenezerdigital.com` → same as tools.

## Env vars

```bash
NEXT_PUBLIC_SITE_URL=https://ebenezerdigital.com
NEXT_PUBLIC_INFO_URL=https://ebenezerdigital.info
NEXT_PUBLIC_JOURNAL_URL=https://journal.ebenezerdigital.info
NEXT_PUBLIC_NEWS_URL=https://news.ebenezerdigital.info
NEXT_PUBLIC_STORE_URL=https://ebenezerdigital.store
NEXT_PUBLIC_PRODUCTS_URL=https://products.ebenezerdigital.com
NEXT_PUBLIC_TOOLS_URL=https://tools.ebenezerdigital.com
NEXT_PUBLIC_AI_URL=https://ai.ebenezerdigital.com
NEXT_PUBLIC_SAAS_URL=https://saas.ebenezerdigital.com
NEXT_PUBLIC_DISCOVER_URL=https://discover.ebenezerdigital.com
NEXT_PUBLIC_NETWORK_URL=https://ebenezerdigital.net
NEXT_PUBLIC_BILLING_URL=https://billing.ebenezerdigital.com
```

## Language URLs (journal + news + store)

Each locale has its **own URL**:

- English (default): `https://news.ebenezerdigital.info/blog/news/{slug}`
- Hindi: `https://news.ebenezerdigital.info/hi/blog/news/{slug}`
- Tamil: `https://news.ebenezerdigital.info/ta/blog/news/{slug}`
- …same for all 22 `SEO_LOCALES`

Journal examples:

- `https://ebenezerdigital.info/blog/{slug}`
- `https://ebenezerdigital.info/hi/blog/{slug}`

**Sitemap behavior**

- Host-aware `/sitemap.xml`
- Index pages include `hreflang` alternates for all locales
- Each article is listed once (EN canonical URL); HTML metadata still advertises language alternates
- News Google sitemap: `https://news.ebenezerdigital.info/api/news/sitemap`

## Live redirects (already in middleware)

- `ebenezerdigital.info/` → Information gateway (`/info`)
- `ebenezerdigital.info/blog…` → `journal.ebenezerdigital.info…`
- `ebenezerdigital.com/ai` → `ai.ebenezerdigital.com`
- `ebenezerdigital.com/saas` → `saas.ebenezerdigital.com`
- `ebenezerdigital.com/discover` → `discover.ebenezerdigital.com`
- `ebenezerdigital.info/blog/news…` → `news.ebenezerdigital.info/blog/news…`

## Nginx note

Point new hosts (`ai.`, `discover.`, `news.`, `journal.`) at the same Next.js upstream on **port 80 only** first.

**Do not** add `listen 443` / `ssl_certificate` lines until Certbot has created the PEM files. If nginx already references missing certs, `nginx -t` fails and Certbot cannot run.

Fix: comment out every `server { listen 443 ... }` block that points at missing `/etc/letsencrypt/live/...` paths, reload nginx, then run Certbot. Certbot will add HTTPS itself.
