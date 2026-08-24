"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Code2,
  Home,
  Moon,
  Search,
  Sparkles,
  Sun,
  Wrench,
} from "lucide-react";
import { AI_URL, JOURNAL_URL, PRODUCTS_URL, SITE_URL, STORE_URL, TOOLS_URL } from "@/lib/site-url";
import { trackNetworkEvent } from "@/lib/network/analytics";

const NAV = [
  { href: "/network/tools", label: "Tools" },
  { href: "/network/developers", label: "Developers" },
  { href: "/network/resources", label: "Resources" },
  { href: "/network/guides", label: "Guides" },
];

function basePath(pathname: string) {
  return pathname;
}

export function NetworkShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/network";
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("eben-network-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = saved || (prefersDark ? "dark" : "light");
    setTheme(next);
    document.documentElement.dataset.nxTheme = next;
  }, []);

  useEffect(() => {
    const root = document.querySelector(".nx-root") as HTMLElement | null;
    if (root) root.dataset.theme = theme;
    localStorage.setItem("eben-network-theme", theme);
  }, [theme]);

  const mobile = [
    { href: "/network", label: "Home", icon: Home },
    { href: "/network/tools", label: "Tools", icon: Wrench },
    { href: "/network/developers", label: "Dev", icon: Code2 },
    { href: "/network/resources", label: "Resources", icon: BookOpen },
    { href: `${AI_URL}?mode=general`, label: "AI", icon: Sparkles, external: true },
  ];

  return (
    <div className="nx-root has-mobile-pad" data-theme={theme}>
      <header className="nx-header">
        <div className="nx-page nx-header-inner">
          <Link href="/network" className="nx-logo">
            <strong>EBENEZER DIGITAL</strong>
            <span>Network</span>
          </Link>
          <nav className="nx-nav" aria-label="Primary">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <a
              href={`${AI_URL}?mode=general`}
              onClick={() => trackNetworkEvent("ai_click", { from: "header" })}
            >
              AI
            </a>
            <Link href="/network/tools" className="nx-btn nx-btn-primary !py-2 !px-3 !text-sm">
              Explore Tools
            </Link>
            <button
              type="button"
              className="nx-btn nx-btn-ghost !py-2 !px-2"
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/network/tools" aria-label="Search tools" className="nx-btn nx-btn-ghost !p-2">
              <Search className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="nx-btn nx-btn-ghost !p-2"
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="nx-footer">
        <div className="nx-page grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-bold">Ebenezer Digital Network</p>
            <p className="mt-2 text-sm text-[var(--nx-muted)] max-w-sm">
              Free tools. Smart technology. Better digital work.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--nx-muted)]">Tools</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/network/tools">All tools</Link>
              <Link href="/network/tools?category=developer">Developer</Link>
              <Link href="/network/tools?category=seo">SEO</Link>
              <Link href="/network/finder">Tool finder</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--nx-muted)]">Learn</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/network/developers">Developers</Link>
              <Link href="/network/resources">Resources</Link>
              <Link href="/network/guides">Guides</Link>
              <a href={JOURNAL_URL}>Journal</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--nx-muted)]">Company</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/network/about">About</Link>
              <Link href="/network/contact">Contact</Link>
              <Link href="/network/privacy">Privacy</Link>
              <Link href="/network/terms">Terms</Link>
              <Link href="/network/affiliate-disclosure">Affiliate disclosure</Link>
            </div>
          </div>
        </div>
        <div className="nx-page mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--nx-line)] pt-6 text-sm text-[var(--nx-muted)]">
          <a href={SITE_URL}>Services</a>
          <a href={STORE_URL}>Store</a>
          <a href={TOOLS_URL}>Software tools</a>
          <a href={PRODUCTS_URL}>Hardware</a>
          <a href={AI_URL} onClick={() => trackNetworkEvent("ai_click", { from: "footer" })}>
            AI
          </a>
          <span className="ml-auto">© {new Date().getFullYear()} Ebenezer Digital</span>
        </div>
      </footer>

      <nav className="nx-mobile-nav" aria-label="Mobile">
        {mobile.map((item) => {
          const Icon = item.icon;
          const active = !item.external && (item.href === "/network" ? pathname === "/network" : pathname.startsWith(item.href));
          const className = active ? "is-active" : "";
          if (item.external) {
            return (
              <a key={item.label} href={item.href} className={className} onClick={() => trackNetworkEvent("ai_click", { from: "mobile_nav" })}>
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          }
          return (
            <Link key={item.label} href={item.href} className={className}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

// silence unused in case of tree shaking confusion
void basePath;
