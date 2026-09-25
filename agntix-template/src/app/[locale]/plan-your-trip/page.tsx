import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PlanYourTripForm } from "@/components/PlanYourTripForm";
import { getLocalizedPackagesAsync } from "@/data/packages";
import { pageMetadata } from "@/lib/seo";
import { HERO_OG } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/plan-your-trip",
    title: t("planTripTitle"),
    description: t("planTripDescription"),
    image: HERO_OG,
    imageAlt: "Plan a Kodaikanal trip with Canaan Travel Hub",
  });
}

export default async function PlanYourTripPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("planTrip");
  const nav = await getTranslations("nav");
  const packages = (await getLocalizedPackagesAsync(locale)).map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    days: pkg.days,
    nights: pkg.nights,
  }));

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="/images/kodai/hero.webp"
        imageAlt="Misty Kodaikanal hills"
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("planTrip") },
        ]}
      />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1fr_0.85fr] md:px-8 md:py-24">
        <PlanYourTripForm packages={packages} />
        <aside className="h-fit space-y-6 rounded-3xl border border-[var(--line)] bg-navy-mid/35 p-7 md:sticky md:top-28">
          <h2 className="font-display text-2xl text-cream">{t("asideTitle")}</h2>
          <p className="text-sm leading-relaxed text-soft-gray">{t("asideBody")}</p>
          <a
            href={whatsappUrl({ type: "planTrip" })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex"
          >
            {t("whatsappAside")}
          </a>
        </aside>
      </section>
    </PageAtmosphere>
  );
}
