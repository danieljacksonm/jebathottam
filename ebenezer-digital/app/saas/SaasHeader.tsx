"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE_NAV } from "@/lib/site-nav";

const BILLING_URL =
  process.env.NEXT_PUBLIC_BILLING_URL || "https://billing.ebenezerdigital.com";

export function SaasHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="saas-top">
      <div className="saas-top-inner">
        <Link href={SITE_NAV.home} className="saas-brand">
          <span className="saas-brand-mark">E</span>
          <span>
            <strong>Yegova</strong>
            <em>by Ebenezer Digital</em>
          </span>
        </Link>
        <nav className="saas-top-nav saas-top-nav-desktop" aria-label="SaaS links">
          <Link href={SITE_NAV.store}>Store</Link>
          <Link href={SITE_NAV.journal}>Journal</Link>
          <a href={`${BILLING_URL}/login`}>Sign in</a>
          <a className="saas-btn saas-btn-gold" href={`${BILLING_URL}/register`}>
            Start free
          </a>
        </nav>
        <button
          type="button"
          className="saas-menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <nav className="saas-top-nav-mobile" aria-label="Mobile">
          <Link href={SITE_NAV.store} onClick={() => setOpen(false)}>
            Store
          </Link>
          <Link href={SITE_NAV.journal} onClick={() => setOpen(false)}>
            Journal
          </Link>
          <a href={`${BILLING_URL}/login`} onClick={() => setOpen(false)}>
            Sign in
          </a>
          <a className="saas-btn saas-btn-gold" href={`${BILLING_URL}/register`}>
            Start free
          </a>
        </nav>
      )}
    </header>
  );
}
