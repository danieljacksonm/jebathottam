"use client";

type EventName =
  | "tool_view"
  | "tool_use"
  | "tool_started"
  | "tool_complete"
  | "copy"
  | "download"
  | "search"
  | "search_result_click"
  | "ai_click"
  | "related_tool_click";

/** Lightweight local analytics — no PII. */
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
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("[network]", payload);
    }
  } catch {
    /* ignore quota / private mode */
  }
}
