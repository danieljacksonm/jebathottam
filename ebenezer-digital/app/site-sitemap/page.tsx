import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { SITE_NAV } from "@/lib/site-nav";
import { BILLING_LOGIN_PATH } from "@/lib/billing-url";
import { originForKind, pageMetadata, siteKindFromHost, type SiteKind } from "@/lib/site-url";

function sectionsForKind(kind: SiteKind): { label: string; href: string }[] {
  const common = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "XML Sitemap", href: "/sitemap.xml" },
  ];

  const map: Record<SiteKind, { label: string; href: string }[]> = {
    studio: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "Contact", href: "/contact" },
      { label: "Insights", href: "/insights" },
      ...common,
    ],
    info: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Search", href: "/search" },
      { label: "News", href: SITE_NAV.news },
      { label: "Journal", href: SITE_NAV.journal },
      ...common,
    ],
    journal: [
      { label: "Journal Home", href: "/" },
      { label: "News", href: SITE_NAV.news },
      { label: "Studio", href: SITE_NAV.home },
      ...common,
    ],
    news: [
      { label: "News Home", href: "/" },
      { label: "Newsroom", href: "/blog/newsroom/about" },
      { label: "Journal", href: SITE_NAV.journal },
      ...common,
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    ],
    store: [
      { label: "Store Home", href: "/" },
      { label: "Roadmap", href: "/products/roadmap" },
      ...common,
    ],
    products: [
      { label: "Catalog Home", href: "/" },
      { label: "Compare", href: "/catalog/compare" },
      { label: "Guides", href: "/catalog/guides" },
      ...common,
    ],
    tools: [
      { label: "Tools Home", href: "/" },
      { label: "Guides", href: "/tools/guides" },
      ...common,
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    ],
    ai: [
      { label: "AI Home", href: "/" },
      { label: "Studio", href: SITE_NAV.home },
      ...common,
    ],
    saas: [
      { label: "Yegova Home", href: "/" },
      { label: "Sign in", href: BILLING_LOGIN_PATH },
      { label: "Register", href: "/register" },
      ...common,
    ],
    discover: [
      { label: "Discover Home", href: "/" },
      { label: "Store", href: SITE_NAV.store },
      { label: "Tools", href: SITE_NAV.tools },
      ...common,
    ],
    network: [
      { label: "Network Home", href: "/" },
      { label: "All Tools", href: "/tools" },
      { label: "Guides", href: "/guides" },
      { label: "Developers", href: "/developers" },
      ...common,
      { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    ],
  };

  return map[kind];
}

export async function generateMetadata(): Promise<Metadata> {
  const kind = siteKindFromHost(headers().get("host"));
  const path =
    kind === "info"
      ? "/info/sitemap"
      : kind === "journal"
        ? "/blog/sitemap"
        : kind === "news"
          ? "/blog/news/sitemap"
          : kind === "store"
            ? "/products/sitemap"
            : kind === "products"
              ? "/catalog/sitemap"
              : kind === "tools"
                ? "/tools/sitemap"
                : kind === "network"
                  ? "/network/sitemap"
                  : "/sitemap";
  return pageMetadata({
    title: "Sitemap | Ebenezer Digital",
    description: "Browse all main sections on this site.",
    path,
  });
}

export default function HtmlSitemapPage() {
  const kind = siteKindFromHost(headers().get("host"));
  const origin = originForKind(kind);
  const links = sectionsForKind(kind);

  return (
    <StudioPageShell kicker="Navigation" title="Sitemap" lead="Main pages on this site.">
      <ul className="space-y-3">
        {links.map((l) => {
          const external = l.href.startsWith("http");
          const href = external ? l.href : l.href;
          return (
            <li key={l.label}>
              {external ? (
                <a href={href} className="text-emerald-400 hover:underline">
                  {l.label}
                </a>
              ) : (
                <Link href={href} className="text-emerald-400 hover:underline">
                  {l.label}
                </Link>
              )}
              <span className="ml-2 text-sm text-white/40">
                {external ? href : `${origin}${href === "/" ? "" : href}`}
              </span>
            </li>
          );
        })}
      </ul>
    </StudioPageShell>
  );
}
