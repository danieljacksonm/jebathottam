"use client";

import { usePathname } from "next/navigation";
import type { SiteKind } from "@/lib/site-url";
import { useStudioSiteCopy } from "@/lib/i18n/use-shell-messages";
import Header from "../components/Header";
import Footer from "../sections/Footer";
import ScrollProgressBar from "../components/ScrollProgressBar";
import { StudioCursor } from "./StudioCursor";

const HIDDEN = ["/ai", "/blog", "/products", "/admin", "/saas", "/discover", "/catalog", "/tools", "/info", "/network"];

export default function SiteChrome({
  children,
  siteKind = "studio",
}: {
  children: React.ReactNode;
  siteKind?: SiteKind;
}) {
  const pathname = usePathname() || "/";
  const common = useStudioSiteCopy().common;
  const hide =
    siteKind !== "studio" ||
    HIDDEN.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (hide) return <>{children}</>;

  return (
    <div className="studio-root relative min-h-screen">
      <a href="#main-content" className="studio-skip-link">
        {common.skipToContent}
      </a>
      <ScrollProgressBar />
      <Header />
      <StudioCursor />
      <div id="main-content">{children}</div>
      <Footer />
    </div>
  );
}
