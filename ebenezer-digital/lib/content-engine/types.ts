export type ContentSurface =
  | "studio-insights"
  | "journal"
  | "tools-guides"
  | "network-guides"
  | "store-guides"
  | "catalog-guides"
  | "info-guides";

export type ContentTier = "pillar" | "standard";

export type ContentTopic = {
  id: string;
  surface: ContentSurface;
  title: string;
  slug: string;
  category: string;
  tier: ContentTier;
  keywords: string[];
  wordTarget: number;
};

export type GeneratedArticle = {
  id: string;
  surface: ContentSurface;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tier: ContentTier;
  wordCount: number;
  coverImage?: string;
  imageCredit?: string;
  publishedAt: string;
  indexable: boolean;
  qualityScore: number;
  /** Draft-only pipeline — review before publishing to CMS */
  status?: "draft" | "published";
};
