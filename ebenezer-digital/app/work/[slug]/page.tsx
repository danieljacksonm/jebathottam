import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { pageMetadata, SITE_URL } from "@/lib/site-url";
import { findPortfolioBySlug, portfolioSlug } from "@/lib/portfolio-slug";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const items = await db.getPortfolio(true);
  const project = findPortfolioBySlug(items, params.slug);
  if (!project) return { title: "Case study | Ebenezer Digital", robots: { index: false } };
  return pageMetadata({
    title: `${project.title} | Case study`,
    description: project.description.slice(0, 160),
    path: `/work/${portfolioSlug(project)}`,
  });
}

export default async function WorkCaseStudyPage({ params }: Props) {
  const items = await db.getPortfolio(true);
  const project = findPortfolioBySlug(items, params.slug);
  if (!project) notFound();

  const slug = portfolioSlug(project);
  const related = items.filter((p) => p.id !== project.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/work/${slug}`,
    creator: { "@type": "Organization", name: "Ebenezer Digital" },
    about: project.clientName,
  };

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="studio-kicker">Case study</p>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-emerald-400/80">
        {project.clientName}
        {project.projectPhase ? ` · ${project.projectPhase}` : ""}
      </p>
      <h1 className="studio-display mt-3 max-w-4xl text-5xl sm:text-7xl">{project.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">{project.description}</p>

      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        {project.challenge ? (
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-emerald-400">Challenge</h2>
            <p className="mt-3 text-[var(--st-muted)] leading-relaxed">{project.challenge}</p>
          </section>
        ) : null}
        {project.solution ? (
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-emerald-400">Solution</h2>
            <p className="mt-3 text-[var(--st-muted)] leading-relaxed">{project.solution}</p>
          </section>
        ) : null}
        {project.result ? (
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-emerald-400">Outcome</h2>
            <p className="mt-3 text-[var(--st-muted)] leading-relaxed">{project.result}</p>
            <p className="mt-2 text-xs text-white/35">
              Qualitative outcome only — we do not invent percentage metrics.
            </p>
          </section>
        ) : null}
      </div>

      {project.techStack?.length ? (
        <p className="mt-10 text-sm text-white/40">Stack: {project.techStack.join(" · ")}</p>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            View live
          </a>
        ) : null}
        <Link href="/work" className="underline hover:text-white">
          All work
        </Link>
        <Link href="/contact" className="underline hover:text-white">
          Start a project
        </Link>
      </div>

      {related.length ? (
        <section className="mt-20 border-t border-[var(--st-line)] pt-12">
          <h2 className="studio-display text-3xl">Related work</h2>
          <ul className="mt-8 space-y-4">
            {related.map((p) => (
              <li key={p.id}>
                <Link href={`/work/${portfolioSlug(p)}`} className="underline hover:text-white">
                  {p.title}
                </Link>
                <span className="text-[var(--st-muted)]"> — {p.clientName}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
