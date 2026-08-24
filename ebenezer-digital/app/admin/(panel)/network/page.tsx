"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLiveTools } from "@/lib/network/registry";
import { NETWORK_GUIDES } from "@/lib/network/guides";

export default function AdminNetworkPage() {
  const [tools, setTools] = useState<ReturnType<typeof getLiveTools>>([]);
  useEffect(() => {
    setTools(getLiveTools());
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Network admin</h1>
          <Link href="/network" className="text-sm text-teal-300 hover:underline">
            Open site
          </Link>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Tools and guides are registry-driven in code for v1. This panel lists live metadata for SEO checks.
        </p>

        <h2 className="mt-8 font-semibold">Tools ({tools.length})</h2>
        <div className="mt-3 space-y-2">
          {tools.map((t) => (
            <div key={t.id} className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm">
              <p className="font-medium text-white">
                {t.name}{" "}
                <span className="text-slate-500">
                  /{t.slug} · {t.category} · {t.status}
                  {t.featured ? " · featured" : ""}
                </span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                SEO: {t.seoTitle} — keywords: {t.keywords.join(", ")}
              </p>
              <Link href={`/network/tools/${t.slug}`} className="text-xs text-teal-300 hover:underline">
                View
              </Link>
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-semibold">Guides ({NETWORK_GUIDES.length})</h2>
        <div className="mt-3 space-y-2">
          {NETWORK_GUIDES.map((g) => (
            <div key={g.slug} className="rounded-lg border border-slate-800 px-4 py-3 text-sm">
              <p className="text-white font-medium">{g.title}</p>
              <p className="text-xs text-slate-500">{g.seoTitle}</p>
              <Link href={`/network/guides/${g.slug}`} className="text-xs text-teal-300 hover:underline">
                View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
