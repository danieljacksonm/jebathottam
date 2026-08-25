"use client";

import { useEffect, useState } from "react";
import { DESK_PHOTOS } from "@/lib/news-photos";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: string;
  priority?: boolean;
  fill?: boolean;
};

/** Image that never shows a broken icon — branded editorial fallback. */
export function SafeImage({
  src,
  alt,
  className = "",
  fallback = DESK_PHOTOS.default,
  priority,
  fill,
}: Props) {
  const [current, setCurrent] = useState(src || fallback);

  useEffect(() => {
    setCurrent(src || fallback);
  }, [src, fallback]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
      className={`${fill ? "absolute inset-0 h-full w-full" : "h-full w-full"} object-cover object-center ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
