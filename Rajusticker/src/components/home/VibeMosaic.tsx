import Link from "next/link";
import { Media } from "@/components/media/Media";
import { categoryMeta } from "@/lib/catalog";
import { focalFromSrc } from "@/lib/image-art";
import type { ProductCategory } from "@/types";

const VIBES: {
  category: ProductCategory;
  image: string;
  label: string;
  crop?: "frame" | "tight";
}[] = [
  {
    category: "chrome-wraps",
    image: "/products/chrome-gold.jpg",
    label: "Chrome",
    crop: "frame",
  },
  {
    category: "carbon-fiber",
    image: "/products/holographic-carbon.jpg",
    label: "Carbon / Holo",
    crop: "tight",
  },
  {
    category: "matte-wraps",
    image: "/products/metallic-red-matte.jpg",
    label: "Matte",
    crop: "frame",
  },
  {
    category: "metallic-wraps",
    image: "/products/metallic-blue.jpg",
    label: "Metallic",
    crop: "frame",
  },
  {
    category: "solid-colors",
    image: "/products/gloss-white.jpg",
    label: "Solid",
    crop: "frame",
  },
];

/** Composition — asymmetric mosaic, not identical cards */
export function VibeMosaic() {
  return (
    <section className="section border-b border-[var(--line)]">
      <div className="container-x">
        <div className="mb-8 sm:mb-10 max-w-xl">
          <p className="section-kicker">Shop by Vibe</p>
          <h2 className="section-title">Pick a Finish.</h2>
          <p className="section-sub">Different energy. Same premium film.</p>
        </div>

        <div className="vibe-mosaic">
          {VIBES.map((vibe) => {
            const meta = categoryMeta[vibe.category];
            return (
              <Link
                key={vibe.category}
                href={`/shop/${meta.slug}`}
                className="group relative block overflow-hidden min-h-[220px] md:min-h-0 border border-[var(--line)]"
              >
                <Media
                  src={vibe.image}
                  alt={`${vibe.label} wraps`}
                  kind="category"
                  zoom
                  crop={vibe.crop || "frame"}
                  className="absolute inset-0"
                  focal={focalFromSrc(vibe.image)}
                />
                <div className="absolute inset-0 scrim-bottom pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="font-display text-xl sm:text-2xl tracking-[0.06em] text-white">
                    {vibe.label}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/55 group-hover:text-white/85 transition-colors">
                    Explore →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
