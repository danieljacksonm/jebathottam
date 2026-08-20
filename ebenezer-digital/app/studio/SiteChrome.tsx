"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../sections/Footer";
import ScrollProgressBar from "../components/ScrollProgressBar";
import { StudioCursor } from "./StudioCursor";
import { EcosystemNav } from "@/components/EcosystemNav";

const HIDDEN = ["/ai", "/blog", "/products", "/admin", "/saas", "/discover", "/catalog", "/tools"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const hide = HIDDEN.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (hide) return <>{children}</>;

  return (
    <div className="studio-root relative min-h-screen">
      <EcosystemNav active="services" />
      <ScrollProgressBar />
      <Header />
      <StudioCursor />
      {children}
      <Footer />
    </div>
  );
}
