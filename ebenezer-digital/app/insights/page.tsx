import type { Metadata } from "next";
import Link from "next/link";
import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { loadArticles } from "@/lib/content-engine";
import { pageMetadata } from "@/lib/site-url";
import { SERVICE_LANDINGS } from "@/lib/services-catalog";

export const metadata: Metadata = pageMetadata({
  title: "Insights | Ebenezer Digital Services",
  description: "Professional articles on web development, e-commerce, and business automation.",
  path: "/insights",
});

export default function InsightsHubPage() {
  const posts = loadArticles("studio-insights");

  return (
    <StudioPageShell
      kicker="Insights"
      title="Studio insights"
      lead="Practical guides on web development, e-commerce, and automation — written for business owners and builders."
    >
      <section className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Related services</h2>
        <p className="mt-2 text-sm text-white/60">
          Each insight connects to a service we actually deliver.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SERVICE_LANDINGS.slice(0, 8).map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="inline-block rounded-full border border-emerald-500/30 px-3 py-1 text-sm text-emerald-300 hover:bg-emerald-500/10"
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {posts.length === 0 ? (
        <p className="text-white/60">New articles are being published. Check back soon.</p>
      ) : (
        <ul className="space-y-6 divide-y divide-white/10">
          {posts.map((p) => (
            <li key={p.slug} className="pt-6 first:pt-0">
              <Link href={`/insights/${p.slug}`} className="group block">
                <p className="text-xs uppercase tracking-widest text-emerald-400/80">{p.category}</p>
                <h2 className="mt-1 text-2xl font-semibold group-hover:text-emerald-300">{p.title}</h2>
                <p className="mt-2 text-white/60">{p.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </StudioPageShell>
  );
}
