import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedDestinations } from "@/data/destinations";

const BANNER = {
  src: "/images/travel/d/kodaikanal.jpg",
  alt: "Kodaikanal lake and hills",
};

export async function GlobalHero() {
  const t = await getTranslations("platform");
  const locale = await getLocale();
  const featured = await getFeaturedDestinations(locale, 1);
  const banner = featured[0]?.image
    ? { src: featured[0].image, alt: featured[0].name }
    : BANNER;

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-[#020b16]">
      {/* Plain img — avoids Next optimizer quirks that can hide the banner */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.src}
        alt={banner.alt}
        width={1920}
        height={1440}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020b16]/80 via-[#020b16]/15 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-20 pt-36 md:px-8 md:pb-28">
        <p className="text-[0.72rem] uppercase tracking-[0.32em] text-gold">
          {t("heroEyebrow")}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] text-cream md:text-7xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
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
        <p className="mt-8 text-[0.68rem] uppercase tracking-[0.22em] text-mist/70">
          Discover · Plan · Travel · Experience
        </p>
      </div>
    </section>
  );
}
