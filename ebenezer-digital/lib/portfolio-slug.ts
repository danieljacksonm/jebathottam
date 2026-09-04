import { slugifyNewsTitle } from "@/lib/news-url";
import type { PortfolioItem } from "@/lib/db";

/** Stable public slug for a portfolio / case-study item. */
export function portfolioSlug(item: Pick<PortfolioItem, "id" | "title" | "clientName">): string {
  const fromTitle = slugifyNewsTitle(`${item.clientName}-${item.title}`, 64);
  return fromTitle || item.id;
}

export function findPortfolioBySlug(
  items: PortfolioItem[],
  slug: string
): PortfolioItem | undefined {
  return items.find((p) => portfolioSlug(p) === slug || p.id === slug);
}
