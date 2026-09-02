"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE_NAV } from "@/lib/site-nav";
import { SAAS_URL } from "@/lib/site-url";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BILLING_LOGIN_PATH, BILLING_REGISTER_PATH } from "@/lib/billing-url";

const SAAS_LOGIN = BILLING_LOGIN_PATH;

export function SaasHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="saas-top">
      <div className="saas-top-inner">
        <Link href={SAAS_URL} className="saas-brand" aria-label="Yegova Billing home">
          <span className="saas-brand-mark">E</span>
          <span>
            <strong>Yegova</strong>
            <em>by Ebenezer Digital</em>
          </span>
        </Link>
        <nav className="saas-top-nav saas-top-nav-desktop" aria-label="SaaS links">
          <LanguageSwitcher compact />
          <Link href={SITE_NAV.store}>Store</Link>
          <Link href={SITE_NAV.journal}>Journal</Link>
          <Link href={SAAS_LOGIN}>Sign in</Link>
          <Link className="saas-btn saas-btn-gold" href={SAAS_LOGIN}>
            Start free
          </Link>
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
          <Link href={SAAS_LOGIN} onClick={() => setOpen(false)}>
            Sign in
          </Link>
          <Link className="saas-btn saas-btn-gold" href={SAAS_LOGIN} onClick={() => setOpen(false)}>
            Start free
          </Link>
        </nav>
      )}
    </header>
  );
}
