export type ContentChannel = "tools" | "studio" | "store" | "discover";

export const CHANNEL_ARTICLE_TARGET = 100_000;

export type FactoryArticle = {
  channel: ContentChannel;
  index: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
};

export type ChannelMeta = {
  channel: ContentChannel;
  prefix: string;
  label: string;
  basePath: string;
  hostKind: "tools" | "studio" | "store" | "discover";
};

export const CHANNEL_META: Record<ContentChannel, ChannelMeta> = {
  tools: {
    channel: "tools",
    prefix: "tg",
    label: "Tool guides",
    basePath: "/tools/blog",
    hostKind: "tools",
  },
  studio: {
    channel: "studio",
    prefix: "sg",
    label: "Service guides",
    basePath: "/guides",
    hostKind: "studio",
  },
  store: {
    channel: "store",
    prefix: "pg",
    label: "Product guides",
    basePath: "/products/blog",
    hostKind: "store",
  },
  discover: {
    channel: "discover",
    prefix: "hg",
    label: "Hardware guides",
    basePath: "/discover/blog",
    hostKind: "discover",
  },
};
