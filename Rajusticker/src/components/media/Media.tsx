import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { focalFromSrc, focalMobileFromSrc } from "@/lib/image-art";

type MediaProps = {
  src: string;
  alt: string;
  kind: "hero" | "editorial" | "product" | "poster" | "banner" | "category";
  priority?: boolean;
  sizes?: string;
  className?: string;
  zoom?: boolean;
  /**
   * frame — show the full car in the upper poster band (default for lifestyle)
   * tight — slightly closer crop for mosaic tiles
   * none — no car crop (posters / contain)
   */
  crop?: "frame" | "tight" | "none";
  cropScale?: number;
  focal?: string;
  focalMobile?: string;
};

const DEFAULT_SIZES: Record<MediaProps["kind"], string> = {
  hero: "100vw",
  editorial: "(max-width: 1024px) 100vw, 60vw",
  product: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  poster: "(max-width: 1024px) 100vw, 45vw",
  banner: "100vw",
  category: "(max-width: 768px) 50vw, 40vw",
};

/** Mild scales — landscape stages do most of the cropping */
const DEFAULT_CROP_SCALE: Record<"frame" | "tight", Partial<Record<MediaProps["kind"], number>>> = {
  frame: {
    hero: 1.15,
    editorial: 1.35,
    product: 1.4,
    banner: 1.25,
    category: 1.4,
  },
  tight: {
    hero: 1.35,
    editorial: 1.55,
    product: 1.55,
    banner: 1.4,
    category: 1.55,
  },
};

export function Media({
  src,
  alt,
  kind,
  priority = false,
  sizes,
  className,
  zoom = false,
  crop = kind === "poster" ? "none" : "frame",
  cropScale,
  focal,
  focalMobile,
}: MediaProps) {
  const resolvedFocal = focal || focalFromSrc(src);
  const resolvedMobile = focalMobile || focalMobileFromSrc(src);
  const useCarCrop = crop !== "none" && kind !== "poster";
  const mode = crop === "tight" ? "tight" : "frame";
  const scale =
    cropScale ??
    (useCarCrop ? DEFAULT_CROP_SCALE[mode][kind] ?? 1.15 : 1);

  return (
    <div
      className={cn(
        "media",
        `media-${kind}`,
        useCarCrop && "media-car-crop",
        useCarCrop && `media-crop-${mode}`,
        zoom && "media-zoom group",
        className,
      )}
      style={
        {
          "--focal": resolvedFocal,
          "--focal-mobile": resolvedMobile,
          "--crop-scale": String(scale),
        } as CSSProperties
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes || DEFAULT_SIZES[kind]}
        className={kind === "poster" ? "object-contain" : "object-cover"}
      />
    </div>
  );
}
