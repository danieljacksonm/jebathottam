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
import { GsapNavCleanup } from "@/components/film/GsapNavCleanup";
import { SmoothScroll } from "@/components/cinematic/SmoothScroll";
import { SkipLink } from "@/components/SkipLink";
import { MobileBookBar } from "@/components/MobileBookBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { DeferredChrome } from "@/components/cinematic/DeferredChrome";
import { organizationJsonLd, SITE_NAME, SITE_URL } from "@/lib/seo";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "optional",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "optional",
  preload: false,
});

const tamilSans = Hind_Madurai({
  subsets: ["tamil", "latin"],
  weight: ["400", "600"],
  variable: "--font-tamil",
  display: "swap",
  preload: false,
});

const tamilDisplay = Tiro_Tamil({
  subsets: ["tamil", "latin"],
  weight: "400",
  variable: "--font-tamil-display",
  display: "swap",
  preload: false,
});

const hindiSans = Hind({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600"],
  variable: "--font-hindi",
  display: "swap",
  preload: false,
});

const hindiDisplay = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-hindi-display",
  display: "swap",
  preload: false,
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
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("homeTitle"),
      template: `%s | ${SITE_NAME}`,
    },
    description: t("homeDescription"),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      images: ["/brand/canaan-logo.jpeg"],
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: { index: true, follow: true },
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
      className={[
        manrope.variable,
        cormorant.variable,
        greatVibes.variable,
        locale === "ta" ? `${tamilSans.variable} ${tamilDisplay.variable}` : "",
        locale === "hi" ? `${hindiSans.variable} ${hindiDisplay.variable}` : "",
        "h-full",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <body
        className={`min-h-full flex flex-col antialiased pb-16 md:pb-0 ${
          locale === "ta" ? "locale-ta" : locale === "hi" ? "locale-hi" : ""
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          <SkipLink />
          <JsonLd data={organizationJsonLd()} />
          <GsapNavCleanup />
          <SmoothScroll />
          <DeferredChrome />
          <SiteHeader />
          <main id="main" className="relative z-[5] flex-1">
            {children}
          </main>
          <SiteFooter />
          <MobileBookBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
