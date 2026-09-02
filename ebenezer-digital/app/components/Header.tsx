"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticLink } from "../studio/MagneticLink";
import { SITE_NAV } from "@/lib/site-nav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/why" },
];

const serviceLinks = [
  { label: "Digital & Admin", href: "/services#digital" },
  { label: "Web & Technical", href: "/services#web" },
  { label: "Travel & Booking", href: "/services#travel" },
  { label: "Other Services", href: "/services#other" },
];

const ecosystemLinks = [
  { label: "Journal", href: SITE_NAV.journal },
  { label: "News", href: SITE_NAV.news },
  { label: "Tools", href: SITE_NAV.tools },
  { label: "Store", href: SITE_NAV.store },
  { label: "Free tools", href: SITE_NAV.network },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const active = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header
        className={`studio-nav ${isScrolled ? "is-solid" : ""} ${isMobileMenuOpen ? "z-[80]" : ""}`}
      >
        <Link href="/" className="flex items-center gap-2" data-cursor="OPEN">
          <Image src="/brand/eben-mark.svg" alt="Ebenezer" width={28} height={28} className="rounded-md" />
          <span className="hidden font-display text-sm tracking-[0.12em] text-white sm:inline">
            EBENEZER
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <Link
              href="/services"
              className={`text-[11px] uppercase tracking-[0.18em] ${
                active("/services") ? "text-emerald-400" : "text-white/60 hover:text-white"
              }`}
            >
              Services
            </Link>
            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 top-full mt-3 w-56 border border-[var(--st-line)] bg-[#070708]/95 p-2 backdrop-blur-xl"
                >
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 text-sm text-white/70 hover:text-white"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] uppercase tracking-[0.18em] ${
                active(link.href) ? "text-emerald-400" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div
            className="relative"
            onMouseEnter={() => setIsEcosystemOpen(true)}
            onMouseLeave={() => setIsEcosystemOpen(false)}
          >
            <button
              type="button"
              className="text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-white"
            >
              Ecosystem
            </button>
            <AnimatePresence>
              {isEcosystemOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-3 w-52 border border-[var(--st-line)] bg-[#070708]/95 p-2 backdrop-blur-xl"
                >
                  {ecosystemLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 text-sm text-white/70 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <MagneticLink href="/contact" className="studio-btn hidden sm:inline-flex" cursor="START">
            Let&apos;s talk
          </MagneticLink>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="relative z-[90] px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#070708] px-6 pt-28 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="studio-display block py-2 text-4xl text-white sm:text-5xl"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="studio-display block py-2 text-4xl text-white/80 sm:text-5xl"
              >
                Contact
              </Link>
              <p className="pt-6 text-[10px] uppercase tracking-[0.2em] text-white/35">Ecosystem</p>
              {ecosystemLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1.5 text-sm text-white/50 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1 text-sm text-white/40"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="studio-btn mt-10 inline-flex"
            >
              Let&apos;s talk
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
