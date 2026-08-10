"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";
import ClipReveal from "../components/ClipReveal";

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

  const visible =
    filter === "all" ? projects : projects.filter((p) => p.projectPhase === filter);

  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] bg-[var(--bg-soft)] border-t border-[var(--border)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-right">
            <ClipReveal direction="right" delay={100}>
              <h1 className="headline-blur-in section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-center lg:text-left mb-4">
                Our work
              </h1>
            </ClipReveal>
            <p className="section-sub-p text-[var(--text-muted)] text-center lg:text-left max-w-2xl mb-8">
              Ongoing builds and completed projects for real clients — ministry platforms, shop systems, travel sites, and business tools.
            </p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-12">
              {(
                [
                  ["all", "All"],
                  ["ongoing", "Ongoing"],
                  ["completed", "Completed"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium border ${
                    filter === id
                      ? "bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-muted)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </AnimateOne>
          <AnimateSection variant="zoom-in" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((project) => (
              <div
                key={project.id}
                className="aos-item card-dark card-work card-work-hover rounded-xl overflow-hidden border-l-4 border-l-[var(--accent)]"
              >
                <div className="relative aspect-video w-full overflow-hidden img-reveal-wrap img-hover-overlay">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover card-work-img"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="work-type-badge badge-pop text-xs font-medium text-[var(--accent)] uppercase tracking-wider">
                      {project.projectPhase === "ongoing" ? "Ongoing" : "Completed"}
                    </span>
                    {project.clientName && (
                      <span className="text-xs text-[var(--text-muted)]">{project.clientName}</span>
                    )}
                  </div>
                  <h2 className="work-card-title-hover font-display text-lg font-semibold text-[var(--text)] mt-1 mb-3">
                    {project.title}
                  </h2>
                  <p className="work-card-desc card-desc-hover text-[var(--text-muted)] text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                      View live site →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </AnimateSection>
          {visible.length === 0 && (
            <p className="text-center text-[var(--text-muted)] py-12">Loading projects…</p>
          )}
        </div>
      </section>
    </ScrollParallax>
  );
}
