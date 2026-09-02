import type { Metadata } from "next";
import { headers } from "next/headers";
import { Syne, DM_Sans, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import "./studio/studio.css";
import SiteChrome from "./studio/SiteChrome";
import GlobalStyles from "./components/GlobalStyles";
import { Analytics } from "@/components/Analytics";
import { RootJsonLd } from "@/components/RootJsonLd";
import { rootMetadataForKind, siteKindFromHost, type SiteKind } from "@/lib/site-url";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const kind = siteKindFromHost(headers().get("host"));
  return rootMetadataForKind(kind);
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const h = headers();
  const kindHeader = h.get("x-eben-site-kind") as SiteKind | null;
  const siteKind = kindHeader || siteKindFromHost(h.get("x-forwarded-host") || h.get("host"));
  const locale = h.get("x-eben-locale") || "en";

  return (
    <html lang={locale} className={`${syne.variable} ${dmSans.variable} ${sourceSerif.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#10b981" />
        <meta httpEquiv="content-language" content={locale} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
      </head>
      <body className="font-sans min-h-screen bg-[#070708] text-white antialiased overflow-x-hidden">
        <RootJsonLd />
        <Analytics />
        <SiteChrome siteKind={siteKind}>{children}</SiteChrome>
        <GlobalStyles />
      </body>
    </html>
  );
}
