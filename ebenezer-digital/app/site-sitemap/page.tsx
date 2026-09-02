import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { htmlSitemapMetaPath, htmlSitemapSections } from "@/lib/html-sitemap";
import { originForKind, pageMetadata, siteKindFromHost } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const kind = siteKindFromHost(headers().get("host"));
  return pageMetadata({
    title: "Sitemap | Ebenezer Digital",
    description: "Browse all main sections, feeds, and discovery files on this site.",
    path: htmlSitemapMetaPath(kind),
  });
}

export default async function HtmlSitemapPage() {
  const kind = siteKindFromHost(headers().get("host"));
  const origin = originForKind(kind);
  const sections = await htmlSitemapSections(kind);

  return (
    <StudioPageShell
      kicker="Navigation"
      title="Sitemap"
      lead="Human-readable map of this site. Search engines should use sitemap.xml; AI systems can use llms.txt."
    >
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-4 text-lg font-semibold text-white">{section.title}</h2>
            <ul className="space-y-3">
              {section.links.map((l) => {
                const external = l.external || l.href.startsWith("http");
                const displayUrl = external ? l.href : `${origin}${l.href === "/" ? "" : l.href}`;
                return (
                  <li key={`${section.title}-${l.label}-${l.href}`}>
                    {external ? (
                      <a href={l.href} className="text-emerald-400 hover:underline">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-emerald-400 hover:underline">
                        {l.label}
                      </Link>
                    )}
                    <span className="ml-2 text-sm text-white/40">{displayUrl}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </StudioPageShell>
  );
}
