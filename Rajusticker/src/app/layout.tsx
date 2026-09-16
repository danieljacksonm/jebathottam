import { Manrope, Barlow_Condensed } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StoreChrome } from "@/components/layout/StoreChrome";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/constants";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Premium Car Stickers & Wraps`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Car Stickers & Wraps`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/products/chrome-gold.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Car Stickers & Wraps`,
    description: SITE_DESCRIPTION,
    images: ["/products/chrome-gold.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${barlow.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <CartProvider>
          <StoreChrome>
            <Header />
          </StoreChrome>
          <main className="flex-1">{children}</main>
          <StoreChrome>
            <Footer />
          </StoreChrome>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
