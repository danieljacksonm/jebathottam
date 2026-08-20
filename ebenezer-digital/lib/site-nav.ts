import { JOURNAL_URL, SITE_URL, STORE_URL } from "./site-url";

/** Cross-domain navigation — use these in headers so menu clicks always reach the right site. */
export const SITE_NAV = {
  home: SITE_URL,
  services: `${SITE_URL}/services`,
  work: `${SITE_URL}/work`,
  contact: `${SITE_URL}/contact`,
  ai: `${SITE_URL}/ai`,
  saas: `${SITE_URL}/saas`,
  journal: `${JOURNAL_URL}/blog`,
  news: `${JOURNAL_URL}/blog/news`,
  store: `${STORE_URL}/products`,
  newsSitemap: `${JOURNAL_URL}/api/news/sitemap`,
  newsRss: `${JOURNAL_URL}/api/news/rss`,
} as const;

export function journalCategoryHref(category: string) {
  return `${JOURNAL_URL}/blog?cat=${encodeURIComponent(category)}`;
}

export function newsDeskHref(desk: string) {
  return `${JOURNAL_URL}/blog/news#desk-${desk.toLowerCase()}`;
}
