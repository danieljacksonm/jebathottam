import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";

export const metadata: Metadata = {
  title: "Canaan Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="admin-body">
        <header className="admin-header">
          <Link href="/admin" className="admin-brand">
            Canaan Admin
          </Link>
          <nav className="admin-nav">
            <Link href="/admin/destinations">Destinations</Link>
            <Link href="/admin/packages">Packages</Link>
            <Link href="/admin/blogs">Blogs</Link>
            <Link href="/admin/media">Media</Link>
            <Link href="/en" target="_blank" rel="noreferrer">
              View site
            </Link>
          </nav>
        </header>
        <main className="admin-main">{children}</main>
      </body>
    </html>
  );
}
