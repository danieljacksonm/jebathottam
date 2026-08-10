"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimateSection, AnimateOne } from "../components/AnimateOnScroll";
import ScrollParallax from "../components/ScrollParallax";

type Item = {
  id: string;
  title: string;
  clientName: string;
  description: string;
  result?: string;
  coverImage: string;
  techStack: string[];
  projectPhase?: string;
};

export default function CompletedProjectsPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.portfolio || []).filter(
          (p: Item) => (p.projectPhase || "completed") === "completed"
        );
        setItems(list);
      })
      .catch(() => setItems([]));
  }, []);

  return (
    <ScrollParallax>
      <section className="section-padding pt-[5.25rem] border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="section-reveal container-wide">
          <AnimateOne variant="from-right">
            <p className="section-intro-p text-[var(--accent)] font-display font-semibold text-sm uppercase tracking-widest mb-3">
              Portfolio
            </p>
            <h1 className="section-h2-reveal font-display text-3xl sm:text-4xl font-bold text-[var(--text)] mb-4">
              Completed client projects
            </h1>
            <p className="section-sub-p text-[var(--text-muted)] max-w-2xl mb-16">
              Delivered work across ministry sites, education counselling, and business billing systems.
            </p>
          </AnimateOne>
          <AnimateSection variant="stagger-slow" className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="aos-item card-dark rounded-xl p-4 sm:p-6 border border-[var(--border)] card-shine-bottom flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
              >
                <div className="relative w-full sm:w-40 h-28 sm:h-24 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <div className="sm:min-w-[160px]">
                  <p className="font-display font-semibold text-[var(--text)]">{item.clientName}</p>
                  <p className="text-[var(--accent)] text-xs uppercase tracking-wider mt-0.5">
                    {(item.techStack || []).slice(0, 2).join(" · ") || "Web"}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text)]">{item.title}</p>
                  <p className="text-[var(--text-muted)] text-sm mt-1">
                    {item.result || item.description}
                  </p>
                </div>
              </div>
            ))}
          </AnimateSection>
          {items.length === 0 && (
            <p className="text-[var(--text-muted)]">Loading completed projects…</p>
          )}
        </div>
      </section>
    </ScrollParallax>
  );
}
