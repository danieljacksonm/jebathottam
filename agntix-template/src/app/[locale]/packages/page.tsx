import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { LuxuryPackages } from "@/components/cinematic/LuxuryPackages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { GeoAnswer } from "@/components/seo/GeoAnswer";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { pageMetadata } from "@/lib/seo";

const HERO = "/images/marketing/home-hero.jpg";

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
        imageAlt="Mountain travel landscape for Canaan Travel Hub packages"
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
      <LuxuryPackages hideIntro />
      <HowItWorksSection />
    </PageAtmosphere>
  );
}
