"use client";

import Link from "next/link";
import { Smartphone, Battery, Zap, Shield, Headphones, Cable, Watch, MoreHorizontal } from "lucide-react";

const categories = [
  {
    id: "screens",
    name: "Screens",
    description: "LCD & OLED displays",
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500",
    count: 150,
  },
  {
    id: "batteries",
    name: "Batteries",
    description: "Original capacity",
    icon: Battery,
    color: "from-green-500 to-emerald-500",
    count: 200,
  },
  {
    id: "chargers",
    name: "Chargers",
    description: "Fast & wireless",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    count: 80,
  },
  {
    id: "covers",
    name: "Back Covers",
    description: "Genuine & premium",
    icon: Shield,
    color: "from-purple-500 to-violet-500",
    count: 120,
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Cases, cables & more",
    icon: Headphones,
    color: "from-pink-500 to-rose-500",
    count: 300,
  },
  {
    id: "cables",
    name: "Cables",
    description: "USB, OTG & data",
    icon: Cable,
    color: "from-indigo-500 to-blue-500",
    count: 60,
  },
  {
    id: "smart-watches",
    name: "Smart Watches",
    description: "Straps & accessories",
    icon: Watch,
    color: "from-teal-500 to-cyan-500",
    count: 45,
  },
  {
    id: "more",
    name: "View All",
    description: "Browse everything",
    icon: MoreHorizontal,
    color: "from-gray-500 to-slate-500",
    count: 1000,
  },
];

export function CategoriesGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={category.id === "more" ? "/shop" : `/shop?category=${category.id}`}
          className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all hover:shadow-lg hover:border-[var(--primary)]"
        >
          {/* Icon */}
          <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${category.color} p-3 text-white shadow-lg`}>
            <category.icon className="h-6 w-6" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)]">
            {category.name}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            {category.description}
          </p>

          {/* Product Count */}
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-full bg-[var(--background-secondary)] px-2 py-1 text-xs font-medium text-[var(--foreground-secondary)]">
              {category.count}+ products
            </span>
          </div>

          {/* Hover Arrow */}
          <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-[var(--primary)] p-2 text-white">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
