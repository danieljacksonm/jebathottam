"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

export function SmartSearch({
  initialQuery = "",
  large = false,
}: {
  initialQuery?: string;
  large?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/catalog/recommend?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="aff-search" style={large ? undefined : { maxWidth: "100%" }}>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search laptops, phones, RAM, SSDs, GPUs and more…"
        aria-label="Product search"
      />
      <button type="submit" className="aff-btn aff-btn-primary shrink-0">
        <Search className="h-4 w-4" />
        Find product
      </button>
    </form>
  );
}
