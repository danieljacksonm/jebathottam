"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { afterFirstPaint, isMobileLite } from "@/lib/perf";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Desktop-only Lenis, started after first paint to protect LCP. */
export function SmoothScroll() {
  useEffect(() => {
    if (isMobileLite()) return;

    let destroyed = false;
    let cleanup: (() => void) | null = null;

    const stop = afterFirstPaint(() => {
      void (async () => {
        const [{ default: LenisCtor }, { default: gsap }, { ScrollTrigger }] =
          await Promise.all([
            import("lenis"),
            import("gsap"),
            import("gsap/ScrollTrigger"),
          ]);
        await import("lenis/dist/lenis.css");
        if (destroyed) return;

        gsap.registerPlugin(ScrollTrigger);
        const lenis = new LenisCtor({
          duration: 1.05,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1,
          wheelMultiplier: 0.9,
        });

        window.__lenis = lenis;
        lenis.on("scroll", ScrollTrigger.update);

        const ticker = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);

        cleanup = () => {
          window.removeEventListener("resize", onResize);
          gsap.ticker.remove(ticker);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
          if (window.__lenis === lenis) delete window.__lenis;
        };
      })();
    }, 700);

    return () => {
      destroyed = true;
      stop();
      cleanup?.();
    };
  }, []);

  return null;
}
