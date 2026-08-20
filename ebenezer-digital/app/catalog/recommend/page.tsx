import Link from "next/link";
import { CatalogNav } from "../components/CatalogNav";
import { SmartSearch } from "../components/SmartSearch";
import { CatalogAskAi } from "../components/CatalogAskAi";
import { formatINR } from "@/lib/catalog/query";
import { parseNaturalQuery, recommend } from "@/lib/catalog/scoring";
import { discloseAffiliate } from "@/lib/catalog/affiliate";
import type { RecommendationBucket } from "../types";

type Props = { searchParams: { q?: string; explain?: string } };

const LABELS: Record<RecommendationBucket, string> = {
  best_overall: "Best Overall",
  best_value: "Best Value",
  best_performance: "Best Performance",
  best_budget: "Best Budget",
  best_premium: "Best Premium",
};

export default function RecommendPage({ searchParams }: Props) {
  const q = (searchParams.q || "").trim();
  const req = q ? parseNaturalQuery(q) : null;
  const result = req ? recommend(req) : null;

  const bucketOrder: RecommendationBucket[] = [
    "best_overall",
    "best_value",
    "best_performance",
    "best_budget",
  ];

  return (
    <>
      <CatalogNav />
      <div className="c-page py-8">
        <h1 className="text-3xl font-bold">AI-guided recommendation</h1>
        <p className="mt-2 text-[var(--c-muted)] max-w-2xl">
          Deterministic scoring first. Ebenezer AI explains results — it does not invent prices or specs.
        </p>

        <div className="mt-6 max-w-xl">
          <SmartSearch initialQuery={q} />
        </div>

        {req ? (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {req.budget ? <span className="c-badge">Budget ≤ {formatINR(req.budget)}</span> : null}
            {req.categoryId ? <span className="c-badge">{req.categoryId}</span> : null}
            {req.useCases?.map((u) => (
              <span key={u} className="c-badge">
                {u.replace("_", " ")}
              </span>
            ))}
          </div>
        ) : null}

        {result ? (
          <div className="mt-10 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {bucketOrder.map((key) => {
                const item = result.buckets[key];
                if (!item) return null;
                return (
                  <article key={key} className="c-card p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--c-brand-dk)]">
                      {LABELS[key]}
                    </p>
                    <Link
                      href={`/catalog/p/${item.product.slug}`}
                      className="mt-2 block text-lg font-bold hover:text-[var(--c-brand-dk)]"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-[var(--c-muted)]">
                      {item.bestOffer ? formatINR(item.bestOffer.price) : "Information unavailable"} · Score{" "}
                      {Math.round(item.score)}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm text-[var(--c-ink-2)]">
                      {item.reasons.map((r) => (
                        <li key={r}>• {r}</li>
                      ))}
                    </ul>
                    <div className="mt-3 text-sm">
                      <p>
                        <span className="font-semibold">Who should buy:</span>{" "}
                        {item.product.bestFor.join(", ") || "Information unavailable"}
                      </p>
                      <p className="mt-1 text-[var(--c-muted)]">
                        <span className="font-semibold text-[var(--c-ink-2)]">Who should avoid:</span>{" "}
                        {item.product.notIdealFor.join(", ") || "Information unavailable"}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <section>
              <h2 className="text-xl font-bold">Full ranked list</h2>
              <ol className="mt-4 space-y-2">
                {result.ranked.map((s, i) => (
                  <li
                    key={s.product.id}
                    className="c-card px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[var(--c-muted)] text-sm mr-2">#{i + 1}</span>
                      <Link href={`/catalog/p/${s.product.slug}`} className="font-semibold hover:underline">
                        {s.product.name}
                      </Link>
                    </div>
                    <div className="text-sm text-[var(--c-muted)] shrink-0">
                      {s.bestOffer ? formatINR(s.bestOffer.price) : "—"} · {Math.round(s.score)}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <ul className="text-sm text-[var(--c-muted)] space-y-1">
              {result.notes.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-10 text-[var(--c-muted)]">Enter a need above to get recommendations.</p>
        )}

        <p className="c-disclosure mt-10">{discloseAffiliate()}</p>
      </div>
      <CatalogAskAi />
    </>
  );
}
