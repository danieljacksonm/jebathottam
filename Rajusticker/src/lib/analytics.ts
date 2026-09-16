import type { AnalyticsEvent } from "@/types";

/**
 * Analytics-ready event emitter.
 * No fake analytics — only fires when measurement IDs are configured.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (gaId && "gtag" in window && typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === "function") {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", event.name, event);
  }

  if (metaId && "fbq" in window && typeof (window as Window & { fbq?: (...args: unknown[]) => void }).fbq === "function") {
    const map: Record<string, string> = {
      product_view: "ViewContent",
      add_to_cart: "AddToCart",
      begin_checkout: "InitiateCheckout",
      purchase: "Purchase",
      search: "Search",
    };
    const mapped = map[event.name];
    if (mapped) {
      (window as Window & { fbq: (...args: unknown[]) => void }).fbq("track", mapped, event);
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event);
  }
}
