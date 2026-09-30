import packs from "@/data/i18n/news-articles.json";

type NewsTr = {
  title: string;
  dek: string;
  body: string[];
  region?: string;
  topic?: string;
};

const PACKS = packs as Record<string, Record<string, NewsTr>>;

export function localizeNewsFields<
  T extends {
    slug: string;
    title: string;
    dek: string;
    body: string[];
    region?: string;
    topic?: string;
  },
>(item: T, locale: string): T {
  if (!locale || locale === "en") return item;
  const row = PACKS[locale]?.[item.slug];
  if (!row?.title || !row.dek || !row.body?.length) return item;
  return {
    ...item,
    title: row.title,
    dek: row.dek,
    body: row.body,
    region: row.region || item.region,
    topic: row.topic || item.topic,
  };
}
