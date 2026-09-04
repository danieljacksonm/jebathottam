"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  category: "digital" | "travel" | "web" | "other";
};

const categoryMeta: Record<string, { label: string; scene: string }> = {
  digital: { label: "Digital & admin", scene: "Admin desks, data, and day-to-day operations." },
  travel: { label: "Travel & booking", scene: "Itineraries, tickets, and booking support." },
  web: { label: "Web & technical", scene: "Websites, apps, and systems that ship." },
  other: { label: "Other services", scene: "Support work around the core product." },
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [active, setActive] = useState<string>("web");

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(() => setServices([]));
  }, []);

  const blocks = useMemo(() => {
    return (["digital", "travel", "web", "other"] as const)
      .map((key) => {
        const items = services.filter((s) => s.category === key);
        if (!items.length) return null;
        return { id: key, ...categoryMeta[key], items };
      })
      .filter(Boolean) as Array<{
      id: string;
      label: string;
      scene: string;
      items: ServiceItem[];
    }>;
  }, [services]);

  const current = blocks.find((b) => b.id === active) || blocks[0];

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">Services</p>
      <h1 className="studio-display mt-4 text-6xl sm:text-8xl">
        WHAT
        <br />
        WE DO.
      </h1>
      <p className="mt-6 max-w-2xl text-[var(--st-muted)]">
        From admin tasks to web development and travel support — a range of digital services tailored to your needs.
      </p>

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        {[
          ["web-development", "Web development"],
          ["saas-development", "SaaS"],
          ["ai-solutions", "AI solutions"],
          ["business-automation", "Automation"],
          ["travel-booking", "Travel"],
          ["data-entry", "Data entry"],
        ].map(([slug, label]) => (
          <Link
            key={slug}
            href={`/services/${slug}`}
            className="border border-[var(--st-line)] px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-white/70 hover:border-emerald-400/50 hover:text-white"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          {blocks.map((block, i) => (
            <a
              key={block.id}
              id={block.id}
              href={`#${block.id}`}
              onMouseEnter={() => setActive(block.id)}
              onFocus={() => setActive(block.id)}
              onClick={() => setActive(block.id)}
              className={`block border-t border-[var(--st-line)] py-6 ${
                current?.id === block.id ? "text-white" : "text-white/35"
              }`}
              data-cursor="EXPLORE"
            >
              <span className="text-[10px] tracking-[0.2em] text-emerald-400">{String(i + 1).padStart(2, "0")}</span>
              <span className="studio-display mt-1 block text-3xl sm:text-5xl">{block.label}</span>
            </a>
          ))}
        </div>
        {current && (
          <div>
            <p className="text-lg text-white">{current.scene}</p>
            <ul className="mt-8 space-y-5">
              {current.items.map((item) => (
                <li key={item.id || item.title} className="border-b border-[var(--st-line)] pb-5">
                  <h2 className="text-xl text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--st-muted)]">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link href="/contact" className="mt-16 inline-flex studio-btn" data-cursor="START">
        Start a project →
      </Link>
    </main>
  );
}
