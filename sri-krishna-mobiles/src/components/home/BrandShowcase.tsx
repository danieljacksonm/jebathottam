"use client";

import Link from "next/link";

const brands = [
  { id: "samsung", name: "Samsung", logo: "SN" },
  { id: "apple", name: "Apple", logo: "AP" },
  { id: "xiaomi", name: "Xiaomi", logo: "XI" },
  { id: "realme", name: "Realme", logo: "RE" },
  { id: "oppo", name: "OPPO", logo: "OP" },
  { id: "vivo", name: "Vivo", logo: "VI" },
  { id: "oneplus", name: "OnePlus", logo: "OP" },
  { id: "nokia", name: "Nokia", logo: "NK" },
  { id: "motorola", name: "Motorola", logo: "MT" },
  { id: "nothing", name: "Nothing", logo: "NO" },
];

export function BrandShowcase() {
  return (
    <section className="py-16 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--foreground)]">
            Shop by Brand
          </h2>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Find spare parts for all major mobile brands
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/shop?brand=${brand.id}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:border-[var(--primary)] hover:shadow-md"
            >
              {/* Brand Logo Placeholder */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-secondary)] text-xl font-bold text-[var(--foreground-muted)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                {brand.logo}
              </div>
              <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
