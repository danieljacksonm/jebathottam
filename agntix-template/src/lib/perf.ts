"use client";

/** True when we should run a lighter cinematic path. */
export function isMobileLite() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData,
    )
  );
}

/** Run after first paint / LCP-ish idle window. */
export function afterFirstPaint(callback: () => void, delayMs = 0) {
  let cancelled = false;

  const run = () => {
    if (cancelled) return;
    const ric = (
      window as Window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number },
        ) => number;
      }
    ).requestIdleCallback;

    if (typeof ric === "function") {
      ric(
        () => {
          if (!cancelled) callback();
        },
        { timeout: 1200 },
      );
      return;
    }

    window.setTimeout(() => {
      if (!cancelled) callback();
    }, 250 + delayMs);
  };

  if (document.readyState === "complete") {
    window.setTimeout(run, delayMs);
  } else {
    window.addEventListener(
      "load",
      () => {
        window.setTimeout(run, delayMs);
      },
      { once: true },
    );
  }

  return () => {
    cancelled = true;
  };
}
