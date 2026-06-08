"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Eye,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

interface WishlistItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  stock: number;
  addedDate: string;
}

// Mock wishlist data
const mockWishlist: WishlistItem[] = [
  {
    id: 1,
    name: "iPhone 14 Pro Max OLED Display - Original Quality",
    slug: "iphone-14-pro-max-oled-display",
    price: 15499,
    originalPrice: 18999,
    stock: 15,
    addedDate: "2024-06-01",
  },
  {
    id: 2,
    name: "Samsung Galaxy S23 Ultra Battery",
    slug: "samsung-galaxy-s23-ultra-battery",
    price: 2999,
    originalPrice: 3999,
    stock: 8,
    addedDate: "2024-05-28",
  },
  {
    id: 3,
    name: "OnePlus 11 65W Warp Charger",
    slug: "oneplus-11-65w-warp-charger",
    price: 1799,
    originalPrice: 2499,
    stock: 0,
    addedDate: "2024-05-20",
  },
  {
    id: 4,
    name: "Pixel 7 Pro Camera Lens",
    slug: "pixel-7-pro-camera-lens",
    price: 4999,
    originalPrice: 6499,
    stock: 5,
    addedDate: "2024-05-15",
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(mockWishlist);
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const addToCart = async (item: WishlistItem) => {
    if (item.stock === 0) return;
    setIsAddingToCart(item.id);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAddingToCart(null);
    // In real app, would add to cart
  };

  const moveAllToCart = async () => {
    const inStockItems = wishlist.filter((item) => item.stock > 0);
    if (inStockItems.length === 0) return;
    
    // Simulate adding all to cart
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Could optionally clear wishlist or keep items
  };

  const totalSavings = wishlist.reduce(
    (sum, item) =>
      sum + (item.originalPrice ? item.originalPrice - item.price : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            My Wishlist
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        {wishlist.length > 0 && (
          <Button
            onClick={moveAllToCart}
            variant="outline"
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add All to Cart
          </Button>
        )}
      </div>

      {/* Savings Banner */}
      {totalSavings > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[var(--success)]/10 p-4 text-[var(--success)]">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">
            You can save a total of{" "}
            <span className="font-semibold">{formatCurrency(totalSavings)}</span>{" "}
            on your wishlist items!
          </p>
        </div>
      )}

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <Card className="border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-[var(--foreground-muted)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Your wishlist is empty
          </h3>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Save items you love to buy them later
          </p>
          <Link href="/shop">
            <Button className="mt-4 gap-2">
              <ShoppingBag className="h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => {
            const discount = item.originalPrice
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : 0;

            return (
              <Card
                key={item.id}
                className="group relative overflow-hidden border-[var(--border)] bg-[var(--card)] transition-all hover:shadow-lg"
              >
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute left-3 top-3 z-10 rounded-full bg-[var(--error)] px-2 py-1 text-xs font-semibold text-white">
                    -{discount}%
                  </div>
                )}

                {/* Stock Status */}
                {item.stock === 0 && (
                  <div className="absolute right-3 top-3 z-10 rounded-full bg-[var(--foreground-muted)] px-2 py-1 text-xs font-semibold text-white">
                    Out of Stock
                  </div>
                )}
                {item.stock > 0 && item.stock <= 5 && (
                  <div className="absolute right-3 top-3 z-10 rounded-full bg-[var(--warning)] px-2 py-1 text-xs font-semibold text-white">
                    Only {item.stock} left
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-[var(--foreground-muted)] opacity-0 shadow-lg backdrop-blur transition-all group-hover:opacity-100 hover:bg-white hover:text-[var(--error)]"
                  style={{ top: item.stock <= 5 ? "48px" : "12px" }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Product Image */}
                <Link href={`/product/${item.slug}`}>
                  <div className="relative aspect-square bg-[var(--background-secondary)]">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-6xl transition-transform group-hover:scale-110">📱</span>
                    </div>
                    {item.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)]">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mb-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[var(--primary)]">
                      {formatCurrency(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-[var(--foreground-muted)] line-through">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Added Date */}
                  <p className="mb-4 text-xs text-[var(--foreground-muted)]">
                    Added on {item.addedDate}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0 || isAddingToCart === item.id}
                      className="flex-1 gap-2"
                      variant={item.stock === 0 ? "outline" : "default"}
                    >
                      {isAddingToCart === item.id ? (
                        "Adding..."
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </>
                      )}
                    </Button>
                    <Link href={`/product/${item.slug}`}>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Continue Shopping */}
      {wishlist.length > 0 && (
        <div className="text-center">
          <Link
            href="/shop"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            Continue Shopping →
          </Link>
        </div>
      )}
    </div>
  );
}
