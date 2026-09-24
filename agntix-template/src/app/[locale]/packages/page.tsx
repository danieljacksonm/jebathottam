import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { PackageListing } from "@/components/packages/PackageListing";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { GeoAnswer } from "@/components/seo/GeoAnswer";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { HOME_IMAGES } from "@/data/image-registry";
import { pageMetadata } from "@/lib/seo";

const HERO = HOME_IMAGES.hero.src;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/packages",
    title: t("packagesTitle"),
    description: t("packagesDescription"),
    image: HERO,
    imageAlt: "Travel packages across India destinations with Canaan Travel Hub",
  });
}

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("packages");
  const nav = await getTranslations("nav");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={HERO}
        imageAlt={HOME_IMAGES.hero.alt}
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("packages") },
        ]}
      />
      <GeoAnswer>{t("geoSummary")}</GeoAnswer>
      <PackageListing hideIntro />
      <HowItWorksSection />
    </PageAtmosphere>
  );
}
