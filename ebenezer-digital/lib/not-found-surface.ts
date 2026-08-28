import type { SiteKind } from "@/lib/site-url";
import {
  AI_URL,
  DISCOVER_URL,
  INFO_URL,
  JOURNAL_URL,
  NETWORK_URL,
  NEWS_URL,
  PRODUCTS_URL,
  SAAS_URL,
  SITE_URL,
  STORE_URL,
  TOOLS_URL,
} from "@/lib/site-url";

export type NotFoundLink = { href: string; label: string; external?: boolean };

export type NotFoundSurface = {
  brand: string;
  headline: string;
  hint: string;
  home: NotFoundLink;
  links: NotFoundLink[];
  theme: "studio" | "network" | "news";
};

export function notFoundSurfaceForKind(kind: SiteKind): NotFoundSurface {
  if (kind === "network") {
    return {
      brand: "Ebenezer Digital Network",
      headline: "That page doesn't exist — but we probably have a tool for it.",
      hint: "Search the catalog, browse tools, or head home.",
      home: { href: `${NETWORK_URL}/tools`, label: "Browse tools" },
      links: [
        { href: `${NETWORK_URL}/tools`, label: "All tools" },
        { href: `${NETWORK_URL}/finder`, label: "Tool finder" },
        { href: `${NETWORK_URL}/guides`, label: "Guides" },
      ],
      theme: "network",
    };
  }

  if (kind === "news") {
    return {
      brand: "Ebenezer News",
      headline: "This story or page couldn't be found.",
      hint: "It may have moved or is no longer in our recent archive.",
      home: { href: NEWS_URL, label: "News home" },
      links: [
        { href: JOURNAL_URL, label: "Journal", external: true },
        { href: INFO_URL, label: "Information", external: true },
        { href: `${NEWS_URL}/blog/newsroom/feeds`, label: "RSS & feeds" },
      ],
      theme: "news",
    };
  }

  if (kind === "journal") {
    return {
      brand: "Ebenezer Journal",
      headline: "We couldn't find that article.",
      hint: "Browse recent stories or visit the information gateway.",
      home: { href: JOURNAL_URL, label: "Journal home" },
      links: [
        { href: NEWS_URL, label: "News", external: true },
        { href: INFO_URL, label: "Information", external: true },
        { href: NETWORK_URL, label: "Free tools", external: true },
      ],
      theme: "news",
    };
  }

  if (kind === "store") {
    return {
      brand: "Ebenezer Store",
      headline: "That product or page doesn't exist.",
      hint: "Browse the store or explore free tools.",
      home: { href: `${STORE_URL}/products`, label: "Store home" },
      links: [
        { href: TOOLS_URL, label: "Software tools", external: true },
        { href: NETWORK_URL, label: "Free tools", external: true },
        { href: SITE_URL, label: "Services", external: true },
      ],
      theme: "studio",
    };
  }

  if (kind === "products") {
    return {
      brand: "Ebenezer Products",
      headline: "That product page couldn't be found.",
      hint: "Browse the catalog or compare categories.",
      home: { href: `${PRODUCTS_URL}/catalog`, label: "Catalog home" },
      links: [
        { href: `${PRODUCTS_URL}/catalog/compare`, label: "Compare" },
        { href: STORE_URL, label: "Digital store", external: true },
        { href: TOOLS_URL, label: "Software tools", external: true },
      ],
      theme: "studio",
    };
  }

  if (kind === "tools") {
    return {
      brand: "Ebenezer Tools",
      headline: "That tool page couldn't be found.",
      hint: "Browse comparisons or try our free tool network.",
      home: { href: TOOLS_URL, label: "Tools home" },
      links: [
        { href: `${TOOLS_URL}/compare`, label: "Compare tools" },
        { href: NETWORK_URL, label: "Free online tools", external: true },
        { href: PRODUCTS_URL, label: "Products", external: true },
      ],
      theme: "studio",
    };
  }

  if (kind === "info") {
    return {
      brand: "Ebenezer Digital Information",
      headline: "That information page doesn't exist.",
      hint: "Search across news and journal, or return home.",
      home: { href: INFO_URL, label: "Gateway home" },
      links: [
        { href: `${INFO_URL}/search`, label: "Search" },
        { href: NEWS_URL, label: "News", external: true },
        { href: JOURNAL_URL, label: "Journal", external: true },
      ],
      theme: "news",
    };
  }

  if (kind === "ai") {
    return {
      brand: "Ebenezer AI",
      headline: "That AI page couldn't be found.",
      hint: "Return to the studio or explore tools.",
      home: { href: AI_URL, label: "AI home" },
      links: [
        { href: NETWORK_URL, label: "Free tools", external: true },
        { href: DISCOVER_URL, label: "Discover", external: true },
        { href: SITE_URL, label: "Services", external: true },
      ],
      theme: "studio",
    };
  }

  if (kind === "saas") {
    return {
      brand: "Yegova",
      headline: "That page couldn't be found.",
      hint: "Return to the SaaS landing or contact us.",
      home: { href: SAAS_URL, label: "Yegova home" },
      links: [
        { href: `${STORE_URL}/products/ebenezer-saas`, label: "Product page", external: true },
        { href: SITE_URL, label: "Ebenezer Digital", external: true },
      ],
      theme: "studio",
    };
  }

  if (kind === "discover") {
    return {
      brand: "Ebenezer Discover",
      headline: "We couldn't route that request.",
      hint: "Try the discover home or browse tools directly.",
      home: { href: DISCOVER_URL, label: "Discover home" },
      links: [
        { href: TOOLS_URL, label: "Tools", external: true },
        { href: NETWORK_URL, label: "Free tools", external: true },
        { href: SITE_URL, label: "Services", external: true },
      ],
      theme: "studio",
    };
  }

  return {
    brand: "Ebenezer Digital Services",
    headline: "We couldn't find that page.",
    hint: "The link may be old, or the page may have moved.",
    home: { href: SITE_URL, label: "Home" },
    links: [
      { href: NEWS_URL, label: "News", external: true },
      { href: JOURNAL_URL, label: "Journal", external: true },
      { href: NETWORK_URL, label: "Free tools", external: true },
      { href: `${SITE_URL}/contact`, label: "Contact" },
    ],
    theme: "studio",
  };
}
