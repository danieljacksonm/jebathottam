"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/enquiries", "Enquiries"],
  ["/admin/customers", "Customers"],
  ["/admin/quotes", "Quotes"],
  ["/admin/invoices", "Invoices"],
  ["/admin/destinations", "Destinations"],
  ["/admin/packages", "Packages"],
  ["/admin/blogs", "Blogs"],
  ["/admin/media", "Media"],
  ["/admin/translations", "Translations"],
  ["/admin/connections", "Connections"],
  ["/admin/social", "Social media"],
  ["/admin/reports", "Reports"],
];

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <main className="admin-main">{children}</main>;
  }
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand">
          Canaan Admin
        </Link>
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={pathname === href ? "active" : undefined}
          >
            {label}
          </Link>
        ))}
        <Link href="/en" target="_blank" rel="noreferrer">
          View site
        </Link>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
