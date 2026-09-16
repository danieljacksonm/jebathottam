import type { CartItem } from "@/types";
import {
  EXPRESS_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
} from "./constants";

const STORAGE_KEY = "raju-stickers-cart-v1";
const EMPTY_CART: CartItem[] = [];

type Listener = () => void;

let cart: CartItem[] = EMPTY_CART;
let hydrated = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) cart = JSON.parse(raw) as CartItem[];
  } catch {
    cart = EMPTY_CART;
  }
}

export function subscribeCart(listener: Listener) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCartSnapshot(): CartItem[] {
  hydrate();
  return cart;
}

export function getCartServerSnapshot(): CartItem[] {
  // Must return a stable reference — a fresh [] each call causes React to loop.
  return EMPTY_CART;
}

export function addToCart(item: CartItem) {
  hydrate();
  const existing = cart.find(
    (c) => c.productId === item.productId && c.sizeId === item.sizeId,
  );
  if (existing) {
    cart = cart.map((c) =>
      c.productId === item.productId && c.sizeId === item.sizeId
        ? { ...c, quantity: Math.min(99, c.quantity + item.quantity) }
        : c,
    );
  } else {
    cart = [...cart, item];
  }
  emit();
}

export function removeFromCart(productId: string, sizeId: string) {
  hydrate();
  cart = cart.filter((c) => !(c.productId === productId && c.sizeId === sizeId));
  emit();
}

export function updateQuantity(productId: string, sizeId: string, quantity: number) {
  hydrate();
  if (quantity <= 0) {
    removeFromCart(productId, sizeId);
    return;
  }
  cart = cart.map((c) =>
    c.productId === productId && c.sizeId === sizeId
      ? { ...c, quantity: Math.min(99, quantity) }
      : c,
  );
  emit();
}

export function clearCart() {
  hydrate();
  cart = EMPTY_CART;
  emit();
}

export function getCartSubtotal(items: CartItem[] = getCartSnapshot()): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getEstimatedShipping(subtotal: number, method: "standard" | "express" = "standard") {
  if (subtotal <= 0) return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method === "express" ? EXPRESS_SHIPPING : STANDARD_SHIPPING;
}

export function getCartCount(items: CartItem[] = getCartSnapshot()): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
