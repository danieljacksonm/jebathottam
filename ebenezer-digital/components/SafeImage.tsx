"use client";

import { useMemo, useState } from "react";
import { brandedPlaceholder } from "@/lib/affiliate/images";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fallbackLabel?: string;
  aspectRatio?: string;
};

/**
 * Unified image with loading skeleton and branded fallback — never shows a broken icon.
 */
export function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority,
  fallbackLabel,
  aspectRatio,
}: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (failed || !src) {
      return brandedPlaceholder(fallbackLabel || alt, "product");
    }
    return src;
  }, [failed, src, alt, fallbackLabel]);

  const ratio =
    aspectRatio || (width && height ? `${width}/${height}` : "16/10");

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
      {!loaded ? (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900"
          aria-hidden
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
      />
    </div>
  );
}
