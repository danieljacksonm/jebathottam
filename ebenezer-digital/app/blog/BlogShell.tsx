"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { EbenDock } from "@/components/EbenDock";
import { EcosystemNav } from "@/components/EcosystemNav";
import { EcosystemFooter } from "@/components/EcosystemFooter";

/** Journal-only shell — news and newsroom use their own chrome. */
export function BlogShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const isNews = pathname.startsWith("/blog/news");
  const isNewsroom = pathname.startsWith("/blog/newsroom");

  if (isNews || isNewsroom) {
    return <>{children}</>;
  }

  return (
    <>
      <EcosystemNav active="journal" />
      {children}
      <EcosystemFooter />
      <EbenDock />
    </>
  );
}
