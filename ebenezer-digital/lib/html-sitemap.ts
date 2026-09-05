import { loadArticles } from "@/lib/content-engine";
import { db } from "@/lib/db";
import { getEduPosts } from "@/lib/edu-blog";
import { listPublicNewsForSitemap } from "@/lib/news-service";
import { newsPublicUrl } from "@/lib/news-url";
import { BILLING_LOGIN_PATH } from "@/lib/billing-url";
import { SITE_NAV } from "@/lib/site-nav";
import { CANONICAL_URLS } from "@/lib/ecosystem-urls";
import {
  originForKind,
  publicUrlForInternalPath,
  type SiteKind,
} from "@/lib/site-url";

export type HtmlSitemapLink = { label: string; href: string; external?: boolean };

export type HtmlSitemapSection = {
  title: string;
  links: HtmlSitemapLink[];
};

function abs(kind: SiteKind, internalPath: string): string {
  return publicUrlForInternalPath(internalPath, kind);
}

export function htmlSitemapMetaPath(kind: SiteKind): string {
  const map: Record<SiteKind, string> = {
    studio: "/sitemap",
    info: "/info/sitemap",
    journal: "/blog/sitemap",
    news: "/blog/news/sitemap",
    store: "/products/sitemap",
    products: "/catalog/sitemap",
    tools: "/tools/sitemap",
    ai: "/ai/sitemap",
    saas: "/saas/sitemap",
    discover: "/discover/sitemap",
    network: "/network/sitemap",
  };
  return map[kind];
}

