"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

const centerLinks = [
  { href: "/", key: "home" as const },
  { href: "/destinations", key: "destinations" as const },
  { href: "/packages", key: "packages" as const },
  { href: "/corporate-travel", key: "corporate" as const },
  { href: "/services", key: "services" as const },
  { href: "/blog", key: "blog" as const },
] as const;

const rightLinks = [
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
] as const;

const mobileLinks = [...centerLinks, ...rightLinks];

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 ${
        scrolled || open ? "is-scrolled" : ""
      }`}
    >
      <div className="site-header__bar">
        <Link
          href="/"
          className="site-header__brand"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/canaan-logo.jpeg"
            alt="Canaan Travel Hub"
            width={40}
            height={40}
            className="site-header__logo"
            priority
          />
          <span className="site-header__wordmark">
            <span className="site-header__name">{t("brand")}</span>
            <span className="site-header__sub">{t("brandSub")}</span>
          </span>
        </Link>

        <nav className="site-header__nav" aria-label="Primary">
          {centerLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`site-header__link ${active ? "is-active" : ""}`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="site-header__actions">
          <nav className="site-header__utility" aria-label="Company">
            {rightLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`site-header__link ${active ? "is-active" : ""}`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>
          <div className="site-header__tools">
            <LanguageSwitcher />
            <Link
              href="/plan-your-trip"
              className="btn-gold site-header__cta"
              data-cursor="book"
            >
              {t("planTrip")}
            </Link>
          </div>
          <button
            type="button"
            className="site-header__menu-btn"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={`site-header__drawer ${open ? "is-open" : ""}`}
        hidden={!open}
      >
        <nav className="site-header__drawer-nav" aria-label="Mobile">
          {mobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-header__drawer-link"
              onClick={() => setOpen(false)}
            >
              {t(link.key)}
            </Link>
          ))}
          <Link
            href="/plan-your-trip"
            className="btn-gold mt-4 w-full"
            onClick={() => setOpen(false)}
          >
            {t("planTrip")}
          </Link>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
