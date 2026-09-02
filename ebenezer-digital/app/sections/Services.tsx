"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "digital" | "travel" | "web" | "other";
  features: string[];
};

const categoryMeta: Record<string, { title: string; scene: string }> = {
  digital: { title: "Digital & Admin", scene: "sheets" },
  travel: { title: "Travel & Booking", scene: "ticket" },
  web: { title: "Web & Technical", scene: "browser" },
  other: { title: "Other Services", scene: "nodes" },
};

function Scene({ type }: { type: string }) {
  return (
    <div className="relative h-64 overflow-hidden border border-[var(--st-line)] bg-black/40 p-5">
      {type === "browser" && (
        <div className="h-full rounded-lg border border-white/10 bg-[#111]">
          <div className="flex gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          </div>
          <p className="p-4 font-mono text-xs leading-6 text-emerald-300/80">
            {`const site = await build({
  stack: "Next.js",
  care: "on-time",
})`}
          </p>
        </div>
      )}
      {type === "ticket" && (
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-xs border border-dashed border-emerald-400/40 p-5 text-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">Itinerary</p>
            <p className="mt-3 font-serif text-2xl">MAA → DXB</p>
            <p className="mt-2 text-white/50">Booking support · documents · changes</p>
          </div>
        </div>
      )}
      {type === "sheets" && (
        <div className="grid h-full grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-white/10 bg-white/[0.03]" />
          ))}
        </div>
      )}
      {type === "nodes" && (
        <div className="flex h-full items-center justify-center gap-6">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="h-px w-16 bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-white/40" />
          <span className="h-px w-16 bg-white/20" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/50" />
        </div>
      )}
    </div>
  );
}

const FALLBACK_SERVICES: ServiceItem[] = [
  {
    id: "svc-web",
    title: "Web Development",
    description: "Modern websites and web apps — fast, mobile-ready, and built to convert.",
    icon: "globe",
    category: "web",
    features: ["Next.js", "SEO", "Mobile-first"],
  },
  {
    id: "svc-digital",
    title: "Digital & Admin Support",
    description: "Reliable data entry, virtual assistance, and back-office help.",
    icon: "file",
    category: "digital",
    features: ["Data entry", "Research", "Documentation"],
  },
  {
    id: "svc-travel",
    title: "Travel & Booking Support",
    description: "Itineraries, bookings, and travel desk support for agencies and teams.",
    icon: "plane",
    category: "travel",
    features: ["Bookings", "Itineraries", "Support"],
  },
];

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("web");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    fetch("/api/content", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const list = (data.services || []) as ServiceItem[];
        setServices(list.length ? list : FALLBACK_SERVICES);
      })
      .catch(() => setServices(FALLBACK_SERVICES))
      .finally(() => {
        window.clearTimeout(timeout);
        setLoading(false);
      });

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const categories = useMemo(() => {
    const order = ["digital", "travel", "web", "other"];
    return order
      .map((id) => {
        const items = services.filter((s) => s.category === id);
        if (!items.length) return null;
        return { id, ...categoryMeta[id], services: items };
      })
      .filter(Boolean) as Array<{
      id: string;
      title: string;
      scene: string;
      services: ServiceItem[];
    }>;
  }, [services]);

  const current = categories.find((c) => c.id === active) || categories[0];

  return (
    <section id="services" className="relative overflow-hidden px-4 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="studio-kicker">What we build</p>
        <h2 className="studio-display mt-4 text-6xl sm:text-8xl">
          WHAT
          <br />
          WE
          <br />
          BUILD.
        </h2>
        <p className="mt-6 max-w-xl text-[var(--st-muted)]">
          From admin work to websites, travel desks, and AI — services stay the same. The way you meet them is new.
        </p>

        {loading ? (
          <p className="mt-12 text-[var(--st-muted)]" role="status">
            Loading services…
          </p>
        ) : categories.length === 0 ? (
          <p className="mt-12 text-[var(--st-muted)]">
            Services are being updated.{" "}
            <Link href="/services" className="text-emerald-400 hover:underline">
              View all services →
            </Link>
          </p>
        ) : (
          <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-2">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => setActive(cat.id)}
                  onFocus={() => setActive(cat.id)}
                  onClick={() => setActive(cat.id)}
                  className={`block w-full border-t border-[var(--st-line)] py-5 text-left ${
                    current?.id === cat.id ? "text-white" : "text-white/40"
                  }`}
                  data-cursor="EXPLORE"
                >
                  <span className="text-[10px] tracking-[0.2em] text-emerald-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="studio-display mt-1 block text-3xl sm:text-5xl">{cat.title}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Scene type={current.scene} />
                  <ul className="mt-6 space-y-4">
                    {current.services.map((s) => (
                      <li key={s.id} className="border-b border-[var(--st-line)] pb-4">
                        <h3 className="text-lg text-white">{s.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--st-muted)]">{s.description}</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <Link href="/services" className="mt-12 inline-block text-sm tracking-[0.16em] uppercase text-emerald-400" data-cursor="OPEN">
          Discover our services →
        </Link>
      </div>
    </section>
  );
}
