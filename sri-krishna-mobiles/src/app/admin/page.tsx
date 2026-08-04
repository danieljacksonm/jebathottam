"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import {
  Receipt,
  Package,
  PlusCircle,
  ShoppingCart,
  BarChart3,
  Store,
} from "lucide-react";

const actions = [
  {
    href: "/pos",
    title: "Open Billing (POS)",
    desc: "Sell in shop — cash, UPI, card, credit",
    icon: Receipt,
    primary: true,
  },
  {
    href: "/admin/products",
    title: "Products & Stock",
    desc: "See all imported products and stock qty",
    icon: Package,
  },
  {
    href: "/admin/dashboard/new",
    title: "Add Product",
    desc: "Add new item with price and stock",
    icon: PlusCircle,
  },
  {
    href: "/admin/dashboard/orders",
    title: "Online Orders",
    desc: "Orders from website customers",
    icon: ShoppingCart,
  },
  {
    href: "/pos/summary",
    title: "Today's Summary",
    desc: "Cash, UPI, card and credit totals",
    icon: BarChart3,
  },
  {
    href: "/shop",
    title: "Online Shop",
    desc: "Check what customers see",
    icon: Store,
  },
];

export default function AdminHomePage() {
  const { data: session } = useSession();
  const name = session?.user?.name || "Admin";

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">
          Welcome, {name}
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Simple shop control — billing, products, and orders.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="block">
              <Card
                className={`h-full border-[var(--border)] p-4 transition hover:shadow-md sm:p-5 ${
                  action.primary
                    ? "border-[var(--primary)] bg-[var(--primary)]/5"
                    : "bg-[var(--card)]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      action.primary
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--background-secondary)] text-[var(--primary)]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--foreground)]">{action.title}</p>
                    <p className="mt-0.5 text-sm text-[var(--foreground-muted)]">{action.desc}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
