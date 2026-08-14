"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Kills GSAP pin-spacers before React swaps the page —
 * prevents removeChild DOM errors on navigation.
 * GSAP is loaded only on route change, not on first paint.
 */
export function GsapNavCleanup() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    return () => {
      void import("@/lib/gsap-safe").then((m) => m.killAllScrollTriggers());
    };
  }, [pathname]);

  return null;
}
