"use client";

import Link from "next/link";
import { useRef } from "react";

export function MagneticLink({
  href,
  children,
  className = "",
  cursor,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  cursor?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      href={href}
      ref={ref as never}
      className={className}
      data-cursor={cursor}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.18;
        el.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0,0)";
      }}
    >
      {children}
    </Link>
  );
}
