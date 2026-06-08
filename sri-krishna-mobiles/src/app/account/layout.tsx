"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";

const accountLinks = [
  {
    href: "/account",
    label: "Profile",
    icon: User,
    description: "Manage your personal information",
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: ShoppingBag,
    description: "View your order history",
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: MapPin,
    description: "Manage shipping addresses",
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
    description: "Saved items",
  },
  {
    href: "/account/notifications",
    label: "Notifications",
    icon: Bell,
    description: "Email and SMS preferences",
  },
  {
    href: "/account/settings",
    label: "Settings",
    icon: Settings,
    description: "Password and security",
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            My Account
          </h1>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Manage your profile, orders, and preferences
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="space-y-2 lg:col-span-1">
            {/* User Info Card */}
            <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10 text-lg font-bold text-[var(--primary)]">
                  JD
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">John Doe</p>
                  <p className="text-sm text-[var(--foreground-muted)]">john@example.com</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {accountLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <button className="mt-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[var(--error)] transition-colors hover:bg-[var(--error)]/10">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
