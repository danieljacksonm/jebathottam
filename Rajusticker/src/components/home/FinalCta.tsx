import Link from "next/link";
import { Media } from "@/components/media/Media";
import { ATTITUDE_IMAGE } from "@/lib/image-art";

export function FinalCta() {
  return (
    <section className="relative border-t border-[var(--line)] overflow-hidden">
      <Media
        src={ATTITUDE_IMAGE}
        alt="Carbon fiber wrap — ready to make it yours"
        kind="banner"
        crop="frame"
        cropScale={1.12}
        focal="62% 22%"
        focalMobile="58% 20%"
        className="!aspect-auto !max-h-none min-h-[440px] sm:min-h-[520px]"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center">
        <div className="container-x text-center w-full py-16">
          <p className="section-kicker mb-5">Ready?</p>
          <h2 className="statement text-white text-[clamp(2.4rem,8vw,5rem)]">
            <span className="statement-line">Ready To</span>
            <span className="statement-line">Make It Yours?</span>
          </h2>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn btn-primary">
              Shop the Collection →
            </Link>
            <Link
              href="/custom-stickers"
              className="btn btn-secondary !border-white/35 !text-white hover:!bg-white/10"
            >
              Custom Stickers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
