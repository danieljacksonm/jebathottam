import {
  AI_URL,
  DISCOVER_URL,
  INFO_URL,
  JOURNAL_URL,
  NETWORK_URL,
  NEWS_URL,
  SAAS_URL,
  SITE_URL,
  STORE_URL,
  TOOLS_URL,
  PRODUCTS_URL,
} from "./site-url";

/** Cross-domain navigation — always point to the correct host (subdomain-first). */
export const SITE_NAV = {
  home: SITE_URL,
  services: `${SITE_URL}/services`,
  work: `${SITE_URL}/work`,
  contact: `${SITE_URL}/contact`,
  ai: AI_URL,
  saas: SAAS_URL,
  discover: DISCOVER_URL,
  info: INFO_URL,
  infoAbout: `${INFO_URL}/about`,
  infoSearch: `${INFO_URL}/search`,
  infoContact: `${INFO_URL}/contact`,
  journal: JOURNAL_URL,
  news: NEWS_URL,
  store: STORE_URL,
  tools: TOOLS_URL,
  products: PRODUCTS_URL,
  network: NETWORK_URL,
  newsSitemap: `${NEWS_URL}/api/news/sitemap`,
  newsRss: `${NEWS_URL}/api/news/rss`,
} as const;

export function journalCategoryHref(category: string) {
  return `${JOURNAL_URL}/blog?cat=${encodeURIComponent(category)}`;
}

export function newsDeskHref(desk: string) {
  return `${NEWS_URL}/blog/news#desk-${desk.toLowerCase()}`;
}

export function newsArticleHref(slug: string) {
  return `${NEWS_URL}/blog/news/${slug}`;
}

export function journalArticleHref(slug: string) {
  return `${JOURNAL_URL}/blog/${slug}`;
}
