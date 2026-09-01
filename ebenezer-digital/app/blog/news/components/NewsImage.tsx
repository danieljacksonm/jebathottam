"use client";

import { useEffect, useState } from "react";
import { DESK_PHOTOS } from "@/lib/news-photos";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Cover photo with fixed 16:9 frame — never shows a broken icon. */
export function NewsImage({ src, alt, fill, className = "", priority }: Props) {
  const [current, setCurrent] = useState(src || DESK_PHOTOS.default);

  useEffect(() => {
    setCurrent(src || DESK_PHOTOS.default);
  }, [src]);

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      onError={() => {
        if (current !== DESK_PHOTOS.default) setCurrent(DESK_PHOTOS.default);
      }}
      className={`${fill ? "absolute inset-0 h-full w-full" : "h-full w-full"} object-cover object-center ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );

  if (fill) return img;

  return <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-900">{img}</div>;
}
