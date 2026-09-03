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

  const xmlUrl = `${origin}/sitemap.xml`;

  return (
    <StudioPageShell
      kicker="Navigation"
      title="HTML Sitemap"
      lead="This page is for humans. It lists normal links — not XML, so there are no loc tags here."
    >
      <div className="mb-10 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-relaxed text-white/90">
        <p className="font-medium text-emerald-300">Google Search Console — submit this URL only:</p>
        <p className="mt-2 break-all">
          <a href={xmlUrl} className="text-emerald-400 underline hover:text-emerald-300">
            {xmlUrl}
          </a>
        </p>
        <p className="mt-2 text-white/60">
          Do <strong className="text-white/80">not</strong> submit{" "}
          <code className="text-white/70">/sitemap</code> or{" "}
          <code className="text-white/70">/sitemap.html</code> — those are HTML pages.
        </p>
      </div>
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
