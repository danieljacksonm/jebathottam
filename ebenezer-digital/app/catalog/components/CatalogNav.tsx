import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE_NAV } from "@/lib/site-nav";

export function CatalogNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
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
        <Link href="/catalog" className="flex shrink-0 items-center gap-2">
          <span className="text-base font-bold tracking-tight text-[var(--c-ink)]">Ebenezer</span>
          <span className="rounded-md bg-[var(--c-brand)] px-2 py-0.5 text-[11px] font-bold text-white">
            Products
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm text-[var(--c-muted)] md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-2.5 py-1.5 hover:text-[var(--c-brand-dk)] ${
                pathname === l.href || (l.href !== "/catalog" && pathname.startsWith(l.href))
                  ? "bg-slate-100 font-semibold text-[var(--c-ink)]"
                  : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <Link href={SITE_NAV.tools} className="hidden text-[var(--c-muted)] hover:text-[var(--c-brand)] sm:inline">
            Tools
          </Link>
          <Link href={SITE_NAV.store} className="hidden text-[var(--c-muted)] hover:text-[var(--c-brand)] sm:inline">
            Store
          </Link>
          <Link href="/catalog#ask-ai" className="c-btn c-btn-primary !rounded-lg !px-3 !py-1.5 !text-xs hidden sm:inline-flex">
            Ask AI
          </Link>
          <button
            type="button"
            className="c-menu-btn md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="c-nav-mobile border-t border-[var(--c-line)] bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2.5 text-sm font-medium text-[var(--c-ink)]"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href={SITE_NAV.tools} className="block py-2.5 text-sm text-[var(--c-muted)]" onClick={() => setOpen(false)}>
            Tools
          </Link>
          <Link href={SITE_NAV.store} className="block py-2.5 text-sm text-[var(--c-muted)]" onClick={() => setOpen(false)}>
            Store
          </Link>
          <Link href="/catalog#ask-ai" className="c-btn c-btn-primary mt-2 !inline-flex" onClick={() => setOpen(false)}>
            Ask AI
          </Link>
        </nav>
      )}
    </header>
  );
}
