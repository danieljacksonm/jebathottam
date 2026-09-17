import { TOOLS } from "@/app/tools/data";
import { SERVICE_LANDINGS } from "@/lib/services-catalog";
import { STORE_PRODUCTS } from "@/app/products/data";
import { CATALOG_CATEGORIES } from "@/app/catalog/data";
import { SITE_NAV } from "@/lib/site-nav";
import type { ContentChannel, FactoryArticle } from "./types";
import {
  AUDIENCES,
  EXPLAINER_ANGLES,
  HARDWARE_BRANDS,
  HARDWARE_SCENARIOS,
  indexToCoords,
} from "./matrix";
import { indexToSlug, slugToIndex } from "./slug";

import { STUDIO_TOPICS, STORE_TOPICS } from "./matrix";

function isoDate(index: number): string {
  const d = new Date("2025-06-01T08:00:00.000Z");
  d.setUTCDate(d.getUTCDate() + (index % 800));
  d.setUTCHours(6 + (index % 12), index % 60, 0, 0);
  return d.toISOString();
}

function angleHeading(angle: string): string {
  const map: Record<string, string> = {
    overview: "Overview",
    "how-to": "How to use",
    pricing: "Pricing explained",
    alternatives: "Alternatives",
    "pros-cons": "Pros and cons",
    "for-beginners": "For beginners",
    faq: "FAQ",
  };
  return map[angle] || angle;
}

function buildToolsArticle(index: number, slug: string): FactoryArticle {
  const [ti, ai, audi] = indexToCoords("tools", index);
  const tool = TOOLS[ti % TOOLS.length];
  const angle = EXPLAINER_ANGLES[ai % EXPLAINER_ANGLES.length];
  const audience = AUDIENCES[audi % AUDIENCES.length];
  const title = `${tool.name} for ${audience}: ${angleHeading(angle)}`;
  const excerpt = `${angleHeading(angle)} for ${tool.name} — written for ${audience}. Honest notes on pricing, fit, and alternatives.`;
  const content = `## ${title}

${tool.description}

## Who this guide is for

This article is written for **${audience}** evaluating **${tool.name}** (${tool.category}).

## ${angleHeading(angle)}

${angle === "pricing" ? `Pricing notes: ${tool.pricing.free ? tool.pricing.freeLabel || "Free tier available" : "Paid plans apply"}. ${tool.pricing.paidLabel || tool.pricing.paid || "Check official pricing before you buy."} Last editorial check: ${tool.pricingVerifiedAt || tool.lastUpdated || "see tool page"}.` : ""}
${angle === "pros-cons" ? `**Pros:** ${tool.pros.slice(0, 4).join("; ")}. **Cons:** ${tool.cons.slice(0, 3).join("; ")}.` : ""}
${angle === "alternatives" ? `Compare similar tools in the same category on [Ebenezer Tools](${SITE_NAV.tools}) before committing.` : ""}
${angle === "for-beginners" ? `Start with the official site, use the free tier if available, and define one simple workflow before adding complexity.` : ""}
${angle === "how-to" ? `1. Sign up on the official site. 2. Complete one real task in your business. 3. Compare results with your current process.` : ""}
${angle === "overview" ? `${tool.tagline} Best for: ${tool.bestFor}.` : ""}
${angle === "faq" ? `**Is ${tool.name} right for ${audience}?** It fits when ${tool.bestFor.toLowerCase()}. Avoid if ${tool.whoShouldAvoid || tool.cons[0] || "requirements differ"}.` : ""}

## Official tool page

Read the full review: [${tool.name} on Ebenezer Tools](${SITE_NAV.tools}/tools/${tool.id})

## Related on Ebenezer

- [Compare tools](${SITE_NAV.tools}/tools/compare)
- [Free invoice generator](${SITE_NAV.tools}/tools/invoice-generator)
- [Ebenezer Journal](${SITE_NAV.journal}) for broader digital literacy guides

## FAQ

### Does Ebenezer guarantee rankings or earnings?
No. We explain tools honestly so you can decide.

### Are links affiliate links?
Some may be. See our affiliate disclosure on the tools site.
`;
  return {
    channel: "tools",
    index,
    slug,
    title,
    excerpt,
    content,
    category: `Tools · ${tool.category}`,
    tags: [tool.id, tool.category, angle, "tools-guide", "indexable"],
    publishedAt: isoDate(index),
    seoTitle: `${title} | Ebenezer Tools`,
    seoDescription: excerpt.slice(0, 155),
  };
}

