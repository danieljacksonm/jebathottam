"use client";

import { useMemo, useState } from "react";
import { brandedPlaceholder, type ResolvedImage } from "@/lib/affiliate/images";

type Props = {
  image: ResolvedImage;
  className?: string;
  size?: "card" | "hero" | "thumb";
  showSource?: boolean;
};

export function AffiliateMedia({ image, className = "", size = "card", showSource }: Props) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const src = useMemo(() => {
    if (failed) return brandedPlaceholder(image.alt, "product");
    return image.url;
  }, [failed, image.alt, image.url]);

  return (
    <div className={className}>
      <div
        className={`${size === "thumb" ? "aff-media-sm" : size === "hero" ? "aff-media !aspect-[16/9]" : "aff-media"} relative overflow-hidden`}
      >
        {!loaded && !failed ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200" aria-hidden />
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(true);
          }}
        />
      </div>
      {showSource ? (
        <p className="aff-fresh px-1 pt-1">
          Image:{" "}
          {failed || image.sourceType === "branded_placeholder"
            ? "Branded placeholder — awaiting affiliate/merchant image"
            : image.sourceLabel}
        </p>
      ) : null}
    </div>
  );
}
