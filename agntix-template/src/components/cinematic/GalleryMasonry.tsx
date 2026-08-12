"use client";

import Image from "next/image";
import { galleryImages } from "@/data/cinematic";
import { useReveal } from "./motion";
import { useTranslations } from "next-intl";

export function GalleryMasonry() {
  const ref = useReveal([]);
  const t = useTranslations("homeCinematic");

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="section-pad bg-navy"
    >
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="max-w-2xl">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-gold">
            {t("galleryEyebrow")}
          </p>
          <h2 className="mt-4 font-display text-5xl text-white md:text-6xl">
            {t("galleryTitle")}
          </h2>
        </div>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {galleryImages.map((src, i) => (
            <div
              key={src}
              data-reveal
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl"
            >
              <div
                className={`relative overflow-hidden ${
                  i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[16/10]"
                }`}
              >
                <Image
                  src={src}
                  alt={`Kodaikanal gallery ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
