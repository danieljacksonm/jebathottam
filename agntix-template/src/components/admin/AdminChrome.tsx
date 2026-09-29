"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const groups = [
  {
    label: "Trip desk",
    links: [
      ["/admin", "Dashboard"],
      ["/admin/enquiries", "Trip requests"],
      ["/admin/quotes", "Quotes"],
      ["/admin/invoices", "Invoices"],
      ["/admin/customers", "Customers"],
    ],
  },
  {
    label: "Website",
    links: [
      ["/admin/packages", "Packages"],
      ["/admin/destinations", "Destinations"],
      ["/admin/blogs", "Articles"],
      ["/admin/media", "Photos"],
      ["/admin/translations", "Tamil & Hindi"],
    ],
  },
  {
    label: "Settings",
    links: [
      ["/admin/connections", "Email & logins"],
      ["/admin/social", "Social posts"],
      ["/admin/staff", "Staff"],
      ["/admin/reports", "Checks"],
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

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
          View website
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
