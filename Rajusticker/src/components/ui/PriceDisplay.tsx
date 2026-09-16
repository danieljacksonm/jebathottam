import { discountPercent, formatPrice } from "@/lib/utils";

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
}) {
  const discount = discountPercent(price, compareAtPrice);
  const priceClass =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`price ${priceClass}`}>{formatPrice(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-[var(--ink-3)] line-through text-sm">
          {formatPrice(compareAtPrice)}
        </span>
      )}
      {discount !== null && size !== "sm" && (
        <span className="badge badge-accent">-{discount}%</span>
      )}
    </div>
  );
}