function buildStudioArticle(index: number, slug: string): FactoryArticle {
  const coords = indexToCoords("studio", index);
  const si = coords[0];
  const ai = coords[1];
  const audi = coords[2];
  const topicIdx = coords[3] ?? 0;
  const service = SERVICE_LANDINGS[si % SERVICE_LANDINGS.length];
  const angle = EXPLAINER_ANGLES[ai % EXPLAINER_ANGLES.length];
  const audience = AUDIENCES[audi % AUDIENCES.length];
  const topic = STUDIO_TOPICS[topicIdx % STUDIO_TOPICS.length];
  const title = `${service.title} for ${audience}: ${topic}`;
  const excerpt = `${topic} — ${service.title} for ${audience}. ${service.value.slice(0, 120)}…`;
  const content = `## ${title}

${service.value}

## Who it is for

${service.forWho}

## ${topic}

This guide focuses on **${topic}** when hiring Ebenezer Digital for **${service.title}**.

### What we deliver

${service.capabilities.map((c) => `- ${c}`).join("\n")}

### How we work

${service.process.map((s, i) => `${i + 1}. ${s}`).join("\n")}

## ${angleHeading(angle)}

${angle === "faq" && service.faq.length ? service.faq.map((f) => `**${f.q}** ${f.a}`).join("\n\n") : `Contact us for a scoped conversation about ${service.title}.`}

## Hire Ebenezer Digital

[${service.title} service page](https://ebenezerdigital.com/services/${service.slug})

## Related

- [Ebenezer Insights](https://ebenezerdigital.com/insights)
- [Journal guides](${SITE_NAV.journal})
- [Network tools](${SITE_NAV.network})
`;
  return {
    channel: "studio",
    index,
    slug,
    title,
    excerpt,
    content,
    category: `Services · ${service.title}`,
    tags: [service.slug, topic, angle, "services-guide", "indexable"],
    publishedAt: isoDate(index),
    seoTitle: `${title} | Ebenezer Digital`,
    seoDescription: excerpt.slice(0, 155),
  };
}

function buildStoreArticle(index: number, slug: string): FactoryArticle {
  const coords = indexToCoords("store", index);
  const published = STORE_PRODUCTS.filter((p) => p.status === "published");
  const pi = coords[0];
  const ai = coords[1];
  const audi = coords[2];
  const topicIdx = coords[3] ?? 0;
  const product = published[pi % published.length];
  const angle = EXPLAINER_ANGLES[ai % EXPLAINER_ANGLES.length];
  const audience = AUDIENCES[audi % AUDIENCES.length];
  const topic = STORE_TOPICS[topicIdx % STORE_TOPICS.length];
  const title = `${product.name} for ${audience}: ${topic}`;
  const excerpt = `${topic} for ${product.name} — ${product.tagline}`;
  const content = `## ${title}

${product.description}

## Product snapshot

- **Category:** ${product.category}
- **Best for:** ${product.whoItIsFor || audience}
- **Tagline:** ${product.tagline}

## ${topic}

${angle === "pricing" ? `Price: ${product.isFree ? "Free" : `$${product.price}`}. See the store page for license options.` : ""}
${angle === "how-to" ? `After purchase you receive instant digital files. Follow the included README and open PDF previews on the product page before buying.` : ""}
${angle !== "pricing" && angle !== "how-to" ? product.story : ""}

### What's included

${product.includes.slice(0, 6).map((x) => `- ${x}`).join("\n")}

## Buy on Ebenezer Store

[${product.name} →](${SITE_NAV.store}/products/${product.slug})

## Related

- [Ebenezer SaaS](${SITE_NAV.saas}) for cloud billing
- [Free tools](${SITE_NAV.tools})
- [Journal product guides](${SITE_NAV.journal})
`;
  return {
    channel: "store",
    index,
    slug,
    title,
    excerpt,
    content,
    category: `Store · ${product.category}`,
    tags: [product.slug, topic, angle, "product-guide", "indexable"],
    publishedAt: isoDate(index),
    seoTitle: `${title} | Ebenezer Store`,
    seoDescription: excerpt.slice(0, 155),
  };
}

