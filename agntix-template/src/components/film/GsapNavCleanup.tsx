"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { killAllScrollTriggers } from "@/lib/gsap-safe";

/**
 * Kills GSAP pin-spacers before React swaps the page —
 * prevents removeChild DOM errors on navigation.
 */
export function GsapNavCleanup() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    return () => {
      killAllScrollTriggers();
    };
  }, [pathname]);

  return null;
}