export function staticHtmlSitemapSections(kind: SiteKind): HtmlSitemapSection[] {
  const origin = originForKind(kind);
  const machine = [
    { label: "XML Sitemap (search engines)", href: `${origin}/sitemap.xml` },
    { label: "HTML Sitemap (this page)", href: `${origin}/sitemap.html` },
    { label: "LLMs.txt (AI crawlers)", href: `${origin}/llms.txt` },
  ];

  const legal: HtmlSitemapLink[] = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ];

  const ecosystem: HtmlSitemapLink[] = [
    { label: "Ebenezer Digital (studio)", href: CANONICAL_URLS.studio, external: true },
    { label: "Ebenezer Store", href: CANONICAL_URLS.store, external: true },
    { label: "Ebenezer SaaS / Yegova", href: CANONICAL_URLS.saas, external: true },
    { label: "Ebenezer Network (free tools)", href: CANONICAL_URLS.network, external: true },
    { label: "Ebenezer AI", href: CANONICAL_URLS.ai, external: true },
    { label: "Ebenezer Journal", href: CANONICAL_URLS.journal, external: true },
    { label: "Ebenezer News", href: CANONICAL_URLS.news, external: true },
  ];

  const byKind: Record<SiteKind, HtmlSitemapSection[]> = {
    studio: [
      {
        title: "Main",
        links: [
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Work", href: "/work" },
          { label: "Contact", href: "/contact" },
          { label: "Insights", href: "/insights" },
          ...legal,
        ],
      },
    ],
    info: [
      {
        title: "Information network",
        links: [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Search", href: "/search" },
          { label: "News", href: SITE_NAV.news, external: true },
          { label: "Journal", href: SITE_NAV.journal, external: true },
          ...legal,
        ],
      },
    ],
    journal: [
      {
        title: "Journal",
        links: [
          { label: "Journal Home", href: "/" },
          { label: "News", href: SITE_NAV.news, external: true },
          { label: "Studio", href: SITE_NAV.home, external: true },
          { label: "Journal RSS", href: `${origin}/api/blog/rss`, external: true },
          ...legal,
        ],
      },
    ],
    news: [
      {
        title: "News desk",
        links: [
          { label: "News Home", href: "/" },
          { label: "Newsroom", href: "/blog/newsroom/about" },
          { label: "Journal", href: SITE_NAV.journal, external: true },
          { label: "News RSS", href: `${origin}/api/news/rss`, external: true },
          { label: "News XML Sitemap", href: `${origin}/api/news/sitemap`, external: true },
          { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
          ...legal,
        ],
      },
    ],
    store: [
      {
        title: "Store",
        links: [
          { label: "Store Home", href: "/" },
          { label: "Roadmap", href: "/products/roadmap" },
          ...legal,
        ],
      },
    ],
    products: [
      {
        title: "Hardware catalog",
        links: [
          { label: "Catalog Home", href: "/" },
          { label: "Compare", href: "/catalog/compare" },
          { label: "Guides", href: "/catalog/guides" },
          ...legal,
        ],
      },
    ],
    tools: [
      {
        title: "Tools hub",
        links: [
          { label: "Tools Home", href: "/" },
          { label: "Guides", href: "/tools/guides" },
          { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
          ...legal,
        ],
      },
    ],
    ai: [
      {
        title: "Ebenezer AI",
        links: [
          { label: "AI Home", href: "/" },
          { label: "Studio", href: SITE_NAV.home, external: true },
          ...legal,
        ],
      },
    ],
    saas: [
      {
        title: "Yegova billing",
        links: [
          { label: "Marketing home", href: "/" },
          { label: "Sign in", href: BILLING_LOGIN_PATH },
          { label: "Register", href: "/register" },
          ...legal,
        ],
      },
    ],
    discover: [
      {
        title: "Discover",
        links: [
          { label: "Discover Home", href: "/" },
          { label: "Store", href: SITE_NAV.store, external: true },
          { label: "Tools", href: SITE_NAV.tools, external: true },
          ...legal,
        ],
      },
    ],
    network: [
      {
        title: "Network",
        links: [
          { label: "Network Home", href: "/" },
          { label: "All Tools", href: "/tools" },
          { label: "Guides", href: "/guides" },
          { label: "Developers", href: "/developers" },
          { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
          ...legal,
        ],
      },
    ],
  };

  return [
    { title: "Discovery & GEO", links: machine },
    ...byKind[kind],
    { title: "Ebenezer ecosystem", links: ecosystem },
  ];
}

const RECENT_LIMIT = 40;

export async function dynamicHtmlSitemapSection(kind: SiteKind): Promise<HtmlSitemapSection | null> {
  if (kind === "journal") {
    const links: HtmlSitemapLink[] = [];
    const seen = new Set<string>();
    try {
      const cms = await db.getBlogPosts(true, { includeEdu: false });
      for (const p of cms.slice(0, RECENT_LIMIT)) {
        if (seen.has(p.slug)) continue;
        seen.add(p.slug);
        links.push({
          label: p.title,
          href: abs("journal", `/blog/${p.slug}`),
          external: true,
        });
      }
    } catch {
      /* CMS optional on VPS */
    }
    for (const p of getEduPosts().slice(0, RECENT_LIMIT)) {
      if (seen.has(p.slug) || links.length >= RECENT_LIMIT) continue;
      seen.add(p.slug);
      links.push({
        label: p.title,
        href: abs("journal", `/blog/${p.slug}`),
        external: true,
      });
    }
    return links.length ? { title: "Recent journal stories", links } : null;
  }

  if (kind === "news") {
    try {
      const news = await listPublicNewsForSitemap();
      const links = news.slice(0, RECENT_LIMIT).map((n) => ({
        label: n.title,
        href: newsPublicUrl(n.region, n.slug),
        external: true,
      }));
      return links.length ? { title: "Recent news stories", links } : null;
    } catch {
      return null;
    }
  }

  if (kind === "info") {
    const links = loadArticles("info-guides")
      .slice(0, RECENT_LIMIT)
      .map((p) => ({
        label: p.title,
        href: abs("info", `/info/guides/${p.slug}`),
        external: true,
      }));
    return links.length ? { title: "Guides", links } : null;
  }

  if (kind === "studio") {
    const links = loadArticles("studio-insights")
      .slice(0, RECENT_LIMIT)
      .map((p) => ({
        label: p.title,
        href: abs("studio", `/insights/${p.slug}`),
        external: true,
      }));
    return links.length ? { title: "Insights", links } : null;
  }

  return null;
}

export async function htmlSitemapSections(kind: SiteKind): Promise<HtmlSitemapSection[]> {
  const sections = staticHtmlSitemapSections(kind);
  const dynamic = await dynamicHtmlSitemapSection(kind);
  if (dynamic) sections.splice(1, 0, dynamic);
  return sections;
}
