import Link from "next/link";
import type { Metadata } from "next";
import { loadArticles } from "@/lib/content-engine";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Guides | Ebenezer Digital Information",
  description: "Explainers and digital knowledge guides from Ebenezer Digital Information.",
  path: "/info/guides",
});

export default function InfoGuidesIndexPage() {
  const guides = loadArticles("info-guides").filter((g) => g.indexable !== false);

  return (
    <div className="info-page">
      <p className="info-kicker">Guides</p>
      <h1 className="info-title">Explainers &amp; digital knowledge</h1>
      <p className="info-lead mt-3">
        Practical guides hosted on ebenezerdigital.info — not a copy of the News desk.
      </p>
      <ul className="mt-10 space-y-6">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`} className="info-story-title hover:underline">
              {g.title}
            </Link>
            <p className="info-story-dek mt-1">{g.excerpt}</p>
          </li>
        ))}
        {guides.length === 0 ? <li className="info-lead">No guides published yet.</li> : null}
      </ul>
    </div>
  );
}
