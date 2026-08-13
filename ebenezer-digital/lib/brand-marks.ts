/** E + symbol marks for Ebenezer products */

export const E_MARKS = {
  studio: "/brand/eben-mark.svg",
  ai: "/brand/eben-ai-mark.svg",
  news: "/brand/ebenezer-news-mark.svg",
  journal: "/brand/ebenezer-journal-mark.svg",
  store: "/brand/ebenezer-store-mark.svg",
  software: "/brand/e-software.svg",
  "ui kits": "/brand/e-ui.svg",
  "business tools": "/brand/e-tools.svg",
  templates: "/brand/e-templates.svg",
  ebooks: "/brand/e-ebooks.svg",
  graphics: "/brand/e-graphics.svg",
  bundles: "/brand/e-bundles.svg",
  freebies: "/brand/e-freebies.svg",
} as const;

export function markForCategory(category: string): string {
  const key = category.trim().toLowerCase() as keyof typeof E_MARKS;
  return E_MARKS[key] || E_MARKS.store;
}
