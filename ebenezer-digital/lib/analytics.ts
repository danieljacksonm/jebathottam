/**
 * Unified analytics — GA4 when configured, otherwise dev-only logging.
 * Privacy: no PII; event params are tool names, paths, and action labels only.
 */

export const GA_MEASUREMENT_ID =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()) || "";

export type AnalyticsEvent =
  | "page_view"
  | "tool_view"
  | "tool_use"
  | "tool_started"
  | "tool_complete"
  | "copy"
  | "download"
  | "search"
  | "search_result_click"
  | "ai_click"
  | "related_tool_click"
  | "affiliate_click"
  | "outbound_click"
  | "newsletter_signup";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  name: AnalyticsEvent,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;

  if (GA_MEASUREMENT_ID && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, params);
  }
}

export function trackPageView(path: string) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
}
