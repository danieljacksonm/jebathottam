"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Store,
  Tag,
  AlertTriangle,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/inventory", label: "Inventory", icon: AlertTriangle },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--border)] bg-[var(--card)]">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[var(--foreground)]">Admin Panel</h1>
            <p className="text-xs text-[var(--foreground-muted)]">Sri Krishna Mobiles</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-4">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--border)] p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[var(--error)] transition-colors hover:bg-[var(--error)]/10">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-8">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {adminLinks.find((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))?.label || "Admin"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--error)]" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-medium">
                AD
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[var(--foreground)]">Admin User</p>
                <p className="text-xs text-[var(--foreground-muted)]">admin@skmobiles.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
