import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";

export const metadata: Metadata = pageMetadata({
  title: "Yegova Billing | Free Cloud Billing for Traders",
  description:
    "Yegova is a free, modern cloud billing app for shops and traders — invoices, GST reports, stock, customers, and thermal print. Built for Indian small businesses.",
  path: "/saas",
});

const BILLING_URL =
  process.env.NEXT_PUBLIC_BILLING_URL || "https://billing.ebenezerdigital.com";

const features = [
  {
    icon: "🧾",
    title: "Invoice Studio",
    desc: "Create GST invoices in seconds — barcode search, discount, round-off, UPI/Cash/Card/Credit payment modes.",
  },
  {
    icon: "📊",
    title: "GST Reports",
    desc: "Auto-generated CGST/SGST rate-wise reports, day book, sales summary, and payment mode split.",
  },
  {
    icon: "📦",
    title: "Stock Management",
    desc: "Stock inward, adjustments, movement history, and low-stock alerts on your dashboard.",
  },
  {
    icon: "👥",
    title: "Party Ledger",
    desc: "Track customer balances, outstanding dues, and full account statements.",
  },
  {
    icon: "📋",
    title: "Quotations & Credit Notes",
    desc: "Convert quotes to invoices in one click. Issue credit notes with automatic stock restore.",
  },
  {
    icon: "🖨️",
    title: "Multi-Format Print",
    desc: "Print on A4, A5, thermal 80mm, or 58mm — all paper sizes supported.",
  },
];

const steps = [
  { n: "1", label: "Register your shop" },
  { n: "2", label: "Add your products & customers" },
  { n: "3", label: "Create your first invoice" },
];

export default function SaasLandingPage() {
  return (
    <main className="min-h-screen bg-[#0d1a14] text-[#f7f3eb]">
      {/* Hero */}
      <section
        className="relative overflow-hidden px-6 py-24 text-center"
        style={{
          background:
            "radial-gradient(900px 500px at 50% 0%, rgba(31,77,58,0.28), transparent 60%), linear-gradient(180deg, #0d1a14 0%, #0f2118 100%)",
        }}
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#c4a36a]">
          Free · Cloud · Made for India
        </p>
        <h1 className="font-display mx-auto max-w-3xl text-5xl leading-tight text-[#f7f3eb] md:text-7xl">
          Yegova Billing
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#d7e4dc] md:text-lg">
          A premium billing experience for traders and shop owners — GST
          invoices, stock, party ledger, thermal print, and more. Free to use.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={BILLING_URL + "/register"}
            className="rounded-full bg-[#c4a36a] px-8 py-3.5 text-sm font-semibold text-[#1a1408] transition hover:opacity-90"
          >
            Start Free — Open App
          </a>
          <a
            href={BILLING_URL + "/login"}
            className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-[#f7f3eb] transition hover:bg-white/5"
          >
            Sign in to your Shop
          </a>
        </div>

        {/* Mini dashboard preview */}
        <div className="mx-auto mt-16 hidden max-w-3xl overflow-hidden rounded-[28px] border border-white/10 p-1 backdrop-blur md:block"
          style={{ background: "rgba(255,252,247,0.05)" }}>
          <div
            className="rounded-[24px] p-6 text-left text-[#171a17]"
            style={{ background: "linear-gradient(135deg, #fffcf7, #efe8dc)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#9a7840]">
                  Today&apos;s Sales
                </div>
                <div className="mt-1 font-mono text-3xl font-semibold">₹48,260</div>
              </div>
              <div className="rounded-full bg-[#1f4d3a] px-4 py-2 text-xs font-semibold text-[#f7f3eb]">
                + New Invoice
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {["12 Bills today", "86 Products", "41 Customers"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-black/5 bg-white/70 px-4 py-5 text-sm font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-semibold text-[#f7f3eb]">
          Everything a shop needs
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 p-6"
              style={{ background: "rgba(255,252,247,0.04)" }}
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-[#f7f3eb]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#a8c0b4]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        className="px-6 py-20"
        style={{ background: "rgba(31,77,58,0.08)" }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-12 text-3xl font-semibold text-[#f7f3eb]">
            Get started in 3 steps
          </h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c4a36a] text-lg font-bold text-[#1a1408]">
                  {s.n}
                </div>
                <p className="text-sm font-medium text-[#d7e4dc]">{s.label}</p>
              </div>
            ))}
          </div>
          <a
            href={BILLING_URL + "/register"}
            className="mt-12 inline-flex rounded-full bg-[#c4a36a] px-8 py-3.5 text-sm font-semibold text-[#1a1408] transition hover:opacity-90"
          >
            Open Yegova Billing — It&apos;s Free
          </a>
        </div>
      </section>

      {/* Pricing note */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              label: "Free Trial",
              desc: "Use all features free. No credit card needed.",
              cta: "Start Free",
              href: "/register",
            },
            {
              label: "Online Plan",
              desc: "Cloud sync, multi-device, team access. Coming soon.",
              cta: "Get Notified",
              href: "/register",
            },
            {
              label: "Offline Plan",
              desc: "Works without internet. Sync when back online. Coming soon.",
              cta: "Get Notified",
              href: "/register",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[24px] border border-white/15 p-6"
              style={{ background: "rgba(255,252,247,0.05)" }}
            >
              <div className="mb-1 text-2xl font-semibold text-[#c4a36a]">
                {card.label}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#a8c0b4]">
                {card.desc}
              </p>
              <a
                href={`${BILLING_URL}${card.href}`}
                className="mt-5 inline-flex rounded-full bg-[#c4a36a] px-5 py-2 text-xs font-semibold text-[#1a1408] transition hover:opacity-90"
              >
                {card.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#6b9080]">
          Yegova Billing is built by Ebenezer Digital. Data is yours — always.
        </p>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/10 px-6 py-12 text-center">
        <p className="text-sm text-[#6b9080]">
          Already using the old in-browser billing?{" "}
          <a
            href={BILLING_URL + "/register"}
            className="text-[#c4a36a] underline underline-offset-2 hover:opacity-80"
          >
            Switch to Yegova — your data moves with you.
          </a>
        </p>
        <p className="mt-4 text-xs text-[#4a7060]">
          © {new Date().getFullYear()} Ebenezer Digital · Yegova Billing
        </p>
      </section>
    </main>
  );
}
