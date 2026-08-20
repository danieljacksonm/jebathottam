import type { Metadata } from "next";
import Link from "next/link";
import { CatalogNav } from "../../components/CatalogNav";
import { ProductCard } from "../../components/ProductCard";
import {
  applyProductFilters,
  getBestOffer,
  getProductsByCategory,
} from "@/lib/catalog/query";

type Props = { params: { budget: string } };

const ALLOWED = new Set(["50000", "60000", "70000", "80000", "100000"]);

export function generateMetadata({ params }: Props): Metadata {
  const budget = params.budget;
  if (!ALLOWED.has(budget)) return { title: "Laptops" };
  return {
    title: `Best laptops under ₹${Number(budget).toLocaleString("en-IN")}`,
    description: `Compare laptops under ₹${budget} with specs, sample prices, and AI-guided picks.`,
  };
}

export default function LaptopsUnderBudgetPage({ params }: Props) {
  const budget = params.budget;
  if (!ALLOWED.has(budget)) {
    return (
      <>
        <CatalogNav />
        <div className="c-page py-10">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <Link href="/catalog/laptops" className="text-[var(--c-brand-dk)] underline mt-4 inline-block">
            Browse all laptops
          </Link>
        </div>
      </>
    );
  }

  const max = Number(budget);
  const products = applyProductFilters(
    getProductsByCategory("laptops"),
    { price_max: String(max) },
    getBestOffer
  );

  return (
    <>
      <CatalogNav />
      <div className="c-page py-10">
        <p className="text-sm text-[var(--c-muted)]">
          <Link href="/catalog/laptops" className="hover:text-[var(--c-brand)]">
            Laptops
          </Link>{" "}
          / under ₹{max.toLocaleString("en-IN")}
        </p>
        <h1 className="mt-2 text-3xl font-bold">Laptops under ₹{max.toLocaleString("en-IN")}</h1>
        <p className="mt-2 text-[var(--c-muted)]">
          Only products with a sample offer at or below this budget. Verify live merchant price before buying.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length === 0 ? (
          <p className="mt-8 text-[var(--c-muted)]">No matching laptops in the current catalog.</p>
        ) : null}
        <p className="mt-8 text-sm">
          <Link
            href={`/catalog/recommend?q=${encodeURIComponent(`laptop under ${budget}`)}`}
            className="font-semibold text-[var(--c-brand-dk)] underline"
          >
            Get AI-guided picks for this budget →
          </Link>
        </p>
      </div>
    </>
  );
}
