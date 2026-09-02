import { headers } from "next/headers";
import { CANONICAL_URLS } from "@/lib/ecosystem-urls";
import { originForKind, siteKindFromHost } from "@/lib/site-url";

type LlmsBlock = {
  title: string;
  tagline: string;
  sections: Record<string, string[]>;
};

function block(origin: string, b: LlmsBlock): string {
  const lines = [`# ${b.title}`, "", `> ${b.tagline}`, ""];
  for (const [heading, items] of Object.entries(b.sections)) {
    lines.push(`## ${heading}`, "");
    for (const item of items) lines.push(`- ${item}`);
    lines.push("");
  }
  lines.push(`Site: ${origin}`);
  return lines.join("\n");
}

/** llms.txt — machine-readable site summary for AI crawlers (llmstxt.org convention). */
export async function GET() {
  const kind = siteKindFromHost(headers().get("host"));
  const origin = originForKind(kind);

  const discovery = {
    Sitemaps: [
      `[XML Sitemap](${origin}/sitemap.xml)`,
      `[HTML Sitemap](${origin}/sitemap.html)`,
    ],
    "AI & feeds": [`[LLMs.txt](${origin}/llms.txt)`],
  };

  const ecosystem = {
    Ecosystem: Object.entries(CANONICAL_URLS).map(
      ([name, url]) => `[${name}](${url})`
    ),
  };

  const blocks: Record<string, LlmsBlock> = {
    studio: {
      title: "Ebenezer Digital Services",
      tagline:
        "Custom websites, software, data entry, travel support, and AI for businesses worldwide.",
      sections: {
        ...discovery,
        Contact: [`[Contact](${CANONICAL_URLS.studio}/contact)`],
        Products: [
          `[Store](${CANONICAL_URLS.store})`,
          `[SaaS billing](${CANONICAL_URLS.saas})`,
          `[Free tools](${CANONICAL_URLS.network})`,
          `[AI assistant](${CANONICAL_URLS.ai})`,
        ],
        ...ecosystem,
      },
    },
    saas: {
      title: "Yegova Billing (Ebenezer SaaS)",
      tagline:
        "Free cloud billing for Indian shops — GST invoices, stock, party ledger, thermal print, reports.",
      sections: {
        ...discovery,
        App: [
          `[Register](${CANONICAL_URLS.saas}/register)`,
          `[Sign in](${CANONICAL_URLS.saas}/login)`,
        ],
        Company: [`[Ebenezer Digital](${CANONICAL_URLS.studio})`],
        ...ecosystem,
      },
    },
    store: {
      title: "Ebenezer Store",
      tagline: "Ready-made digital products — templates, software kits, and tools with instant access.",
      sections: { ...discovery, ...ecosystem },
    },
    tools: {
      title: "Ebenezer Tools",
      tagline: "Compare AI tools, SaaS, and software for business use.",
      sections: { ...discovery, ...ecosystem },
    },
    network: {
      title: "Ebenezer Digital Network",
      tagline: "Free online tools for developers, creators, and businesses.",
      sections: {
        ...discovery,
        Tools: [`[All tools](${CANONICAL_URLS.network}/tools)`],
        ...ecosystem,
      },
    },
    info: {
      title: "Ebenezer Digital Information",
      tagline: "News and journal hub for the Ebenezer ecosystem.",
      sections: { ...discovery, ...ecosystem },
    },
    journal: {
      title: "Ebenezer Journal",
      tagline: "Long-form stories, guides, and ideas.",
      sections: {
        ...discovery,
        Feeds: [`[RSS](${CANONICAL_URLS.journal}/api/blog/rss)`],
        ...ecosystem,
      },
    },
    news: {
      title: "Ebenezer News",
      tagline: "World news desk with regional coverage.",
      sections: {
        ...discovery,
        Feeds: [
          `[RSS](${CANONICAL_URLS.news}/api/news/rss)`,
          `[News XML sitemap](${CANONICAL_URLS.news}/api/news/sitemap)`,
        ],
        ...ecosystem,
      },
    },
    products: {
      title: "Ebenezer Products (Hardware catalog)",
      tagline: "Laptop and electronics research and comparisons.",
      sections: { ...discovery, ...ecosystem },
    },
    ai: {
      title: "Ebenezer AI (Eben)",
      tagline: "AI assistant across the Ebenezer ecosystem.",
      sections: { ...discovery, ...ecosystem },
    },
    discover: {
      title: "Ebenezer Discover",
      tagline: "Intent router — find the right Ebenezer product for your goal.",
      sections: { ...discovery, ...ecosystem },
    },
  };

  const spec = blocks[kind];
  const body = spec
    ? block(origin, spec)
    : `# Ebenezer Digital\n\n> ${origin}\n\n## Sitemaps\n\n- [XML](${origin}/sitemap.xml)\n- [HTML](${origin}/sitemap.html)\n`;

  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
