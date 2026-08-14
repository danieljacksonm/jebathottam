"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

  const visible = filter === "all" ? projects : projects.filter((p) => p.projectPhase === filter);

  return (
    <main className="bg-[#070708] pt-28">
      <section className="px-4 sm:px-8 lg:px-10">
        <p className="studio-kicker">Work</p>
        <h1 className="studio-display mt-4 text-6xl sm:text-8xl">
          OUR
          <br />
          WORK.
        </h1>
        <p className="mt-6 max-w-2xl text-[var(--st-muted)]">
          Ongoing builds and completed projects for real clients — ministry platforms, shop systems, travel sites, and business tools.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {([
            ["all", "All"],
            ["ongoing", "Ongoing"],
            ["completed", "Completed"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`border px-4 py-2 text-[11px] uppercase tracking-[0.18em] ${
                filter === id ? "border-emerald-400 text-emerald-300" : "border-[var(--st-line)] text-white/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-12">
        {visible.map((project, index) => (
          <article key={project.id} className="border-t border-[var(--st-line)] px-4 py-12 sm:px-8 lg:px-10">
            <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <a
                href={project.liveUrl || "#"}
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
              </a>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400">
                  Project {String(index + 1).padStart(2, "0")} · {project.projectPhase}
                </p>
                {project.clientName && <p className="mt-2 text-sm text-white/50">{project.clientName}</p>}
                <h2 className="studio-display mt-3 text-4xl sm:text-5xl">{project.title}</h2>
                <p className="mt-4 text-[var(--st-muted)]">{project.description}</p>
                <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-white/35">
                  {(project.techStack || []).slice(0, 5).join(" · ")}
                </p>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-sm uppercase tracking-[0.16em] text-emerald-400"
                  >
                    View live site →
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
        {visible.length === 0 && (
          <p className="px-4 py-16 text-center text-[var(--st-muted)]">Loading projects…</p>
        )}
      </div>

      <div className="px-4 py-16 text-center">
        <Link href="/contact" className="studio-btn inline-flex" data-cursor="START">
          Start a project →
        </Link>
      </div>
    </main>
  );
}
