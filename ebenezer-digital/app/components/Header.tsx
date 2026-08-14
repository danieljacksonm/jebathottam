"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticLink } from "../studio/MagneticLink";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "News", href: "/blog/news" },
  { label: "Journal", href: "/blog" },
  { label: "Store", href: "/products" },
  { label: "SaaS billing", href: "/saas" },
  { label: "Eben AI", href: "/ai" },
];

const productLinks = [
  { label: "News", href: "/blog/news", hint: "World news desk" },
  { label: "Journal", href: "/blog", hint: "Learning blog" },
  { label: "Store", href: "/products", hint: "Digital products" },
  { label: "SaaS billing", href: "/saas", hint: "Shop invoices & stock" },
  { label: "Eben AI", href: "/ai", hint: "Chat on our server" },
];

const serviceLinks = [
  { label: "Digital & Admin", href: "/services#digital" },
  { label: "Web & Technical", href: "/services#web" },
  { label: "Travel & Booking", href: "/services#travel" },
  { label: "Other Services", href: "/services#other" },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  const active = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header className={`studio-nav ${isScrolled ? "is-solid" : ""}`}>
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
                  className="absolute left-0 top-full mt-3 w-56 border border-[var(--st-line)] bg-[#070708]/90 p-2 backdrop-blur-xl"
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
          {navLinks.slice(1, 2).map((link) => (
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
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <button
              type="button"
              className={`text-[11px] uppercase tracking-[0.18em] ${
                productLinks.some((p) => active(p.href)) ? "text-emerald-400" : "text-white/60 hover:text-white"
              }`}
            >
              Products
            </button>
            <AnimatePresence>
              {isProductsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 top-full mt-3 w-64 border border-[var(--st-line)] bg-[#070708]/90 p-2 backdrop-blur-xl"
                >
                  {productLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2"
                      onClick={() => setIsProductsOpen(false)}
                    >
                      <span className="block text-sm text-white">{link.label}</span>
                      <span className="text-[11px] text-white/40">{link.hint}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <MagneticLink href="/contact" className="studio-btn hidden sm:inline-flex" cursor="START">
            Let’s talk
          </MagneticLink>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
            className="fixed inset-0 z-[70] bg-[#070708] px-6 pt-28"
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
                href="/process"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 text-sm text-white/50"
              >
                Process
              </Link>
              <Link
                href="/why"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-1 text-sm text-white/50"
              >
                About
              </Link>
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-1 text-sm text-white/50"
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
              Let’s talk
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
