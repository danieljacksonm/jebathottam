import Link from "next/link";
import { CatalogNav } from "./components/CatalogNav";
import { SiteLegalLinks } from "@/components/SiteLegalLinks";
import { ProductCard } from "./components/ProductCard";
import { SmartSearch } from "./components/SmartSearch";
import { CatalogAskAi } from "./components/CatalogAskAi";
import { CATALOG_CATEGORIES } from "./data";
import { listActiveProducts, listGuides, listComparisons } from "@/lib/catalog/query";
import { discloseAffiliate } from "@/lib/catalog/affiliate";

const POPULAR = ["laptops", "ssd", "ram", "monitors", "gpu", "smartphones"] as const;

export default function CatalogHomePage() {
  const trending = listActiveProducts().slice(0, 6);
  const categories = CATALOG_CATEGORIES.filter((c) => POPULAR.includes(c.id as (typeof POPULAR)[number]));
  const guides = listGuides().slice(0, 3);
  const comparisons = listComparisons().slice(0, 2);
  const all = listActiveProducts();

  return (
    <>
      <CatalogNav />

      <section className="aff-hero">
        <div className="aff-page py-14 sm:py-20">
          <p className="aff-badge mb-4">Hardware · Honest comparisons</p>
          <h1>
            Research before you buy.
            <span className="block text-[var(--aff-brand)]">Compare with confidence.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--aff-muted)]">
            Compare products, prices, specifications and trusted retailers.
          </p>
          <div className="mt-8" id="smart-search">
            <SmartSearch large />
          </div>
          <p className="mt-3 text-sm text-[var(--aff-muted)]">
            Search laptops, phones, RAM, SSDs, GPUs and more…
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/catalog/laptops" className="aff-btn aff-btn-ghost">
              Browse products
            </Link>
            <Link href="/catalog/guides" className="aff-btn aff-btn-ghost">
              Buying guides
            </Link>
          </div>
        </div>
      </section>

      <section className="aff-page py-12">
        <h2 className="text-xl font-bold">Popular categories</h2>
        <p className="mt-1 text-sm text-[var(--aff-muted)]">Filters adapt by category — only relevant options show.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.id} href={`/catalog/${c.slug}`} className="aff-card px-4 py-5 text-center hover:border-teal-300">
              <p className="font-semibold text-sm">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--aff-line)] bg-white">
        <div className="aff-page py-12">
          <h2 className="text-xl font-bold">Trending research picks</h2>
          <p className="mt-1 text-sm text-[var(--aff-muted)]">
            Curated research picks from our product catalog — specs, merchants, and comparison tools.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="aff-page py-12" id="ask-ai">
        <div className="aff-card p-6 sm:p-8 bg-[var(--aff-brand-soft)] border-teal-200">
          <h2 className="text-xl font-bold">AI shopping assistant</h2>
          <p className="mt-2 text-[var(--aff-muted)] max-w-2xl">
            Tell us your budget and what you need. We score catalog data first — Ebenezer AI explains without inventing prices.
          </p>
          <div className="mt-5">
            <SmartSearch />
          </div>
        </div>
      </section>

      <section className="aff-page pb-8">
        <h2 className="text-xl font-bold">Buying guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {guides.map((g) => (
            <Link key={g.id} href={`/catalog/guides/${g.slug}`} className="aff-card p-4 hover:border-teal-300">
              <p className="font-semibold">{g.title}</p>
              <p className="text-sm text-[var(--aff-muted)] mt-1">{g.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="aff-page pb-12">
        <h2 className="text-xl font-bold">Popular comparisons</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {comparisons.map((c) => (
            <Link
              key={c.id}
              href={`/catalog/compare?ids=${c.productIds
                .map((id) => all.find((x) => x.id === id)?.slug || id)
                .join(",")}`}
              className="aff-card p-4 hover:border-teal-300"
            >
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-[var(--aff-muted)] mt-1">{c.editorialNote}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--aff-line)] bg-white">
        <div className="aff-page py-8">
          <p className="aff-disclosure">{discloseAffiliate()}</p>
          <p className="aff-disclosure mt-2">
            Ebenezer Products is a research and comparison platform — not a storefront. Purchases happen on merchant sites.
            Digital kits remain at{" "}
            <Link href="/products" className="underline">
              Ebenezer Store
            </Link>
            .
          </p>
          <SiteLegalLinks className="mt-4 text-xs text-[var(--aff-muted)]" linkClassName="hover:text-[var(--aff-text)]" />
        </div>
      </footer>
      <CatalogAskAi />
    </>
  );
}
