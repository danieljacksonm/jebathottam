"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { SeoLocale } from "@/lib/site-url";
import { localeFromPathname } from "./locale-utils";
import { clientShellMessages } from "./client-shell";
import { clientHomeMessages, clientStudioMessages } from "./client-page-messages";

function localeFromCookie(): SeoLocale {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/(?:^|;\s*)eben-locale=([^;]+)/);
  const raw = (m?.[1] || "en").toLowerCase();
  return raw as SeoLocale;
}

/** Prefer /ta/ URL prefix, then eben-locale cookie. */
export function useRequestLocale(): SeoLocale {
  const pathname = usePathname() || "/";
  return useMemo(() => {
    const fromPath = localeFromPathname(pathname);
    if (fromPath !== "en") return fromPath;
    return localeFromCookie();
  }, [pathname]);
}

export function useShellMessages() {
  const locale = useRequestLocale();
  return useMemo(() => clientShellMessages(locale), [locale]);
}

export function useHomeMessages() {
  const locale = useRequestLocale();
  return useMemo(() => clientHomeMessages(locale), [locale]);
}

export function useStudioMessages() {
  const locale = useRequestLocale();
  return useMemo(() => clientStudioMessages(locale), [locale]);
}
