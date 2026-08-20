import Link from "next/link";
import type { Metadata } from "next";
import { CatalogNav } from "../components/CatalogNav";
import { listGuides } from "@/lib/catalog/query";

export const metadata: Metadata = {
  title: "Buying Guides",
  description: "Practical buying guides for laptops, SSDs, RAM and more — grounded in real requirements.",
};

export default function GuidesIndexPage() {
  const guides = listGuides();
  return (
    <>
      <CatalogNav />
      <div className="c-page py-10">
        <h1 className="text-3xl font-bold">Buying guides</h1>
        <p className="mt-2 text-[var(--c-muted)] max-w-2xl">
          Short, practical guides. We only publish useful pages — not thousands of thin SEO stubs.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link key={g.id} href={`/catalog/guides/${g.slug}`} className="c-card p-5 hover:border-teal-300">
              <p className="font-semibold text-lg">{g.title}</p>
              <p className="mt-2 text-sm text-[var(--c-muted)]">{g.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
