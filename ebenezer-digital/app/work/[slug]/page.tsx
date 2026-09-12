import type { Metadata } from "next";
import Image from "next/image";
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
  const gallery = (project.galleryImages || []).filter(Boolean).slice(0, 6);
  const pageUrl = `${SITE_URL}/work/${slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url: pageUrl,
      image: project.coverImage || undefined,
      creator: { "@type": "Organization", name: "Ebenezer Digital", url: SITE_URL },
      about: project.clientName,
      keywords: project.category?.join(", ") || undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/work` },
        { "@type": "ListItem", position: 3, name: project.title, item: pageUrl },
      ],
    },
  ];

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.16em] text-white/40">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/work" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400">
              Work
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-white/70" aria-current="page">
            {project.title}
          </li>
        </ol>
      </nav>

      <p className="studio-kicker mt-10">Case study</p>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-emerald-400/80">
        {project.clientName}
        {project.projectPhase ? ` · ${project.projectPhase}` : ""}
        {project.category?.length ? ` · ${project.category.join(" · ")}` : ""}
      </p>
      <h1 className="studio-display mt-3 max-w-4xl text-5xl sm:text-7xl">{project.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">{project.description}</p>

      {project.coverImage ? (
        <div className="relative mt-12 aspect-[16/9] max-w-5xl overflow-hidden bg-[#111]">
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        {project.challenge ? (
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-emerald-400">Problem</h2>
            <p className="mt-3 text-[var(--st-muted)] leading-relaxed">{project.challenge}</p>
          </section>
        ) : null}
        {project.solution ? (
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-emerald-400">Approach</h2>
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
        <section className="mt-14">
          <h2 className="text-sm uppercase tracking-[0.18em] text-emerald-400">Technology</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <li key={t} className="border border-[var(--st-line)] px-3 py-1.5 text-xs text-white/70">
                {t}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="mt-14">
          <h2 className="text-sm uppercase tracking-[0.18em] text-emerald-400">Screenshots</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {gallery.map((src) => (
              <div key={src} className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                <Image src={src} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14 border border-[var(--st-line)] p-6 sm:p-8" aria-labelledby="case-cta">
        <h2 id="case-cta" className="studio-display text-2xl sm:text-3xl">
          Start a similar project
        </h2>
        <p className="mt-3 max-w-xl text-[var(--st-muted)]">
          Tell us what you need built — websites, shop systems, ministry tools, or business automation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="studio-btn">
            Start a project →
          </Link>
          <Link href="/work" className="studio-btn studio-btn-ghost">
            View work
          </Link>
          <Link href="/services" className="studio-btn studio-btn-ghost">
            Explore services
          </Link>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-btn studio-btn-ghost"
            >
              View live site
            </a>
          ) : null}
        </div>
      </section>

      {related.length ? (
        <section className="mt-20 border-t border-[var(--st-line)] pt-12">
          <h2 className="studio-display text-3xl">Related work</h2>
          <ul className="mt-8 space-y-4">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/work/${portfolioSlug(p)}`}
                  className="underline hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
                >
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
