"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

const MAGNETIC_STRENGTH = 0.22;
const SMOOTH = 0.18;

/**
 * Button/link that subtly follows the cursor (magnetic effect – premium site style).
 */
export default function MagneticButton({
  children,
  className = "",
  href,
  ...props
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId = 0;
    function tick() {
      const { x: tx, y: ty } = target.current;
      const { x: cx, y: cy } = current.current;
      const x = cx + (tx - cx) * SMOOTH;
      const y = cy + (ty - cy) * SMOOTH;
      current.current = { x, y };
      setPos({ x, y });
      if (Math.abs(tx - x) > 0.01 || Math.abs(ty - y) > 0.01) {
        rafId = requestAnimationFrame(tick);
      }
    }
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      target.current = {
        x: (e.clientX - centerX) * MAGNETIC_STRENGTH,
        y: (e.clientY - centerY) * MAGNETIC_STRENGTH,
      };
      if (rafId === 0) rafId = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      target.current = { x: 0, y: 0 };
    };
    const el = ref.current;
    el?.addEventListener("mousemove", onMove);
    el?.addEventListener("mouseleave", onLeave);
    return () => {
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: pos.x === 0 && pos.y === 0 ? "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
      }}
      {...props}
    >
      {children}
    </a>
  );
}
