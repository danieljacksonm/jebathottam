"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { portfolioSlug } from "@/lib/portfolio-slug";
import { useLocalePath, useStudioSiteCopy } from "@/lib/i18n/use-shell-messages";

type Project = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  techStack: string[];
  liveUrl?: string;
  projectPhase?: "ongoing" | "completed";
  clientName?: string;
};

export default function WorkPage() {
  const copy = useStudioSiteCopy();
  const w = copy.work;
  const common = copy.common;
  const lp = useLocalePath();
  const filters = useMemo(
    () =>
      [
        ["all", common.all],
        ["ongoing", common.ongoing],
        ["completed", common.completed],
      ] as const,
    [common]
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.portfolio || []).map((p: Project & { category?: string[] }) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          coverImage: p.coverImage,
          techStack: p.techStack || [],
          liveUrl: p.liveUrl,
          projectPhase: p.projectPhase || "completed",
          clientName: p.clientName,
        }));
        setProjects(list);
      })
      .catch(() => setProjects([]));
  }, []);

  const visible = filter === "all" ? projects : projects.filter((p) => p.projectPhase === filter);

  return (
    <main className="bg-[#070708] pt-28">
      <section className="px-4 sm:px-8 lg:px-10">
        <p className="studio-kicker">{w.kicker}</p>
        <h1 className="studio-display mt-4 text-6xl sm:text-8xl">
          {w.titleLine1}
          <br />
          {w.titleLine2}
        </h1>
        <p className="mt-6 max-w-2xl text-[var(--st-muted)]">{w.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label="Filter projects">
          {filters.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={`min-h-[44px] border px-4 py-2 text-[11px] uppercase tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 ${
                filter === id
                  ? "border-emerald-400 text-emerald-300"
                  : "border-[var(--st-line)] text-white/40 hover:text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-12">
        {visible.map((project, index) => {
          const href = lp(`/work/${portfolioSlug(project)}`);
          return (
            <article
              key={project.id}
              className="border-t border-[var(--st-line)] px-4 py-12 sm:px-8 lg:px-10"
            >
              <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <Link
                  href={href}
                  className="group relative block aspect-[16/10] overflow-hidden bg-[#111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
                  data-cursor="VIEW"
                >
                  <Image
                    src={project.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </Link>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400">
                    {common.project} {String(index + 1).padStart(2, "0")} · {project.projectPhase}
                  </p>
                  {project.clientName ? (
                    <p className="mt-2 text-sm text-white/50">{project.clientName}</p>
                  ) : null}
                  <h2 className="studio-display mt-3 text-4xl sm:text-5xl">
                    <Link
                      href={href}
                      className="hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
                    >
                      {project.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-[var(--st-muted)]">{project.description}</p>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-white/35">
                    {(project.techStack || []).slice(0, 5).join(" · ")}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      href={href}
                      className="text-sm uppercase tracking-[0.16em] text-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
                    >
                      {w.caseStudy}
                    </Link>
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm uppercase tracking-[0.16em] text-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400"
                      >
                        {w.viewLive}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        {visible.length === 0 ? (
          <p className="px-4 py-16 text-center text-[var(--st-muted)]" role="status">
            {projects.length === 0 ? w.loading : w.emptyFilter}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-16">
        <Link href={lp("/contact")} className="studio-btn inline-flex" data-cursor="START">
          {copy.studio.startProject}
        </Link>
        <Link href={lp("/services")} className="studio-btn studio-btn-ghost inline-flex">
          {common.exploreServices}
        </Link>
      </div>
    </main>
  );
}
