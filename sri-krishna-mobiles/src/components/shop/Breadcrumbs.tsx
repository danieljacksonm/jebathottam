"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const query = searchParams.get("q");

  const breadcrumbs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop" },
  ];

  // Add category if present
  if (category) {
    breadcrumbs.push({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      href: `/shop?category=${category}`,
    });
  }

  // Add brand if present (and no category)
  if (brand && !category) {
    breadcrumbs.push({
      label: brand.charAt(0).toUpperCase() + brand.slice(1),
      href: `/shop?brand=${brand}`,
    });
  }

  // Add search query if present
  if (query) {
    breadcrumbs.push({
      label: `Search: "${query}"`,
      href: `/shop?q=${encodeURIComponent(query)}`,
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = crumb.icon;

        return (
          <div key={crumb.label} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-[var(--foreground-muted)]" />
            )}
            {isLast ? (
              <span className="font-medium text-[var(--foreground)]">
                {Icon && <Icon className="mr-1 inline h-4 w-4" />}
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[var(--foreground-muted)] transition-colors hover:text-[var(--primary)]"
              >
                {Icon && <Icon className="mr-1 inline h-4 w-4" />}
                {crumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
