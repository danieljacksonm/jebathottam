"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { BlogDestination } from "@/data/blog";

type FilterOption = {
  id: "all" | BlogDestination;
  label: string;
  count: number;
};

export function BlogFilterChips({ options }: { options: FilterOption[] }) {
  const searchParams = useSearchParams();
  const active = searchParams.get("destination") ?? "all";

  return (
    <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 pb-2 pt-4 md:px-8">
      {options.map((option) => {
        const isActive = active === option.id;
        const href =
          option.id === "all" ? "/blog" : `/blog?destination=${option.id}`;

        return (
          <Link
            key={option.id}
            href={href}
            className={`border px-4 py-2 text-[0.65rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
              isActive
                ? "border-gold bg-gold/15 text-gold-bright"
                : "border-[var(--line)] text-mist hover:border-gold/40 hover:text-cream"
            }`}
          >
            {option.label}
            <span className="ml-2 text-[0.6rem] text-soft-gray">
              ({option.count})
            </span>
          </Link>
        );
      })}
    </div>
  );
}
