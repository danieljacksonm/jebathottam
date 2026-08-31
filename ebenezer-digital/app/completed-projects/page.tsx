"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/site-url";

type Item = {
  id: string;
  title: string;
  clientName: string;
  description: string;
  result?: string;
  coverImage: string;
  techStack: string[];
};

export default function CompletedProjectsPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.portfolio || []).filter(
          (p: Item & { projectPhase?: string }) => (p.projectPhase || "completed") === "completed"
        );
        setItems(list);
      })
      .catch(() => setItems([]));
  }, []);

  return (
    <main className="min-h-screen bg-[#070708] pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <Link href="/work" className="text-[11px] uppercase tracking-[0.18em] text-[var(--st-muted)] hover:text-white">
          ← View all work
        </Link>
        <p className="studio-kicker mt-8">Portfolio</p>
        <h1 className="studio-display mt-4 text-4xl sm:text-5xl">Completed projects</h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">
          Delivered client work across web, billing systems, and digital operations.
        </p>

        <div className="mt-12 space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 border border-[var(--st-line)] p-4 sm:flex-row sm:items-center sm:p-6"
            >
              <div className="relative h-28 w-full shrink-0 overflow-hidden sm:h-24 sm:w-40">
                <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="160px" />
              </div>
              <div className="sm:min-w-[140px]">
                <p className="font-semibold text-white">{item.clientName}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-emerald-400/80">
                  {(item.techStack || []).slice(0, 2).join(" · ") || "Web"}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--st-muted)]">{item.result || item.description}</p>
              </div>
            </article>
          ))}
          {items.length === 0 ? (
            <p className="text-[var(--st-muted)]">Loading completed projects…</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
