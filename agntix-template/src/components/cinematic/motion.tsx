"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { safeRevert } from "@/lib/gsap-safe";

gsap.registerPlugin(ScrollTrigger);

export function useReveal(
  deps: unknown[] = [],
  options?: { y?: number; stagger?: number; start?: string },
): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;
    const frame = window.requestAnimationFrame(() => {
      const targets = el.querySelectorAll("[data-reveal]");
      ctx = gsap.context(() => {
        gsap.fromTo(
          targets.length ? targets : el,
          { opacity: 0, y: options?.y ?? 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: options?.stagger ?? 0.08,
            scrollTrigger: {
              trigger: el,
              start: options?.start ?? "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }, el);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      safeRevert(ctx);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function onMove(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = ref.current;
    if (!btn) return;
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
    btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
    btn.style.transform = `translate3d(${dx * 0.1}px, ${dy * 0.14}px, 0) scale(1.03)`;
  }

  function onLeave() {
    const btn = ref.current;
    if (!btn) return;
    btn.style.transform = "";
  }

  return (
    <button
      ref={ref}
      type={type}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseDown={() => {
        if (ref.current) ref.current.style.transform = "scale(0.97)";
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
