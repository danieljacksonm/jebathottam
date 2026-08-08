import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  formatInr,
  getPackage,
  packageCopy,
  packages,
  type PackageId,
} from "@/data/packages";
import type { Locale } from "@/i18n/routing";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";

export function generateStaticParams() {
  return packages.map((pkg) => ({ id: pkg.id }));
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const pkg = getPackage(id);
  if (!pkg) notFound();

  const t = await getTranslations("packages");
  const copy = packageCopy[pkg.id as PackageId];
  const loc = locale as Locale;

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={`${pkg.days} Days · ${pkg.nights} Nights`}
        title={copy.title[loc]}
        subtitle={copy.blurb[loc]}
        image={pkg.image}
        tone="forest"
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.35fr_0.75fr] md:px-8 md:py-24">
        <div>
          <p className="text-lg leading-relaxed text-soft-gray md:text-xl">
            {copy.body[loc]}
          </p>
          <ul className="mt-10 space-y-4">
            {pkg.highlights.map((item) => (
              <li key={item} className="flex gap-3 text-white/80">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="glass-panel h-fit rounded-3xl p-7">
          <div className="flex items-center gap-2 text-gold-bright">
            <Star size={16} fill="currentColor" />
            <span>{pkg.rating.toFixed(1)}</span>
            <span className="text-sm text-mist">
              · {t("reviews", { count: pkg.reviewCount })}
            </span>
          </div>
          <p className="mt-5 text-[0.65rem] uppercase tracking-[0.16em] text-mist">
            {t("from")}
          </p>
          <p className="font-display text-4xl text-gold-bright">
            {formatInr(pkg.priceFrom)}
          </p>
          <p className="text-sm text-mist">{t("perPerson")}</p>
          <Link href={`/enquire?package=${pkg.id}`} className="btn-gold mt-7 w-full">
            {t("detailCta")}
          </Link>
          <div className="relative mt-7 aspect-[16/10] overflow-hidden rounded-2xl">
            <Image src={pkg.image} alt="" fill className="object-cover" sizes="400px" />
          </div>
        </aside>
      </section>
    </PageAtmosphere>
  );
}
