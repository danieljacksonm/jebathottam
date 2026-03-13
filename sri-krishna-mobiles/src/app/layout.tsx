import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sri Krishna Mobiles | Mobile Spares & Accessories",
  description: "Buy mobile spares and accessories. Screens, batteries, covers and more.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg text-[var(--foreground)]">
              Sri Krishna Mobiles
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/shop" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                Shop
              </Link>
              <Link href="/cart" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                Cart
              </Link>
              <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border)] bg-[var(--card)] py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} Sri Krishna Mobiles. Mobile spares & accessories.
          </div>
        </footer>
      </body>
    </html>
  );
}
