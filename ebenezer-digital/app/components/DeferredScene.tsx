"use client";

import { useState, useEffect, type ReactNode } from "react";

/**
 * Renders children only after delay. Use to defer heavy components (e.g. Three.js)
 * so initial load stays fast – chunk loads after first paint.
 */
export default function DeferredScene({
  children,
  delay = 800,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  if (!show) return null;
  return <>{children}</>;
}
