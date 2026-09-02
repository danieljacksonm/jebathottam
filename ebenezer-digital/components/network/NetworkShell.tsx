"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Home,
  Moon,
  Monitor,
  Search,
  Sparkles,
  Sun,
  Wrench,
  LayoutGrid,
} from "lucide-react";
import { AI_URL, JOURNAL_URL, PRODUCTS_URL, SITE_URL, STORE_URL, TOOLS_URL } from "@/lib/site-url";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { trackNetworkEvent } from "@/lib/network/analytics";
import { PUBLIC_CATEGORIES } from "@/lib/network/paths";
import { CATEGORY_LABELS } from "@/lib/network/types";

const NAV = [
  { href: "/network/tools", label: "Tools", match: "/network/tools" },
  { href: "/network/tools/c/developer", label: "Categories", match: "/network/tools/c" },
  { href: "/network/resources", label: "Resources", match: "/network/resources" },
  { href: "/network/guides", label: "Guides", match: "/network/guides" },
];

type ThemeMode = "light" | "dark" | "system";

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

export function NetworkShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/network";
  const [mode, setMode] = useState<ThemeMode>("system");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("eben-network-theme-mode") as ThemeMode | null;
    const legacy = localStorage.getItem("eben-network-theme") as "light" | "dark" | null;
    const nextMode: ThemeMode = saved || (legacy ? legacy : "system");
    setMode(nextMode);
    setTheme(resolveTheme(nextMode));
  }, []);

  useEffect(() => {
    const applied = resolveTheme(mode);
    setTheme(applied);
    const root = document.querySelector(".nx-root") as HTMLElement | null;
    if (root) root.dataset.theme = applied;
    localStorage.setItem("eben-network-theme-mode", mode);
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => setTheme(resolveTheme("system"));
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, [mode]);

  useEffect(() => {
    const root = document.querySelector(".nx-root") as HTMLElement | null;
    if (root) root.dataset.theme = theme;
  }, [theme]);

  function cycleTheme() {
    setMode((m) => (m === "light" ? "dark" : m === "dark" ? "system" : "light"));
  }

  const ThemeIcon = mode === "system" ? Monitor : theme === "light" ? Moon : Sun;

  const mobile = [
    { href: "/network", label: "Home", icon: Home },
    { href: "/network/tools", label: "Tools", icon: Wrench },
    { href: "/network/tools/c/developer", label: "Browse", icon: LayoutGrid },
    { href: "/network/resources", label: "Learn", icon: BookOpen },
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
              <Link
                key={item.href}
                href={item.href}
                className={pathname.startsWith(item.match) ? "is-active" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`${AI_URL}?mode=general`}
              onClick={() => trackNetworkEvent("ai_click", { from: "header" })}
            >
              AI
            </a>
            <Link href="/network/tools" className="nx-btn nx-btn-ghost !py-2 !px-3 !text-sm" aria-label="Search tools">
              <Search className="h-4 w-4" />
              Search
            </Link>
            <Link href="/network/tools" className="nx-btn nx-btn-primary !py-2 !px-3 !text-sm">
              Explore Tools
            </Link>
            <LanguageSwitcher compact />
            <button
              type="button"
              className="nx-btn nx-btn-ghost !py-2 !px-2"
              aria-label={`Theme: ${mode}. Click to change.`}
              title={`Theme: ${mode}`}
              onClick={cycleTheme}
            >
              <ThemeIcon className="h-4 w-4" />
            </button>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/network/tools" aria-label="Search tools" className="nx-btn nx-btn-ghost !p-2">
              <Search className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="nx-btn nx-btn-ghost !p-2"
              aria-label={`Theme: ${mode}. Click to change.`}
              onClick={cycleTheme}
            >
              <ThemeIcon className="h-4 w-4" />
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
              Free tools that just work — fast, private in your browser, and simple enough for anyone.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--nx-muted)]">Tools</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/network/tools">All tools</Link>
              {PUBLIC_CATEGORIES.slice(0, 4).map((c) => (
                <Link key={c} href={`/network/tools/c/${c}`}>
                  {CATEGORY_LABELS[c]}
                </Link>
              ))}
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
        <SiteLegalLinks className="nx-page mt-4 text-xs text-[var(--nx-muted)]" linkClassName="hover:text-[var(--nx-ink)]" />
      </footer>

      <nav className="nx-mobile-nav" aria-label="Mobile">
        {mobile.map((item) => {
          const Icon = item.icon;
          const active =
            !item.external &&
            (item.href === "/network" ? pathname === "/network" : pathname.startsWith(item.href));
          const className = active ? "is-active" : "";
          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                className={className}
                onClick={() => trackNetworkEvent("ai_click", { from: "mobile_nav" })}
              >
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
