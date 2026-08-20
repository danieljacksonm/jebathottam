import Link from "next/link";
import { CatalogNav } from "./components/CatalogNav";
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

  return (
    <>
      <CatalogNav />

      <section className="c-hero">
        <div className="c-page py-14 sm:py-20">
          <p className="c-badge mb-4">Physical products · Compare before you buy</p>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-[var(--c-ink)] sm:text-5xl">
            Find the right product.
            <span className="block text-[var(--c-brand)]">Compare before you buy.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--c-muted)]">
            Compare products, prices and specifications — then let Ebenezer AI help you choose.
          </p>
          <div className="mt-8" id="smart-search">
            <SmartSearch large />
          </div>
          <p className="mt-3 text-sm text-[var(--c-muted)]">
            Example: “I need a laptop under ₹70,000 for coding and gaming.”
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/catalog/laptops" className="c-btn c-btn-ghost">
              Browse Products
            </Link>
            <Link href="/catalog/guides" className="c-btn c-btn-ghost">
              Buying guides
            </Link>
          </div>
        </div>
      </section>

      <section className="c-page py-12">
        <h2 className="text-xl font-bold">Popular categories</h2>
        <p className="mt-1 text-sm text-[var(--c-muted)]">Filters change by category — only relevant options show.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.id} href={`/catalog/${c.slug}`} className="c-card px-4 py-5 text-center hover:border-teal-300">
              <p className="font-semibold text-sm">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--c-line)] bg-white">
        <div className="c-page py-12">
          <h2 className="text-xl font-bold">Trending in catalog</h2>
          <p className="mt-1 text-sm text-[var(--c-muted)]">
            Curated sample catalog. Replace with approved affiliate feeds for live prices.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="c-page py-12" id="ask-ai">
        <div className="c-card p-6 sm:p-8 bg-[var(--c-brand-bg)] border-teal-200">
          <h2 className="text-xl font-bold">AI recommendation</h2>
          <p className="mt-2 text-[var(--c-muted)] max-w-2xl">
            Tell us your budget and what you need. We score products from our catalog first — then Ebenezer AI
            explains the result. AI never invents prices or specs.
          </p>
          <div className="mt-5">
            <SmartSearch />
          </div>
        </div>
      </section>

      <section className="c-page pb-8">
        <h2 className="text-xl font-bold">Buying guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {guides.map((g) => (
            <Link key={g.id} href={`/catalog/guides/${g.slug}`} className="c-card p-4 hover:border-teal-300">
              <p className="font-semibold">{g.title}</p>
              <p className="text-sm text-[var(--c-muted)] mt-1">{g.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="c-page pb-12">
        <h2 className="text-xl font-bold">Popular comparisons</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {comparisons.map((c) => (
            <Link
              key={c.id}
              href={`/catalog/compare?ids=${c.productIds
                .map((id) => {
                  const p = trending.find((x) => x.id === id) || listActiveProducts().find((x) => x.id === id);
                  return p?.slug || id;
                })
                .join(",")}`}
              className="c-card p-4 hover:border-teal-300"
            >
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-[var(--c-muted)] mt-1">{c.editorialNote}</p>
            </Link>
          ))}
          <Link
            href="/catalog/compare?ids=lenovo-loq-15-rtx-4050,hp-victus-15-rtx-3050"
            className="c-card p-4 hover:border-teal-300"
          >
            <p className="font-semibold">LOQ 4050 vs Victus 3050</p>
            <p className="text-sm text-[var(--c-muted)] mt-1">Gaming laptop value check</p>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--c-line)] bg-white">
        <div className="c-page py-8">
          <p className="c-disclosure">{discloseAffiliate()}</p>
          <p className="c-disclosure mt-2">
            Ebenezer Products is a discovery and comparison platform — not a storefront. Purchases happen on
            merchant sites. Digital kits remain at{" "}
            <Link href="/products" className="underline">
              Ebenezer Store
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--c-muted)]">
            <Link href="/tools">Ebenezer Tools</Link>
            <Link href="/ai">Ebenezer AI</Link>
            <Link href="/">Ebenezer Digital</Link>
          </div>
        </div>
      </footer>
      <CatalogAskAi />
    </>
  );
}
