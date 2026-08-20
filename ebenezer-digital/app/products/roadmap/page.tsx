import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site-url";
import {
  CATALOG_GAP_NOTES,
  PRODUCT_ROADMAP,
  ROADMAP_PRIORITY_LABEL,
  type RoadmapPriority,
} from "../roadmap";

export const metadata: Metadata = pageMetadata({
  title: "Product Roadmap | Ebenezer Store",
  description:
    "Honest roadmap of high-value digital products we plan to build. Coming soon items are not for sale until real files exist.",
  path: "/products/roadmap",
});

const ORDER: RoadmapPriority[] = ["A", "B", "C", "D"];

export default function StoreRoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-semibold text-amber-800">
        <Link href="/products" className="hover:underline">
          ← Store
        </Link>
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Product roadmap</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        We expand by value, not by product count. Items below are planning only — not checkout, not fake downloads.
        When real source, Canva, or Figma files exist, we publish them in the store.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Gap snapshot</h2>
        <ul className="mt-4 space-y-2">
          {CATALOG_GAP_NOTES.map((g) => (
            <li key={g.bucket} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <span className="font-semibold text-slate-900">{g.bucket}</span>
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs uppercase text-slate-600">
                {g.coverage}
              </span>
              <p className="mt-1 text-slate-600">{g.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {ORDER.map((priority) => {
        const items = PRODUCT_ROADMAP.filter((i) => i.priority === priority);
        return (
          <section key={priority} className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">
              {priority} — {ROADMAP_PRIORITY_LABEL[priority]}
            </h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.bucket}</p>
                  <p className="mt-2 text-sm text-slate-700">{item.reason}</p>
                  {item.blockedBy ? (
                    <p className="mt-2 text-xs text-amber-800">Blocked: {item.blockedBy}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
