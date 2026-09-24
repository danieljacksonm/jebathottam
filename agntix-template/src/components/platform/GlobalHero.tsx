import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HOME_IMAGES } from "@/data/image-registry";

/** Licensed Unsplash mountain landscape — homepage only (not a destination package banner). */
export const HOME_HERO_IMAGE = HOME_IMAGES.hero.src;

export async function GlobalHero() {
  const t = await getTranslations("platform");

  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden bg-[#061018] md:min-h-[88vh]">
      <Image
        src={HOME_HERO_IMAGE}
        alt={HOME_IMAGES.hero.alt}
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[center_35%] motion-safe:animate-[hero-drift_36s_ease-in-out_infinite_alternate]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#061018]/88 via-[#061018]/45 to-[#061018]/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061018] via-transparent to-[#061018]/35" />

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 md:min-h-[88vh] md:px-8 md:pb-24">
        <p className="text-[0.72rem] uppercase tracking-[0.32em] text-gold">
          {t("heroEyebrow")}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] text-cream sm:text-5xl md:text-7xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
          {t("heroSub")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/destinations" className="btn-gold">
            {t("ctaDestinations")}
          </Link>
          <Link href="/plan-your-trip" className="btn-ghost">
            {t("ctaPlan")}
          </Link>
        </div>
      </div>
    </section>
  );
}
