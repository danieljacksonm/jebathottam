import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  formatPackagePrice,
  getLocalizedPackagesAsync,
  isEnquiryPriced,
} from "@/data/packages";
import { FeaturedPackagesMotion } from "@/components/platform/FeaturedPackagesMotion";
import { FeaturedPackageCard } from "@/components/platform/FeaturedPackageCard";

export async function FeaturedPackages() {
  const t = await getTranslations("platform");
  const pkgT = await getTranslations("packages");
  const locale = await getLocale();
  const packages = (await getLocalizedPackagesAsync(locale)).filter(
    (p) => p.featured,
  );

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
            <p className="mt-4 max-w-xl text-soft-gray">{t("packagesIntro")}</p>
          </div>
          <Link href="/packages" className="text-sm text-gold hover:text-gold-bright">
            {t("viewAllPackages")}
          </Link>
        </div>

        <FeaturedPackagesMotion>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => (
              <FeaturedPackageCard
                key={pkg.id}
                id={pkg.id}
                title={pkg.title}
                image={pkg.image}
                destination={pkg.details.destination}
                days={pkg.days}
                nights={pkg.nights}
                blurb={pkg.blurb}
                priceLabel={
                  isEnquiryPriced(pkg)
                    ? formatPackagePrice(pkg, pkgT("requestQuote"))
                    : `${t("from")} ${formatPackagePrice(pkg)}`
                }
                priceNote={isEnquiryPriced(pkg) ? null : t("perPerson")}
                enquireLabel={t("enquireNow")}
              />
            ))}
          </div>
        </FeaturedPackagesMotion>
      </div>
    </section>
  );
}
