"use client";

import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type EventName = Extract<
  AnalyticsEvent,
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
>;

/** Lightweight local + GA4 analytics — no PII. */
export function trackNetworkEvent(name: EventName, meta?: Record<string, string | number | boolean>) {
  try {
    const payload = {
      name,
      meta: meta || {},
      at: new Date().toISOString(),
      path: typeof window !== "undefined" ? window.location.pathname : "",
    };
    const key = "eben_network_events";
    const prev = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
    const next = [...prev, payload].slice(-200);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }

  trackEvent(name, meta);
}
