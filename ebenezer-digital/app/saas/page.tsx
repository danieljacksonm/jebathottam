import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";
import { SITE_NAV } from "@/lib/site-nav";
import { SiteContactLinks } from "@/components/SiteContactLinks";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import { SaasHeader } from "./SaasHeader";
import { BILLING_LOGIN_PATH, BILLING_REGISTER_PATH } from "@/lib/billing-url";
import "./saas.css";

export const metadata: Metadata = pageMetadata({
  title: "Yegova Billing | Free Cloud Billing for Traders & Shops",
  description:
    "Yegova Billing is free cloud billing for Indian shops — GST invoices, stock, party ledger, thermal print, and reports. No credit card needed.",
  path: "/saas",
});

const BILLING_URL = BILLING_LOGIN_PATH;
const REGISTER_URL = BILLING_REGISTER_PATH;

const features = [
  {
    title: "Invoice Studio",
    desc: "Create GST invoices fast — barcode search, discount, round-off, and cash / UPI / card / credit payment modes.",
  },
  {
    title: "GST Reports",
    desc: "CGST and SGST rate-wise reports, day book, sales summary, and payment-mode split ready for review.",
  },
  {
    title: "Stock Control",
    desc: "Stock inward, adjustments, movement history, and low-stock alerts on the dashboard.",
  },
  {
    title: "Party Ledger",
    desc: "Track customer balances, outstanding dues, and full account statements in one place.",
  },
  {
    title: "Quotes & Credit Notes",
    desc: "Convert quotations to invoices in one click. Credit notes restore stock automatically.",
  },
  {
    title: "Print Formats",
    desc: "Print on A4, A5, thermal 80mm, or 58mm — choose the paper your counter already uses.",
  },
];

export default function SaasLandingPage() {
  return (
    <main className="saas-root">
      <SaasHeader />

      <section className="saas-hero">
        <p className="saas-kicker">Free cloud billing for Indian shops</p>
        <h1>Yegova Billing</h1>
        <p className="saas-lead">
          Invoices, GST reports, stock, party ledger, and thermal print — built for traders who need a calm,
          clear counter tool. Free to start. No credit card.
        </p>
        <div className="saas-cta-row">
          <a className="saas-btn saas-btn-gold" href={REGISTER_URL}>
            Start free — sign in
          </a>
          <a className="saas-btn saas-btn-ghost" href={BILLING_URL}>
            Sign in to your shop
          </a>
        </div>

        <ul className="saas-feature-strip" aria-label="Core capabilities">
          {features.slice(0, 4).map((f) => (
            <li key={f.title}>
              <strong>{f.title}</strong>
              <span>{f.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="saas-section">
        <h2>What your shop gets</h2>
        <p className="saas-sub">
          Built for kirana stores, mobile shops, travel desks, and small traders who need billing without
          complicated software.
        </p>
        <div className="saas-grid">
          {features.map((f) => (
            <article key={f.title} className="saas-card">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="saas-section saas-section-soft">
        <h2>Start in three steps</h2>
        <ol className="saas-steps">
          <li>
            <strong>1</strong>
            <span>Register your shop</span>
          </li>
          <li>
            <strong>2</strong>
            <span>Add products and customers</span>
          </li>
          <li>
            <strong>3</strong>
            <span>Create your first invoice</span>
          </li>
        </ol>
        <a className="saas-btn saas-btn-gold" href={BILLING_URL}>
          Create free shop account
        </a>
      </section>

      <section className="saas-section">
        <h2>Plans</h2>
        <div className="saas-grid saas-grid-3">
          <article className="saas-card">
            <h3>Free trial</h3>
            <p>Use the core billing tools free. No card required to begin.</p>
            <a href={BILLING_URL}>Start free</a>
          </article>
          <article className="saas-card">
            <h3>Online plan</h3>
            <p>Cloud sync, multi-device access, and team seats — coming soon.</p>
            <a href={BILLING_URL}>Get notified</a>
          </article>
          <article className="saas-card">
            <h3>Offline plan</h3>
            <p>Work without internet and sync later — coming soon.</p>
            <a href={BILLING_URL}>Get notified</a>
          </article>
        </div>
      </section>

      <footer className="saas-foot">
        <SiteContactLinks className="saas-contact" linkClassName="saas-contact-link" />
        <p>
          <Link href={SITE_NAV.store}>Browse store kits</Link>
          {" · "}
          <Link href={SITE_NAV.home}>Ebenezer Digital</Link>
        </p>
        <p className="saas-copy">© {new Date().getFullYear()} Ebenezer Digital · Yegova Billing</p>
        <SiteLegalLinks className="saas-copy mt-2" linkClassName="saas-contact-link" />
      </footer>
    </main>
  );
}
