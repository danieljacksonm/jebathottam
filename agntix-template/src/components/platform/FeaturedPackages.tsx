import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatInr, getLocalizedPackages } from "@/data/packages";

export async function FeaturedPackages() {
  const t = await getTranslations("platform");
  const locale = await getLocale();
  const packages = getLocalizedPackages(locale).filter((p) => p.featured);

  return (
    <section className="section-pad border-t border-[var(--line)] bg-[#04101f]/60">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
              {t("availableNow")}
            </p>
            <h2 className="mt-3 font-display text-4xl text-cream md:text-5xl">
              {t("featuredPackages")}
            </h2>
          </div>
          <Link href="/packages" className="text-sm text-gold hover:text-gold-bright">
            View all →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => (
            <article key={pkg.id} className="card-surface flex h-full flex-col overflow-hidden">
              <Link href={`/packages/${pkg.id}`} className="relative block aspect-[16/10]">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  quality={75}
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-mist/70">
                  {pkg.days}D / {pkg.nights}N
                </p>
                <h3 className="mt-2 font-display text-2xl text-cream">{pkg.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm text-soft-gray">{pkg.blurb}</p>
                <p className="mt-auto pt-6 text-gold-bright">
                  {t("from")} {formatInr(pkg.priceFrom)}{" "}
                  <span className="text-mist/70">{t("perPerson")}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
