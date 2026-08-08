"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Safely tear down all ScrollTriggers (Next.js route changes). */
export function killAllScrollTriggers() {
  try {
    ScrollTrigger.getAll().forEach((t) => {
      try {
        t.kill(true);
      } catch {
        /* ignore */
      }
    });
    ScrollTrigger.clearMatchMedia();
    ScrollTrigger.refresh();
  } catch {
    /* ignore */
  }
}

/** Revert a gsap.context without throwing into React. */
export function safeRevert(ctx: gsap.Context | null | undefined) {
  if (!ctx) return;
  try {
    ctx.revert();
  } catch {
    try {
      killAllScrollTriggers();
    } catch {
      /* ignore */
    }
  }
}
