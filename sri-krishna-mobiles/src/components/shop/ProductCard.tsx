"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Heart, Star, Check } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  category: { name: string; slug: string };
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string | null;
  inStock: boolean;
  badge?: string | null;
  compatibility?: string[];
}

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    setIsAddingToCart(true);
    // Simulate API call
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  if (viewMode === "list") {
    return (
      <Card className="group flex flex-col gap-4 overflow-hidden border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:shadow-lg sm:flex-row">
        {/* Image */}
        <Link
          href={`/product/${product.slug}`}
          className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-[var(--background-secondary)] sm:w-48"
        >
          <div className="flex h-full items-center justify-center">
            <span className="text-5xl">📱</span>
          </div>
          {product.badge && (
            <div className="absolute left-2 top-2 rounded-full bg-[var(--primary)] px-2 py-1 text-xs font-semibold text-white">
              {product.badge}
            </div>
          )}
          {discount > 0 && (
            <div className="absolute right-2 top-2 rounded-full bg-[var(--error)] px-2 py-1 text-xs font-semibold text-white">
              -{discount}%
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {/* Category & Brand */}
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide">
                {product.category.name}
              </span>
              <span className="text-[var(--border)]">•</span>
              <span className="text-xs text-[var(--foreground-muted)]">
                {product.brand}
              </span>
            </div>

            {/* Name */}
            <Link href={`/product/${product.slug}`}>
              <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)] hover:text-[var(--primary)]">
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
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Compatibility */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {product.compatibility.slice(0, 2).map((model) => (
                  <span
                    key={model}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--background-secondary)] px-2 py-1 text-xs text-[var(--foreground-muted)]"
                  >
                    <Check className="h-3 w-3 text-[var(--success)]" />
                    {model}
                  </span>
                ))}
                {product.compatibility.length > 2 && (
                  <span className="text-xs text-[var(--foreground-muted)]">
                    +{product.compatibility.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price & Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[var(--primary)]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[var(--foreground-muted)] line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="rounded-lg border border-[var(--border)] p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-secondary)] hover:text-[var(--error)]"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-[var(--error)] text-[var(--error)]" : ""
                  }`}
                />
              </button>
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className="gap-2"
              >
                {isAddingToCart ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="group relative overflow-hidden border-[var(--border)] bg-[var(--card)] transition-all hover:shadow-lg">
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">
          {product.badge}
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && !product.badge && (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-[var(--error)] px-3 py-1 text-xs font-semibold text-white">
          -{discount}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-[var(--foreground-muted)] backdrop-blur transition-colors hover:bg-white hover:text-[var(--error)]"
      >
        <Heart
          className={`h-4 w-4 ${
            isWishlisted ? "fill-[var(--error)] text-[var(--error)]" : ""
          }`}
        />
      </button>

      {/* Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-[var(--background-secondary)] p-4">
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl transition-transform group-hover:scale-110">📱</span>
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="mb-1 text-xs text-[var(--foreground-muted)] uppercase tracking-wide">
          {product.category.name}
        </p>

        {/* Name */}
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
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-[var(--foreground-muted)] line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className="w-full gap-2"
          variant={product.inStock ? "default" : "outline"}
        >
          {isAddingToCart ? (
            <Check className="h-4 w-4" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </Card>
  );
}
