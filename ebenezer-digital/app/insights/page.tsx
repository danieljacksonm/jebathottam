import type { Metadata } from "next";
import Link from "next/link";
import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { loadArticles } from "@/lib/content-engine";
import { pageMetadata } from "@/lib/site-url";

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
