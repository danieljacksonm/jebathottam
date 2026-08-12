"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StoreProduct } from "../data";
import { STORE_PRODUCTS } from "../data";

type CartLine = { productId: string; qty: number };

type StoreContextValue = {
  cart: CartLine[];
  cartOpen: boolean;
  searchOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartProducts: { product: StoreProduct; qty: number }[];
  cartCount: number;
  cartTotal: number;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const KEY = "ebenezer-store-cart";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(cart));
  }, [cart, ready]);

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { productId, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, qty } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartProducts = useMemo(
    () =>
      cart
        .map((l) => {
          const product = STORE_PRODUCTS.find((p) => p.id === l.productId);
          return product ? { product, qty: l.qty } : null;
        })
        .filter(Boolean) as { product: StoreProduct; qty: number }[],
    [cart]
  );

  const cartCount = cartProducts.reduce((n, l) => n + l.qty, 0);
  const cartTotal = cartProducts.reduce((n, l) => n + l.product.price * l.qty, 0);

  const value = useMemo(
    () => ({
      cart,
      cartOpen,
      searchOpen,
      setCartOpen,
      setSearchOpen,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      cartProducts,
      cartCount,
      cartTotal,
    }),
    [
      cart,
      cartOpen,
      searchOpen,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      cartProducts,
      cartCount,
      cartTotal,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
