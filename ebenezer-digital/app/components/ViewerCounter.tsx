"use client";

import { useEffect, useState } from "react";

const COUNTER_KEY = "ebenezer-viewer-counted";

export default function ViewerCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/counter");
        const data = await res.json();
        setCount(typeof data.count === "number" ? data.count : 0);

        if (typeof window === "undefined") return;
        if (sessionStorage.getItem(COUNTER_KEY)) return;

        const postRes = await fetch("/api/counter", { method: "POST" });
        const postData = await postRes.json();
        setCount(typeof postData.count === "number" ? postData.count : (count ?? 0) + 1);
        sessionStorage.setItem(COUNTER_KEY, "1");
      } catch {
        setCount(0);
      }
    }
    init();
  }, []);

  if (count === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)] text-sm">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
      {count.toLocaleString()} visitor{count !== 1 ? "s" : ""}
    </span>
  );
}
