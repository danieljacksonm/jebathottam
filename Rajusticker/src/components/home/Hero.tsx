import Link from "next/link";
import { Media } from "@/components/media/Media";
import { HERO_IMAGE } from "@/lib/image-art";

/**
 * Split hero — row height follows the 16:9 car frame (no empty letterbox).
 * Focal aimed at the chrome-gold front three-quarter, not rear door / poster footer.
 */
export function Hero() {
  return (
    <section className="border-b border-[var(--line)] overflow-hidden">
      <div className="grid md:grid-cols-12">
        <div className="md:col-span-5 order-2 md:order-1 flex flex-col justify-center bg-[var(--bg)] px-[var(--gutter)] py-12 md:py-14 border-t md:border-t-0 md:border-r border-[var(--line)]">
          <p className="section-kicker mb-5">Automotive · Premium · Custom</p>
          <h1 className="statement text-[clamp(2.8rem,6.5vw,4.8rem)]">
            <span className="statement-line">Make Your</span>
            <span className="statement-line text-[var(--accent)]">Car Yours.</span>
          </h1>
          <p className="mt-5 max-w-sm text-[var(--ink-2)] leading-relaxed">
            Premium wraps and vinyl finishes for drivers who refuse to blend in.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/shop" className="btn btn-primary">
              Shop the Collection →
            </Link>
            <Link href="/custom-stickers" className="btn btn-secondary">
              Custom Stickers
            </Link>
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-[var(--ink-3)]">
            Chrome · Carbon · Metallic · Matte
          </p>
        </div>

        <div
          className="md:col-span-7 order-1 md:order-2 relative w-full bg-[#050506]"
          style={{ aspectRatio: "16 / 9" }}
        >
          <Media
            src={HERO_IMAGE}
            alt="Chrome gold wrapped luxury car — Raju Stickers"
            kind="hero"
            priority
            crop="frame"
            cropScale={1.6}
            focal="50% 16%"
            focalMobile="50% 15%"
            sizes="(max-width: 768px) 100vw, 58vw"
            className="absolute inset-0 !h-full !min-h-0 !max-h-none"
          />
          {/* Soft blend into the type panel */}
          <div
            className="hidden md:block absolute inset-y-0 left-0 w-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, var(--bg) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
