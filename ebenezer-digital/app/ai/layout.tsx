import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { pageMetadata } from "@/lib/site-url";
import { EcosystemNav } from "@/components/EcosystemNav";
import "./ai.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ai-display",
  display: "swap",
});

const ui = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ai-ui",
  display: "swap",
});

export const metadata: Metadata = pageMetadata({
  title: "Eben AI | Ask anything",
  description:
    "Eben AI — an intelligent space for thinking, creating and discovering. Private, calm AI by Ebenezer Digital.",
  path: "/ai",
});

export default function AiLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${display.variable} ${ui.variable}`} data-ai-root>
      <EcosystemNav active="ai" />
      {children}
    </div>
  );
}
