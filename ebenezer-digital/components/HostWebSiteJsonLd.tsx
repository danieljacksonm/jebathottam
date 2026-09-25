import { headers } from "next/headers";
import {
  AI_URL,
  DISCOVER_URL,
  INFO_URL,
  NETWORK_URL,
  originForKind,
  requestHostFromHeaders,
  SAAS_URL,
  siteKindFromHost,
  SITE_URL,
  TOOLS_URL,
  type SiteKind,
} from "@/lib/site-url";

const HOST_SITE: Partial<
  Record<SiteKind, { name: string; description: string; url: string }>
> = {
  ai: {
    name: "Eben AI",
    description: "Private, calm AI by Ebenezer Digital.",
    url: AI_URL,
  },
  saas: {
    name: "Yegova Billing",
    description: "Free cloud billing for traders and shops.",
    url: SAAS_URL,
  },
  discover: {
    name: "Ebenezer Discover",
    description: "Find the right Ebenezer solution for your need.",
    url: DISCOVER_URL,
  },
  info: {
    name: "Ebenezer Digital Information",
    description: "News, stories and useful ideas for the digital world.",
    url: INFO_URL,
  },
  network: {
    name: "Ebenezer Digital Network",
    description: "Free online tools for developers, creators and businesses.",
    url: NETWORK_URL,
  },
  tools: {
    name: "Ebenezer Tools",
    description: "Compare software and AI tools for your business.",
    url: TOOLS_URL,
  },
};

/**
 * WebSite JSON-LD for hosts that lack a dedicated schema layout.
 * Studio uses RootJsonLd; news/journal/store define their own.
 */
export function HostWebSiteJsonLd({ kind: forced }: { kind?: SiteKind } = {}) {
  const kind = forced ?? siteKindFromHost(requestHostFromHeaders(headers()));
  const site = HOST_SITE[kind];
  if (!site) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url || originForKind(kind),
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: "Ebenezer Digital Services",
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
