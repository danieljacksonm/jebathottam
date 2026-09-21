"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocalePath, useStudioSiteCopy } from "@/lib/i18n/use-shell-messages";

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
  liveUrl?: string;
  projectPhase?: "ongoing" | "completed";
  clientName?: string;
};

export default function Portfolio() {
  const copy = useStudioSiteCopy();
  const p = copy.portfolio;
  const common = copy.common;
  const lp = useLocalePath();

  const categories = useMemo(
    () => [
      { id: "all", label: common.all },
      { id: "ongoing", label: common.ongoing },
      { id: "completed", label: common.completed },
      { id: "web", label: common.web },
      { id: "travel", label: common.travel },
    ],
    [common]
  );

  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.portfolio || []).map((item: {
          id: string;
          title: string;
          description: string;
          category: string[];
          techStack: string[];
          coverImage?: string;
          liveUrl?: string;
          projectPhase?: "ongoing" | "completed";
          clientName?: string;
        }) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: (item.category && item.category[0]) || "web",
          tags: item.techStack || [],
          coverImage: item.coverImage || "/images/portfolio/canaan-cover.png",
          liveUrl: item.liveUrl,
          projectPhase: item.projectPhase || "completed",
          clientName: item.clientName,
        }));
        setProjects(list);
      })
      .catch(() => setProjects([]));
  }, []);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : activeCategory === "ongoing" || activeCategory === "completed"
        ? projects.filter((project) => project.projectPhase === activeCategory)
        : projects.filter((project) => project.category === activeCategory);

  return (
    <section id="work" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <p className="studio-kicker">{p.kicker}</p>
        <h2 className="studio-display mt-4 text-6xl sm:text-8xl">
          {p.titleLine1}
          <br />
          {p.titleLine2}
          <br />
          {p.titleLine3}
        </h2>
        <p className="mt-6 max-w-xl text-[var(--st-muted)]">{p.intro}</p>
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`border px-4 py-2 text-[11px] uppercase tracking-[0.18em] ${
                activeCategory === category.id
                  ? "border-emerald-400 text-emerald-300"
                  : "border-[var(--st-line)] text-[var(--st-muted)]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 space-y-0">
        {filteredProjects.map((project, index) => (
          <article
            key={project.id}
            className="border-t border-[var(--st-line)] px-4 py-10 sm:px-8 lg:px-10"
          >
            <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <Link
                href={project.liveUrl || lp("/work")}
                target={project.liveUrl ? "_blank" : undefined}
                rel={project.liveUrl ? "noopener noreferrer" : undefined}
                className="group relative block aspect-[16/10] overflow-hidden bg-[#111]"
                data-cursor="VIEW"
              >
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </Link>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400">
                  {common.project} {String(index + 1).padStart(2, "0")} · {project.projectPhase}
                </p>
                {project.clientName && (
                  <p className="mt-2 text-sm text-white/50">{project.clientName}</p>
                )}
                <h3 className="studio-display mt-3 text-4xl sm:text-5xl">{project.title}</h3>
                <p className="mt-4 text-[var(--st-muted)]">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-[0.16em] text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={lp("/work")} className="mt-6 inline-block text-sm uppercase tracking-[0.16em] text-emerald-400">
                  {common.viewCaseStudy}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="px-4 pt-8 text-center sm:px-8">
        <Link href={lp("/work")} className="studio-btn studio-btn-ghost inline-flex" data-cursor="OPEN">
          {common.seeHowWeBuild}
        </Link>
      </div>
    </section>
  );
}
