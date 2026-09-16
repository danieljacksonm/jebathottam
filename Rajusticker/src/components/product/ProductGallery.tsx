"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { Product } from "@/types";
import { focalFromSrc } from "@/lib/image-art";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : ["/products/chrome-gold.jpg"];
  const [active, setActive] = useState(0);
  const focal = focalFromSrc(images[active]);
  const [view, setView] = useState<"poster" | "applied">("poster");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setView("poster")}
          className={`text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 border ${
            view === "poster"
              ? "border-[var(--accent)] text-[var(--ink)]"
              : "border-[var(--line)] text-[var(--ink-3)]"
          }`}
        >
          Full Spec
        </button>
        <button
          type="button"
          onClick={() => setView("applied")}
          className={`text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 border ${
            view === "applied"
              ? "border-[var(--accent)] text-[var(--ink)]"
              : "border-[var(--line)] text-[var(--ink-3)]"
          }`}
        >
          Applied Look
        </button>
      </div>

      {view === "poster" ? (
        <div className="media media-poster border border-[var(--line)]">
          <Image
            src={images[active]}
            alt={product.altText}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      ) : (
        <div
          className="media media-product media-car-crop border border-[var(--line)]"
          style={
            {
              "--focal": focal,
              "--crop-scale": "1.2",
            } as CSSProperties
          }
        >
          <Image
            src={images[active]}
            alt={`${product.name} applied look`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}

      {images.length > 1 && (
        <div className="flex gap-2 overflow-auto">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={`relative w-20 h-14 shrink-0 overflow-hidden border media-car-crop ${
                active === index ? "border-[var(--accent)]" : "border-[var(--line)]"
              }`}
              style={
                {
                  "--focal": focalFromSrc(src),
                  "--crop-scale": "1.15",
                } as CSSProperties
              }
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
