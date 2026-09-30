"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useReveal(
  deps: unknown[] = [],
): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    const nodes = targets.length ? [...targets] : [el];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          entry.target.classList.remove("will-reveal");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const node of nodes) {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) continue;
      node.classList.add("will-reveal");
      observer.observe(node);
    }

    return () => observer.disconnect();
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
