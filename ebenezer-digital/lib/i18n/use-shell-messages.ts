"use client";

import { useMemo } from "react";
import type { SeoLocale } from "@/lib/site-url";
import { clientShellMessages } from "./client-shell";

function localeFromCookie(): SeoLocale {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/(?:^|;\s*)eben-locale=([^;]+)/);
  const raw = (m?.[1] || "en").toLowerCase();
  return raw as SeoLocale;
}

export function useShellMessages() {
  return useMemo(() => clientShellMessages(localeFromCookie()), []);
}
