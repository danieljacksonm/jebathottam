"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const groups = [
  {
    label: "Business",
    links: [
      ["/admin", "Dashboard"],
      ["/admin/enquiries", "Enquiries"],
      ["/admin/customers", "Customers"],
      ["/admin/quotes", "Quotes"],
      ["/admin/invoices", "Invoices"],
    ],
  },
  {
    label: "Content",
    links: [
      ["/admin/destinations", "Destinations"],
      ["/admin/packages", "Packages"],
      ["/admin/blogs", "Blogs"],
      ["/admin/media", "Media"],
      ["/admin/translations", "Translations"],
    ],
  },
  {
    label: "System",
    links: [
      ["/admin/connections", "Connections"],
      ["/admin/social", "Social media"],
      ["/admin/reports", "Reports"],
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <main className="admin-main">{children}</main>;
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <aside className={open ? "admin-side open" : "admin-side"}>
        <Link href="/admin" className="admin-brand" onClick={() => setOpen(false)}>
          Canaan Admin
        </Link>
        {groups.map((group) => (
          <div key={group.label}>
            <p className="admin-side-label">{group.label}</p>
            {group.links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={isActive(pathname, href) ? "active" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        ))}
        <Link href="/en" target="_blank" rel="noreferrer">
          View site
        </Link>
      </aside>
      <div className="admin-content">
        <div className="admin-topbar">
          <button
            type="button"
            className="admin-btn secondary admin-menu-btn"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close menu" : "Menu"}
          </button>
          <button type="button" className="admin-btn secondary" onClick={() => void logout()}>
            Log out
          </button>
        </div>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