function buildDiscoverArticle(index: number, slug: string): FactoryArticle {
  const [ci, bi, ai, si] = indexToCoords("discover", index);
  const cat = CATALOG_CATEGORIES[ci % CATALOG_CATEGORIES.length];
  const brand = HARDWARE_BRANDS[bi % HARDWARE_BRANDS.length];
  const angle = EXPLAINER_ANGLES[ai % EXPLAINER_ANGLES.length];
  const scenario = HARDWARE_SCENARIOS[si % HARDWARE_SCENARIOS.length];
  const title = `${brand} ${cat.name} for ${scenario}: ${angleHeading(angle)}`;
  const excerpt = `Hardware guide: ${brand} ${cat.name.toLowerCase()} for ${scenario}. Specs, buying tips, and honest trade-offs.`;
  const content = `## ${title}

Choosing **${cat.name}** hardware for **${scenario}** means balancing budget, compatibility, and support. This guide uses **${brand}** as a reference brand in the ${cat.name} category.

## Category: ${cat.name}

${cat.description}

## Scenario: ${scenario}

We focus on what matters when the primary use case is **${scenario}** — not generic spec sheets.

## ${angleHeading(angle)}

- Compare wattage, ports, warranty, and regional availability before you buy.
- Check return policies and official service centres in your city.
- For India buyers, verify voltage (230V), GST invoice, and BIS marks where applicable.

## Browse hardware on Ebenezer Discover

- [Discover search](${SITE_NAV.discover})
- [Product catalog](${SITE_NAV.products}/catalog/${cat.slug})
- [Category: ${cat.name}](${SITE_NAV.products}/catalog/${cat.slug})

## Related tools

- [JSON Formatter](${SITE_NAV.network}/network/tools/json-formatter) for config files
- [Journal hardware literacy](${SITE_NAV.journal})

## Disclaimer

Prices and availability change. Verify on merchant sites before purchase. Sample catalog data may be illustrative during development.
`;
  return {
    channel: "discover",
    index,
    slug,
    title,
    excerpt,
    content,
    category: `Hardware · ${cat.name}`,
    tags: [cat.slug, brand.toLowerCase(), scenario, angle, "hardware-guide", "indexable"],
    publishedAt: isoDate(index),
    seoTitle: `${title} | Ebenezer Discover`,
    seoDescription: excerpt.slice(0, 155),
  };
}

export function buildFactoryArticle(channel: ContentChannel, index: number): FactoryArticle {
  const slug = indexToSlug(channel, index);
  switch (channel) {
    case "tools":
      return buildToolsArticle(index, slug);
    case "studio":
      return buildStudioArticle(index, slug);
    case "store":
      return buildStoreArticle(index, slug);
    case "discover":
      return buildDiscoverArticle(index, slug);
  }
}

export function getFactoryArticle(channel: ContentChannel, slug: string): FactoryArticle | null {
  const index = slugToIndex(channel, slug);
  if (index === null) return null;
  return buildFactoryArticle(channel, index);
}
