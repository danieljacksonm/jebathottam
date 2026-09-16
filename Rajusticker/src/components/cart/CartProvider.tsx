"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { CartItem } from "@/types";
import {
  getCartCount,
  getCartServerSnapshot,
  getCartSnapshot,
  getCartSubtotal,
  getEstimatedShipping,
  subscribeCart,
} from "@/lib/cart-store";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openCart = () => setOpen(true);
    window.addEventListener("raj:open-cart", openCart);
    return () => window.removeEventListener("raj:open-cart", openCart);
  }, []);

  const subtotal = getCartSubtotal(items);
  const shipping = getEstimatedShipping(subtotal);
  const value = useMemo(
    () => ({
      items,
      count: getCartCount(items),
      subtotal,
      shipping,
      total: subtotal + shipping,
      open,
      setOpen,
    }),
    [items, open, shipping, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function useCartOptional() {
  return useContext(CartContext);
}

export function useOpenCart() {
  const ctx = useCartOptional();
  return useCallback(() => ctx?.setOpen(true), [ctx]);
}
