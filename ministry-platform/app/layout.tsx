import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/api-client";
import { PublicSettingsProvider } from "@/lib/public-settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_URL = "https://jesusisthewayjebathottam.com";
const SITE_NAME = "Jesus is the Way Jebathottam";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Preserving God's Word for Generations`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Jesus is the Way Jebathottam — a trusted ministry platform for teachings, prophecies, prayer, and community.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Teachings, prayer, and community from Jesus is the Way Jebathottam ministry.",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Teachings, prayer, and community from Jesus is the Way Jebathottam ministry.",
  },
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AuthProvider>
          <PublicSettingsProvider>
            {children}
          </PublicSettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
