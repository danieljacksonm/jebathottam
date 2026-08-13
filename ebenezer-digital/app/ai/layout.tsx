import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Outfit } from "next/font/google";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ebenezerdigital.com";

export const metadata: Metadata = {
  title: "Eben AI | Ask anything",
  description:
    "Eben AI — an intelligent space for thinking, creating and discovering. Private, calm AI by Ebenezer Digital.",
  alternates: { canonical: `${siteUrl}/ai` },
  openGraph: {
    title: "Eben AI",
    description: "An intelligent space for thinking, creating and discovering.",
    url: `${siteUrl}/ai`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function AiLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${display.variable} ${ui.variable}`} data-ai-root>
      {children}
    </div>
  );
}
