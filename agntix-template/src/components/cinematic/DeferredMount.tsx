"use client";

import { useEffect, useState, type ReactNode } from "react";
import { afterFirstPaint, isMobileLite } from "@/lib/perf";

/** Mount children only after first paint (and optionally skip on mobile). */
export function DeferredMount({
  children,
  delayMs = 0,
  skipOnMobile = false,
  fallback = null,
}: {
  children: ReactNode;
  delayMs?: number;
  skipOnMobile?: boolean;
  fallback?: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (skipOnMobile && isMobileLite()) return;
    return afterFirstPaint(() => setReady(true), delayMs);
  }, [delayMs, skipOnMobile]);

  if (!ready) return <>{fallback}</>;
  return <>{children}</>;
}
