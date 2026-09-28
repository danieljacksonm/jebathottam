"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { SeoLocale } from "@/lib/site-url";
import { localeFromPathname } from "./locale-utils";
import { clientShellMessages } from "./client-shell";
import { getStudioSiteCopy } from "./studio-site-copy";
import { localePath } from "./locale-path";

/**
 * Client locale — URL path only.
 * Visiting `/` or `/services/...` is always English, even if eben-locale cookie is hi/ta.
 */
export function useRequestLocale(): SeoLocale {
  const pathname = usePathname() || "/";
  return useMemo(() => localeFromPathname(pathname), [pathname]);
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
