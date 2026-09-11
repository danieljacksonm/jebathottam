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
  const initial = src && src.trim() ? src : fallback;
  const [current, setCurrent] = useState(initial);
  const [failedOnce, setFailedOnce] = useState(false);

  useEffect(() => {
    setCurrent(src && src.trim() ? src : fallback);
    setFailedOnce(false);
  }, [src, fallback]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      onError={() => {
        if (!failedOnce && current !== fallback) {
          setFailedOnce(true);
          setCurrent(fallback);
        }
      }}
      className={`${fill ? "absolute inset-0 h-full w-full" : "h-full w-full"} object-cover object-center ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={fill ? undefined : 1200}
      height={fill ? undefined : 675}
    />
  );
}
