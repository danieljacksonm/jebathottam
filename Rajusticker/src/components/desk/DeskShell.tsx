"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin/products", label: "Catalogue" },
  { href: "/admin/products/new", label: "Add product" },
  { href: "/billing", label: "Billing" },
];

export function DeskShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] print:bg-white print:text-black">
      <header className="border-b border-[var(--line)] print:hidden">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg tracking-[0.12em]">RAJU DESK</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-3)]">Staff counter</p>
          </div>
          <nav className="flex items-center gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-[11px] uppercase tracking-[0.14em] ${
                    active ? "text-[var(--accent)]" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/" className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
              Shop
            </Link>
            <button type="button" onClick={logout} className="btn btn-ghost">
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="container-x py-8">{children}</main>
    </div>
  );
}
