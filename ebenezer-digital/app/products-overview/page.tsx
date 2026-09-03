import Link from "next/link";
import { pageMetadata, JOURNAL_URL, NEWS_URL, STORE_URL, TOOLS_URL, SAAS_URL, AI_URL } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Products & platforms | Ebenezer Digital",
  description:
    "Ebenezer Digital owns and builds Store, Tools, SaaS, Eben AI, E> News, and E> Journal — one company, clear product surfaces.",
  path: "/products-overview",
});

const PRODUCTS = [
  {
    name: "Ebenezer Store",
    href: STORE_URL,
    blurb: "Digital products, templates, and business kits.",
  },
  {
    name: "Ebenezer Tools",
    href: TOOLS_URL,
    blurb: "Software discovery, comparison, and editorial reviews.",
  },
  {
    name: "Ebenezer SaaS",
    href: SAAS_URL,
    blurb: "Cloud billing and shop operations (Yegova).",
  },
  {
    name: "Eben AI",
    href: AI_URL,
    blurb: "AI assistant across the Ebenezer ecosystem.",
  },
  {
    name: "E> News",
    href: NEWS_URL,
    blurb: "Current events with clear source attribution.",
  },
  {
    name: "E> Journal",
    href: JOURNAL_URL,
    blurb: "Evergreen guides and practical digital learning.",
  },
];

export default function ProductsOverviewPage() {
  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">Products</p>
      <h1 className="studio-display mt-4 max-w-4xl text-5xl sm:text-7xl">WHAT WE BUILD.</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">
        Parent company Ebenezer Digital. Each product has its own domain and purpose — not a pile of
        unrelated sites.
      </p>
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <a
            key={p.name}
            href={p.href}
            className="border border-[var(--st-line)] p-6 transition hover:border-emerald-500/40"
          >
            <h2 className="studio-display text-2xl">{p.name}</h2>
            <p className="mt-3 text-[var(--st-muted)]">{p.blurb}</p>
          </a>
        ))}
      </div>
      <p className="mt-12 text-sm text-[var(--st-muted)]">
        Looking for services instead?{" "}
        <Link href="/services" className="underline hover:text-white">
          See what we offer
        </Link>
        .
      </p>
    </main>
  );
}
