import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const HERO_PANELS = [
  {
    src: "/images/marketing/kodai-banner.jpg",
    alt: "Kodaikanal hills with Canaan Travel Hub",
  },
  {
    src: "/images/marketing/darjeeling-banner.jpg",
    alt: "Darjeeling tea hills and Himalayan views",
  },
  {
    src: "/images/goa/goa-hero.jpg",
    alt: "Goa beaches and coastal adventure",
  },
] as const;

export async function GlobalHero() {
  const t = await getTranslations("platform");

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-[#020b16]">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3">
        {HERO_PANELS.map((panel, index) => (
          <div
            key={panel.src}
            className={`relative ${index === 0 ? "block" : "hidden md:block"}`}
          >
            <Image
              src={panel.src}
              alt={panel.alt}
              fill
              priority={index === 0}
              className="object-cover object-center opacity-50"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#020b16]/60 via-[#020b16]/50 to-[#020b16]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.16),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-20 pt-36 md:px-8 md:pb-28">
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
