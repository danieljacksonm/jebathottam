"use client";

import { useEffect, useState } from "react";

/** Rotate an index every `ms` so featured blog/news change without repeating the same slot. */
export function useRotate(length: number, ms = 120000): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length < 2) {
      setIndex(0);
      return;
    }
    const t = window.setInterval(() => {
      setIndex((n) => (n + 1) % length);
    }, ms);
    return () => window.clearInterval(t);
  }, [length, ms]);

  return length > 0 ? index % length : 0;
}

export function rotateList<T>(list: T[], offset: number): T[] {
  if (!list.length) return list;
  const i = ((offset % list.length) + list.length) % list.length;
  if (i === 0) return list;
  return [...list.slice(i), ...list.slice(0, i)];
}
