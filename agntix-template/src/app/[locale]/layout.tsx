import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import {
  Cormorant_Garamond,
  Great_Vibes,
  Hind,
  Hind_Madurai,
  Manrope,
  Tiro_Devanagari_Hindi,
  Tiro_Tamil,
} from "next/font/google";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AmbientToggle } from "@/components/film/AmbientToggle";
import { GsapNavCleanup } from "@/components/film/GsapNavCleanup";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const tamilSans = Hind_Madurai({
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tamil",
  display: "swap",
});

const tamilDisplay = Tiro_Tamil({
  subsets: ["tamil", "latin"],
  weight: "400",
  variable: "--font-tamil-display",
  display: "swap",
});

const hindiSans = Hind({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hindi",
  display: "swap",
});

const hindiDisplay = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-hindi-display",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: ["/brand/canaan-logo.jpeg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${cormorant.variable} ${greatVibes.variable} ${tamilSans.variable} ${tamilDisplay.variable} ${hindiSans.variable} ${hindiDisplay.variable} h-full`}
    >
      <body
        className={`min-h-full flex flex-col antialiased ${
          locale === "ta" ? "locale-ta" : locale === "hi" ? "locale-hi" : ""
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          <GsapNavCleanup />
          <ScrollProgress />
          <AmbientToggle />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
