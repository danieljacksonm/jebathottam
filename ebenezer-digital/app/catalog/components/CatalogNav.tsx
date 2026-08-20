"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CatalogNav() {
  const pathname = usePathname();
  const links = [
    { href: "/catalog", label: "Home" },
    { href: "/catalog/laptops", label: "Laptops" },
    { href: "/catalog/ssd", label: "SSD" },
    { href: "/catalog/compare", label: "Compare" },
    { href: "/catalog/guides", label: "Guides" },
  ];

  return (
    <header className="c-nav">
      <div className="c-page flex h-14 items-center justify-between gap-4">
        <Link href="/catalog" className="flex items-center gap-2 shrink-0">
          <span className="text-base font-bold tracking-tight text-[var(--c-ink)]">Ebenezer</span>
          <span className="rounded-md bg-[var(--c-brand)] px-2 py-0.5 text-[11px] font-bold text-white">
            Products
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm text-[var(--c-muted)]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-2.5 py-1.5 hover:text-[var(--c-brand-dk)] ${
                pathname === l.href || (l.href !== "/catalog" && pathname.startsWith(l.href))
                  ? "text-[var(--c-ink)] font-semibold bg-slate-100"
                  : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/tools" className="hidden sm:inline text-[var(--c-muted)] hover:text-[var(--c-brand)]">
            Tools
          </Link>
          <Link href="/products" className="hidden sm:inline text-[var(--c-muted)] hover:text-[var(--c-brand)]">
            Store
          </Link>
          <Link href="/catalog#ask-ai" className="c-btn c-btn-primary !py-1.5 !px-3 !text-xs !rounded-lg">
            Ask AI
          </Link>
        </div>
      </div>
    </header>
  );
}
