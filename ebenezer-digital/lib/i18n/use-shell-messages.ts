"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { SeoLocale } from "@/lib/site-url";
import { localeFromPathname } from "./locale-utils";
import { clientShellMessages } from "./client-shell";
import { getStudioSiteCopy } from "./studio-site-copy";
import { localePath } from "./locale-path";

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

export function useStudioSiteCopy() {
  const locale = useRequestLocale();
  return useMemo(() => getStudioSiteCopy(locale), [locale]);
}

/** @deprecated use useStudioSiteCopy().home */
export function useHomeMessages() {
  return useStudioSiteCopy().home;
}

/** @deprecated use useStudioSiteCopy().studio */
export function useStudioMessages() {
  return useStudioSiteCopy().studio;
}

export function useLocalePath() {
  const locale = useRequestLocale();
  return useMemo(() => (path: string) => localePath(path, locale), [locale]);
}
