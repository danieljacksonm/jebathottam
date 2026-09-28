import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const styles = [
  {
    id: "family",
    href: "/plan-your-trip?style=family",
    image: "/images/travel/p/kodaikanal/pine-forest.jpg",
    labelKey: "styleFamily" as const,
  },
  {
    id: "honeymoon",
    href: "/plan-your-trip?style=honeymoon",
    image: "/images/travel/p/bali/tegallalang.jpg",
    labelKey: "styleHoneymoon" as const,
  },
  {
    id: "adventure",
    href: "/plan-your-trip?style=adventure",
    image: "/images/travel/d/leh-ladakh.jpg",
    labelKey: "styleAdventure" as const,
  },
  {
    id: "corporate",
    href: "/corporate-travel",
    image: "/images/travel/d/singapore.jpg",
    labelKey: "styleCorporate" as const,
  },
] as const;

export async function ExperienceStyles() {
  const t = await getTranslations("platform");

  return (
    <section className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl">
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
          {t("stylesEyebrow")}
        </p>
        <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
          {t("stylesTitle")}
        </h2>
        <p className="mt-4 max-w-2xl text-soft-gray">{t("stylesBody")}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {styles.map((style) => (
            <Link
              key={style.id}
              href={style.href}
              className="group relative aspect-[4/5] overflow-hidden border border-[var(--line)]"
              data-cursor="view"
            >
              <Image
                src={style.image}
                alt={t(style.labelKey)}
                fill
                quality={80}
                className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-lux)] group-hover:scale-[1.05]"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04101f] via-[#04101f]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-2xl text-white md:text-3xl">
                  {t(style.labelKey)}
                </p>
                <p className="mt-2 text-[0.65rem] uppercase tracking-[0.16em] text-gold-bright opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100">
                  {t("stylesCta")} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
