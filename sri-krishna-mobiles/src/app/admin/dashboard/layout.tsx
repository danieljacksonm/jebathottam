"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [key, setKey] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const k = typeof window !== "undefined" ? sessionStorage.getItem("adminKey") : null;
    setKey(k);
    if (!k && typeof window !== "undefined") router.replace("/admin");
  }, [router]);

  if (key === null) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-[var(--muted)]">Checking auth…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="flex gap-4 mb-8 border-b border-[var(--border)] pb-4">
        <Link
          href="/admin/dashboard"
          className={pathname === "/admin/dashboard" ? "font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}
        >
          Products
        </Link>
        <Link
          href="/admin/dashboard/orders"
          className={pathname === "/admin/dashboard/orders" ? "font-medium text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}
        >
          Orders
        </Link>
        <Link href="/" className="ml-auto text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Store
        </Link>
      </nav>
      {children}
    </div>
  );
}
