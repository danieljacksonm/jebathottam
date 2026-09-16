"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { addToCart } from "@/lib/cart-store";
import { getUnitPrice } from "@/lib/catalog";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  sizeId = "full-roll",
  quantity = 1,
  className,
  label = "Add to Cart",
}: {
  product: Product;
  sizeId?: string;
  quantity?: number;
  className?: string;
  label?: string;
}) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    const size = product.sizes.find((s) => s.id === sizeId) || product.sizes[0];
    const price = getUnitPrice(product, size.id);
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price,
      sizeId: size.id,
      sizeLabel: size.label,
      quantity,
    });
    trackEvent({
      name: "add_to_cart",
      productId: product.id,
      quantity,
      price,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
    window.dispatchEvent(new CustomEvent("raj:open-cart"));
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={cn("btn btn-secondary", className)}
      aria-label={`Add ${product.name} to cart`}
    >
      {added ? "Added" : label}
    </button>
  );
}
