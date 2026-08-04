"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  Store,
  Menu,
  X,
  Receipt,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/dashboard/new", label: "Add Product", icon: PlusCircle },
  { href: "/admin/dashboard/orders", label: "Online Orders", icon: ShoppingCart },
  { href: "/pos", label: "Shop POS", icon: Receipt },
  { href: "/pos/summary", label: "Day Summary", icon: BarChart3 },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const title =
    adminLinks.find((l) => isActive(pathname, l.href, l.exact))?.label || "Admin";

  const nav = (
    <>
      <div className="flex h-14 items-center gap-3 border-b border-[var(--border)] px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]">
          <Store className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[var(--foreground)]">Sri Krishna</p>
          <p className="truncate text-xs text-[var(--foreground-muted)]">Shop Admin</p>
        </div>
        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(pathname, link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/shop"
          onClick={() => setMenuOpen(false)}
          className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          View Online Shop
        </Link>
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <div className="mb-2 truncate px-3 text-xs text-[var(--foreground-muted)]">
          {session?.user?.email || "Staff account"}
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--error)] hover:bg-[var(--error)]/10"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--card)] lg:flex">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu overlay"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(18rem,88vw)] flex-col bg-[var(--card)] shadow-xl">
            {nav}
          </aside>
        </div>
      )}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--card)] px-3 sm:px-5">
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-[var(--background-secondary)] lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-[var(--foreground)]" />
          </button>
          <h1 className="truncate text-base font-semibold text-[var(--foreground)] sm:text-lg">
            {title}
          </h1>
          <Link
            href="/pos"
            className="ml-auto inline-flex min-h-[40px] items-center rounded-lg bg-[var(--primary)] px-3 text-sm font-medium text-white hover:opacity-90"
          >
            Open POS
          </Link>
        </header>

        <main className="p-3 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
