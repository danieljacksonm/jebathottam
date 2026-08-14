"use client";

import { useRef, type ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
};

export function MagneticCta({
  children,
  className = "",
  onClick,
  type = "button",
  href,
}: MagneticProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  function onMove(e: React.MouseEvent<HTMLElement>) {
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
    btn.style.transform = `translate3d(${dx * 0.12}px, ${dy * 0.18}px, 0) scale(1.04)`;
    const arrow = btn.querySelector("[data-mag-arrow]");
    if (arrow instanceof HTMLElement) {
      arrow.style.transform = `translate3d(${dx * 0.08}px, ${dy * 0.08}px, 0)`;
    }
  }

  function onLeave() {
    const btn = ref.current;
    if (!btn) return;
    btn.style.transform = "";
    const arrow = btn.querySelector("[data-mag-arrow]");
    if (arrow instanceof HTMLElement) arrow.style.transform = "";
  }

  function onDown() {
    const btn = ref.current;
    if (!btn) return;
    btn.style.transform = "scale(0.97)";
  }

  const classNames = `magnetic-cta ${className}`;
  const handlers = {
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onMouseDown: onDown,
  };

  if (href) {
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classNames}
        data-cursor="book"
        {...handlers}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={classNames}
      data-cursor="book"
      {...handlers}
    >
      {children}
    </button>
  );
}
