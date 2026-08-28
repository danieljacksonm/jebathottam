"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchNetworkTools } from "@/lib/network/search";
import { trackNetworkEvent } from "@/lib/network/analytics";

export default function ToolFinderClient() {
  const [goal, setGoal] = useState("");
  const results = useMemo(() => (goal.trim().length > 3 ? searchNetworkTools(goal, 5) : []), [goal]);

  return (
    <div className="nx-page py-10 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">What are you trying to accomplish?</h1>
      <p className="mt-2 text-[var(--nx-muted)]">
        Describe the task in plain language. We recommend tools that actually exist on this network.
      </p>
      <textarea
        className="nx-textarea mt-6"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Example: I need to reduce the size of a photo for my website."
        aria-label="Describe your goal"
      />
      <button
        type="button"
        className="nx-btn nx-btn-primary mt-3"
        onClick={() => trackNetworkEvent("search", { q: goal, source: "finder" })}
      >
        Find tools
      </button>
      <div className="mt-8 space-y-3">
        {results.map((t) => (
          <div key={t.id} className="nx-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-[var(--nx-muted)]">{t.description}</p>
            </div>
            <Link href={`/network/tools/${t.slug}`} className="nx-btn nx-btn-primary shrink-0">
              Use tool
            </Link>
          </div>
        ))}
        {goal.trim().length > 3 && results.length === 0 ? (
          <div className="text-center py-6">
            <p className="font-semibold">We couldn&apos;t find that tool yet.</p>
            <p className="mt-2 text-sm text-[var(--nx-muted)]">Try: Image, SEO, Developer, Calculator</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["image", "seo", "developer", "calculators"].map((c) => (
                <Link key={c} href={`/network/tools/c/${c}`} className="nx-chip">
                  {c}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
