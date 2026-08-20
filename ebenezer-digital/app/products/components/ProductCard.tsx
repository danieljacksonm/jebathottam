"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { useStoreI18n } from "../i18n";
import { localizeProduct } from "../product-i18n";
import { formatINR, type StoreProduct } from "../data";
import { productTypeShort } from "../taxonomy";

export function ProductCard({
  product,
  className = "",
}: {
  product: StoreProduct;
  className?: string;
}) {
  const { locale, lp } = useStoreI18n();
  const p = localizeProduct(product, locale);
  const typeShort = productTypeShort(p.productType);

  const badgeClass =
    p.badge === "FREE"
      ? "s-badge s-badge-free"
      : p.badge === "NEW"
      ? "s-badge s-badge-new"
      : p.badge === "BUNDLE"
      ? "s-badge s-badge-bundle"
      : "s-badge s-badge-hot";

  const fileLines =
    p.productType === "website_template" || p.productType === "digital_tool" || p.productType === "software"
      ? (p.includes || []).slice(0, 3)
      : p.pdfs && p.pdfs.length
      ? p.pdfs.map((pdf) => pdf.label)
      : (p.includes || []).slice(0, 3);

  return (
    <Link href={lp(`/products/${p.slug}`)} className={`s-card group flex flex-col ${className}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--s-line-soft)]">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src.includes("og-store.png")) return;
            img.src = "/og-store.png";
          }}
        />
        <span className="s-type-chip absolute right-3 top-3">{typeShort}</span>
        {p.badge && <span className={`${badgeClass} absolute left-3 top-3 shadow-sm`}>{p.badge}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--s-muted)]">
          {p.category}
        </p>
        <h3 className="mt-1.5 font-semibold leading-snug text-[var(--s-ink)] group-hover:text-[var(--s-brand)] transition-colors duration-200">
          {p.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-[var(--s-muted)]">{p.tagline}</p>
        {fileLines.length > 0 && (
          <ul className="mt-3 space-y-1">
            {fileLines.slice(0, 3).map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-[12px] text-[var(--s-muted)]">
                <FileText className="h-3 w-3 shrink-0 text-[var(--s-brand)]" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className={`font-bold text-lg ${p.isFree ? "text-[var(--s-brand)]" : "text-[var(--s-ink)]"}`}>
            {formatINR(p.price)}
          </span>
          <span className="flex items-center gap-1 text-[12px] font-semibold text-[var(--s-brand)]">
            {p.isSoftware ? "Open" : "View"} <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
