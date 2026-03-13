"use client";

import { useRouter } from "next/navigation";

export default function AddToCartButton({
  product,
}: {
  product: { id: number; name: string; price: number };
}) {
  const router = useRouter();

  function add() {
    const raw = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    const cart: { productId: number; name: string; price: number; quantity: number }[] = raw ? JSON.parse(raw) : [];
    const i = cart.findIndex((c) => c.productId === product.id);
    if (i >= 0) cart[i].quantity += 1;
    else cart.push({ productId: product.id, name: product.name, price: product.price, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={add}
      className="w-full rounded-lg bg-[var(--accent)] text-white py-3 font-medium hover:bg-[var(--accent-dark)] transition-colors"
    >
      Add to cart
    </button>
  );
}
