"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Screens", href: "/shop?category=screens" },
    { label: "Batteries", href: "/shop?category=batteries" },
    { label: "Chargers", href: "/shop?category=chargers" },
    { label: "Accessories", href: "/shop?category=accessories" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Track Order", href: "/account/orders" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping Info", href: "/shipping" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "GST Information", href: "/gst" },
  ],
};

const brands = ["Samsung", "Apple", "Xiaomi", "Realme", "OPPO", "Vivo", "OnePlus", "Nokia"];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
      {/* Brand Strip */}
      <div className="border-b border-[var(--border)] py-6">
        <div className="container mx-auto px-4">
          <p className="mb-4 text-center text-sm font-medium text-[var(--foreground-tertiary)]">
            We stock spare parts for all major brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-lg font-bold text-[var(--foreground-muted)] grayscale transition-all hover:grayscale-0 hover:text-[var(--foreground)]"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <span className="text-2xl font-bold text-[var(--foreground)]">
                Sri Krishna<span className="text-[var(--primary)]">Mobiles</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm text-[var(--foreground-tertiary)]">
              Your trusted source for genuine mobile spare parts and accessories. 
              Quality products, affordable prices, and excellent customer service.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-[var(--foreground-secondary)]">
                <Phone className="h-4 w-4 text-[var(--primary)]" />
                <span>+91-98765-43210</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--foreground-secondary)]">
                <Mail className="h-4 w-4 text-[var(--primary)]" />
                <span>support@srikrishnamobiles.com</span>
              </div>
              <div className="flex items-start gap-3 text-[var(--foreground-secondary)]">
                <MapPin className="h-4 w-4 text-[var(--primary)]" />
                <span>123 Mobile Market, Chennai, Tamil Nadu - 600001</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-4 font-semibold text-[var(--foreground)]">Shop</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--foreground-tertiary)] transition-colors hover:text-[var(--primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 font-semibold text-[var(--foreground)]">Support</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--foreground-tertiary)] transition-colors hover:text-[var(--primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 font-semibold text-[var(--foreground)]">Company</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--foreground-tertiary)] transition-colors hover:text-[var(--primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border)] py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-sm text-[var(--foreground-muted)]">
            © {new Date().getFullYear()} Sri Krishna Mobiles. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--foreground-muted)]">Follow us:</span>
            {["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => (
              <Link
                key={social}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background-tertiary)] text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primary)] hover:text-white"
              >
                <span className="sr-only">{social}</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
