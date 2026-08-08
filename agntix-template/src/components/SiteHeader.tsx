"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

const links = [
  { href: "/", key: "home" as const },
  { href: "/kodaikanal", key: "kodaikanal" as const },
  { href: "/packages", key: "packages" as const },
  { href: "/services", key: "services" as const },
  { href: "/blog", key: "blog" as const },
  { href: "/about", key: "about" as const },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 ${
        scrolled ? "is-scrolled" : ""
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/brand/canaan-logo.jpeg"
            alt="Canaan Travel Hub"
            width={48}
            height={48}
            className="h-11 w-11 rounded-full object-cover ring-1 ring-gold/50"
            priority
          />
          <span className="leading-none">
            <span className="font-script block text-[1.7rem] text-gold-bright">
              {t("brand")}
            </span>
            <span className="mt-0.5 block text-[0.58rem] font-medium uppercase tracking-[0.32em] text-mist">
              {t("brandSub")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.68rem] uppercase tracking-[0.18em] transition-colors ${
                  active ? "text-gold-bright" : "text-white/70 hover:text-gold"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Link href="/enquire" className="btn-gold !px-5 !py-2.5 text-[0.66rem]">
            {t("bookNow")}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-[var(--line)] p-2 text-white xl:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[var(--line)] bg-navy-mid/95 backdrop-blur-xl xl:hidden"
          >
            <nav className="flex flex-col gap-4 px-5 py-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm uppercase tracking-[0.14em] text-white/85"
                  onClick={() => setOpen(false)}
                >
                  {t(link.key)}
                </Link>
              ))}
              <Link href="/enquire" className="btn-gold w-full" onClick={() => setOpen(false)}>
                {t("bookNow")}
              </Link>
              <LanguageSwitcher />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
