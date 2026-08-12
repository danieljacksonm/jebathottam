import type { Metadata } from "next";
import { Syne, DM_Sans, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "./components/Header";
import ScrollProgressBar from "./components/ScrollProgressBar";
import Footer from "./components/Footer";
import GlobalStyles from "./components/GlobalStyles";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ebenezerdigital.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    siteName: "Ebenezer Digital Services",
    locale: "en_US",
    // Add when you have an image: images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ebenezer Digital Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ebenezer Digital Services | Reliable Digital & Web Services",
    description: "Professional data entry, virtual assistance, travel booking, web development. Trusted worldwide.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteUrl },
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
    url: siteUrl,
    description: "Professional data entry, virtual assistance, travel booking support, and web development. Trusted by clients worldwide.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@ebenezerdigitalservices.com",
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
      <body className="font-sans min-h-screen bg-gray-900 text-white antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
        <main className="relative z-10">{children}</main>
        <GlobalStyles />
      </body>
    </html>
  );
}
