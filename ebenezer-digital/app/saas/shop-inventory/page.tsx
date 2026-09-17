import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site-url";
import { SaasHeader } from "../SaasHeader";
import { BILLING_LOGIN_PATH, BILLING_REGISTER_PATH } from "@/lib/billing-url";
import "../saas.css";

export const metadata: Metadata = pageMetadata({
  title: "Shop Inventory Software | Stock & Billing | Yegova",
  description:
    "Track shop stock, low-stock alerts, and billing in one cloud app. Built for Indian retail — GST-ready invoices included.",
  path: "/saas/shop-inventory",
});

export default function ShopInventoryPage() {
  return (
    <main className="saas-root">
      <SaasHeader />
      <section className="saas-hero saas-hero-sub">
        <p className="saas-kicker">Capability</p>
        <h1>Shop inventory software for retail</h1>
        <p className="saas-lead">
          Add products, track quantities, and bill customers from one dashboard. Yegova Billing connects stock
          movements to GST invoices automatically.
        </p>
        <div className="saas-cta-row">
          <Link href={BILLING_REGISTER_PATH} className="saas-btn saas-btn-primary">
            Start free
          </Link>
          <Link href={BILLING_LOGIN_PATH} className="saas-btn saas-btn-ghost">
            Sign in
          </Link>
        </div>
      </section>

      <section className="saas-section">
        <h2>Inventory features</h2>
        <ul className="saas-list">
          <li>Product catalog with SKU, HSN, and GST rate</li>
          <li>Stock in / stock out tied to invoices</li>
          <li>Party ledger for customers and suppliers</li>
          <li>Reports for sales and tax filing</li>
        </ul>
      </section>

      <section className="saas-section saas-faq">
        <h2>FAQ</h2>
        <article>
          <h3>Does inventory sync across devices?</h3>
          <p>Yes — cloud accounts sync stock and invoices when you are online.</p>
        </article>
        <article>
          <h3>Can I import existing products?</h3>
          <p>Manual entry is supported today; bulk import is on the roadmap.</p>
        </article>
      </section>
    </main>
  );
}
