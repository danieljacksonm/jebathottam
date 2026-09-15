"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";

type FilterOption = {
  id: string;
  label: string;
  count: number;
  param: "destination" | "continent";
};

export function BlogFilterChips({ options }: { options: FilterOption[] }) {
  const searchParams = useSearchParams();
  const activeDestination = searchParams.get("destination");
  const activeContinent = searchParams.get("continent");
  const activeId = activeDestination ?? activeContinent ?? "all";

  return (
    <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-5 pb-2 pt-4 md:px-8">
      <Link
        href="/blog"
        className={`border px-4 py-2 text-[0.65rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
          activeId === "all"
            ? "border-gold bg-gold/15 text-gold-bright"
            : "border-[var(--line)] text-mist hover:border-gold/40 hover:text-cream"
        }`}
      >
        All
      </Link>
      {options.map((option) => {
        const isActive = activeId === option.id;
        const href =
          option.param === "destination"
            ? `/blog?destination=${option.id}`
            : `/blog?continent=${encodeURIComponent(option.id)}`;

        return (
          <Link
            key={`${option.param}-${option.id}`}
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
