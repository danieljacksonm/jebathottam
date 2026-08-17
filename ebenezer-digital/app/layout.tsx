import type { Metadata } from "next";
import { Syne, DM_Sans, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import "./studio/studio.css";
import SiteChrome from "./studio/SiteChrome";
import GlobalStyles from "./components/GlobalStyles";
import { SITE_EMAIL, SITE_PHONE_DISPLAY } from "@/lib/site-contact";
import { OG_IMAGE, SITE_URL } from "@/lib/site-url";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ebenezer Digital Services | Reliable Digital & Web Services for Your Business",
  description:
    "Professional data entry, virtual assistance, travel booking support, and web development. Trusted by clients worldwide. Clear communication, on-time delivery, affordable rates.",
  keywords: [
    "data entry",
    "virtual assistant",
    "web development",
    "travel booking",
    "online support",
    "document conversion",
    "Laravel",
    "freelance digital services",
  ],
  authors: [{ name: "Ebenezer Digital Services" }],
  creator: "Ebenezer Digital Services",
  openGraph: {
    title: "Ebenezer Digital Services | Reliable Digital & Web Services",
    description:
      "Professional data entry, virtual assistance, travel booking support, and web development. Trusted by clients worldwide.",
    type: "website",
    url: SITE_URL,
    siteName: "Ebenezer Digital Services",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ebenezer Digital Services | Reliable Digital & Web Services",
    description: "Professional data entry, virtual assistance, travel booking, web development. Trusted worldwide.",
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ebenezer Digital Services",
    url: SITE_URL,
    description: "Professional data entry, virtual assistance, travel booking support, and web development. Trusted by clients worldwide.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SITE_EMAIL,
      telephone: SITE_PHONE_DISPLAY,
      availableLanguage: "English",
    },
  };

  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${sourceSerif.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#10b981" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans min-h-screen bg-[#070708] text-white antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteChrome>{children}</SiteChrome>
        <GlobalStyles />
      </body>
    </html>
  );
}
