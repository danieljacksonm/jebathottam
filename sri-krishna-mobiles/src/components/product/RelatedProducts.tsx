"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image?: string | null;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("related-products-scroll");
    if (container) {
      const scrollAmount = direction === "left" ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Frequently Bought Together
          </h2>
          <p className="mt-1 text-[var(--foreground-muted)]">
            Customers also bought these items
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollContainer("left")}
            className="rounded-full border border-[var(--border)] p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollContainer("right")}
            className="rounded-full border border-[var(--border)] p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Products Scroll */}
      <div
        id="related-products-scroll"
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => {
          const discount = product.originalPrice
            ? Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              )
            : 0;

          return (
            <Card
              key={product.id}
              className="w-[280px] shrink-0 overflow-hidden border-[var(--border)] bg-[var(--card)] transition-all hover:shadow-lg"
            >
              {/* Image */}
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-square bg-[var(--background-secondary)]">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-5xl">📱</span>
                  </div>
                  {discount > 0 && (
                    <div className="absolute left-2 top-2 rounded-full bg-[var(--error)] px-2 py-1 text-xs font-semibold text-white">
                      -{discount}%
                    </div>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)]">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="mb-3 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {product.rating}
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[var(--primary)]">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[var(--foreground-muted)] line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <Button className="w-full gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
