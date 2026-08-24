"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchNetworkTools } from "@/lib/network/search";
import { trackNetworkEvent } from "@/lib/network/analytics";

export default function ToolFinderPage() {
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
          <p className="text-[var(--nx-muted)]">No strong match yet — try keywords like compress, json, gst, qr, seo.</p>
        ) : null}
      </div>
    </div>
  );
}
