import Link from "next/link";
import { Media } from "@/components/media/Media";
import { BANNER_IMAGE } from "@/lib/image-art";

/** Large automotive visual — full car frame, not a macro crop */
export function LifestyleBanner() {
  return (
    <section className="relative border-y border-[var(--line)] overflow-hidden">
      <Media
        src={BANNER_IMAGE}
        alt="Chrome red wrap — built to stand out"
        kind="banner"
        crop="frame"
        cropScale={1.1}
        focal="62% 26%"
        focalMobile="58% 24%"
        zoom
      />
      <div className="absolute inset-0 scrim-full pointer-events-none" />
      <div className="absolute inset-0 flex items-end sm:items-center">
        <div className="container-x py-12 sm:py-0 w-full">
          <p className="section-kicker mb-4">Presence</p>
          <h2 className="statement text-white text-[clamp(2.5rem,8vw,5.5rem)] max-w-3xl">
            <span className="statement-line">Built To</span>
            <span className="statement-line">Stand Out.</span>
          </h2>
          <Link href="/shop/chrome-wraps" className="btn btn-primary mt-8 inline-flex">
            Shop Chrome →
          </Link>
        </div>
      </div>
    </section>
  );
}
