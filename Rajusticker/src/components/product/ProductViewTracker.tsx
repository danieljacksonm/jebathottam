"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ProductViewTracker({ productId, slug }: { productId: string; slug: string }) {
  useEffect(() => {
    trackEvent({ name: "product_view", productId, slug });
  }, [productId, slug]);
  return null;
}
