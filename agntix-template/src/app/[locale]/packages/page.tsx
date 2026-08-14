import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { LuxuryPackages } from "@/components/cinematic/LuxuryPackages";
import { CustomerStories } from "@/components/cinematic/CustomerStories";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

const HERO = "/images/kodai/mannavanur.webp";

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
    imageAlt: "Kodaikanal valley meadows for holiday packages",
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
        imageAlt="Open meadows near Mannavanur, Kodaikanal"
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("packages") },
        ]}
      />
      <LuxuryPackages hideIntro />
      <CustomerStories />
    </PageAtmosphere>
  );
}
