"use client";

import { useEffect } from "react";

export function TrackView({ productId, type = "product_view" }: { productId?: string; type?: "product_view" | "compare" }) {
  useEffect(() => {
    if (!productId && type === "product_view") return;
    fetch("/api/catalog/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, productId }),
    }).catch(() => {});
  }, [productId, type]);
  return null;
}
