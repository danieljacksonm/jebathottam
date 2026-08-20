import Link from "next/link";
import { CatalogNav } from "../components/CatalogNav";
import { CatalogAskAi } from "../components/CatalogAskAi";
import { TrackView } from "../components/TrackView";
import { formatINR, getBestOffer, getProductBySlug } from "@/lib/catalog/query";
import { getCompareRows } from "@/lib/catalog/scoring";
import { discloseAffiliate } from "@/lib/catalog/affiliate";

type Props = { searchParams: { ids?: string } };

export default function ComparePage({ searchParams }: Props) {
  const slugs = (searchParams.ids || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  const products = slugs
    .map((s) => getProductBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductBySlug>>[];

  const { specKeys } = getCompareRows(products.map((p) => p.id));

  const bestOverall = products
    .map((p) => ({ p, offer: getBestOffer(p.id) }))
    .sort((a, b) => (a.offer?.price ?? Infinity) - (b.offer?.price ?? Infinity))[0];

  return (
    <>
      {products[0] ? <TrackView productId={products[0].id} type="compare" /> : null}
      <CatalogNav />
      <div className="c-page py-8">
        <h1 className="text-3xl font-bold">Compare</h1>
        <p className="mt-2 text-[var(--c-muted)]">
          Side-by-side specs and sample prices. Add products from any product page.
        </p>

        {products.length < 2 ? (
          <div className="mt-8 c-card p-6">
            <p className="text-[var(--c-ink-2)]">Select at least two products to compare. Try a popular pair:</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/catalog/compare?ids=acer-aspire-5-ryzen-5-16gb,lenovo-ideapad-slim-3-i5-16gb"
                className="c-btn c-btn-primary"
              >
                Aspire 5 vs IdeaPad
              </Link>
              <Link
                href="/catalog/compare?ids=lenovo-loq-15-rtx-4050,hp-victus-15-rtx-3050"
                className="c-btn c-btn-ghost"
              >
                LOQ vs Victus
              </Link>
            </div>
          </div>
        ) : (
          <>
            {bestOverall ? (
              <div className="mt-6 rounded-xl border border-teal-200 bg-[var(--c-brand-bg)] p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-[var(--c-brand-dk)]">
                  Ebenezer note
                </p>
                <p className="mt-2 font-semibold text-lg">
                  {bestOverall.p.name} currently shows the lowest sample price in this set
                  {bestOverall.offer ? ` (${formatINR(bestOverall.offer.price)})` : ""}.
                </p>
                <p className="mt-2 text-sm text-[var(--c-muted)]">
                  Lowest price is not always the best fit. Check CPU, RAM, GPU and your use case below.
                </p>
              </div>
            ) : null}

            <div className="mt-6 overflow-x-auto c-card">
              <table className="c-table min-w-[640px]">
                <thead>
                  <tr>
                    <th>Spec</th>
                    {products.map((p) => (
                      <th key={p.id}>
                        <Link
                          href={`/catalog/p/${p.slug}`}
                          className="hover:text-[var(--c-brand)] !normal-case !tracking-normal text-sm font-semibold text-[var(--c-ink)]"
                        >
                          {p.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Price</th>
                    {products.map((p) => {
                      const o = getBestOffer(p.id);
                      return <td key={p.id}>{o ? formatINR(o.price) : "Information unavailable"}</td>;
                    })}
                  </tr>
                  {specKeys.map((key) => (
                    <tr key={key}>
                      <th className="!normal-case !tracking-normal">{key.replace(/_/g, " ")}</th>
                      {products.map((p) => (
                        <td key={p.id}>
                          {p.specs[key] == null ? "Information unavailable" : String(p.specs[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th>Best for</th>
                    {products.map((p) => (
                      <td key={p.id} className="text-sm">
                        {p.bestFor.join(", ")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th>Rating</th>
                    {products.map((p) => (
                      <td key={p.id}>
                        {p.rating != null
                          ? `${p.rating} (${p.reviewCount ?? 0} reviews)`
                          : "Information unavailable"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="c-disclosure mt-8">{discloseAffiliate()}</p>
      </div>
      <CatalogAskAi />
    </>
  );
}
