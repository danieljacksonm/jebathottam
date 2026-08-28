"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

/** Image with graceful fallback — never shows a broken-image icon. */
export function SafeImage({ src, alt, width, height, className = "", priority }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`nx-img-fallback ${className}`}
        role="img"
        aria-label={alt}
        style={{ aspectRatio: width && height ? `${width}/${height}` : "16/10" }}
      >
        <span>Ebenezer Digital</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
