import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site-url";
import { SaasHeader } from "../SaasHeader";
import { BILLING_LOGIN_PATH, BILLING_REGISTER_PATH } from "@/lib/billing-url";
import "../saas.css";

export const metadata: Metadata = pageMetadata({
  title: "GST Billing Software for Small Business | Yegova Billing",
  description:
    "Free cloud GST billing for Indian shops — invoices, stock, party ledger, CGST/SGST reports, and thermal print. Built for retail and traders.",
  path: "/saas/gst-billing",
});

export default function GstBillingPage() {
  return (
    <main className="saas-root">
      <SaasHeader />
      <section className="saas-hero saas-hero-sub">
        <p className="saas-kicker">Capability</p>
        <h1>GST billing software for small business</h1>
        <p className="saas-lead">
          Yegova Billing helps Indian shops create GST invoices, track stock, manage party ledgers, and print on
          thermal or A4 — without a credit card to start.
        </p>
        <div className="saas-cta-row">
          <Link href={BILLING_REGISTER_PATH} className="saas-btn saas-btn-primary">
            Start free
          </Link>
          <Link href={BILLING_LOGIN_PATH} className="saas-btn saas-btn-ghost">
            Sign in
          </Link>
          <Link href="/saas" className="saas-btn saas-btn-ghost">
            All features
          </Link>
        </div>
      </section>

      <section className="saas-section">
        <h2>What you can do today</h2>
        <ul className="saas-list">
          <li>GST invoices with CGST/SGST split</li>
          <li>Stock inward, adjustments, and low-stock alerts</li>
          <li>Party ledger and outstanding balances</li>
          <li>Quotes → invoices in one click</li>
          <li>Thermal 58mm / 80mm and A4 print formats</li>
        </ul>
      </section>

      <section className="saas-section">
        <h2>FAQ</h2>
        <div className="saas-faq">
          <div>
            <h3>Is it really free to start?</h3>
            <p>Yes — register and use core billing without a credit card. Paid plans may apply for advanced needs.</p>
          </div>
          <div>
            <h3>Does it replace a chartered accountant?</h3>
            <p>No. It helps daily billing and reports. Final GST filing should follow your CA&apos;s advice.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
