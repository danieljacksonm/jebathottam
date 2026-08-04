"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** Hide storefront chrome on admin, POS, and auth screens. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const hideStoreChrome =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/pos") ||
    pathname.startsWith("/auth");

  if (hideStoreChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
