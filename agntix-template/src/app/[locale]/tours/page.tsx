import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { PackageListing } from "@/components/packages/PackageListing";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SERVICE_IMAGES_REGISTRY } from "@/data/image-registry";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/tours",
    title: t("toursTitle"),
    description: t("toursDescription"),
    image: SERVICE_IMAGES_REGISTRY.tours.src,
    imageAlt: SERVICE_IMAGES_REGISTRY.tours.alt,
  });
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("toursPage");
  const nav = await getTranslations("nav");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={SERVICE_IMAGES_REGISTRY.tours.src}
        imageAlt={SERVICE_IMAGES_REGISTRY.tours.alt}
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("tours") },
        ]}
      />
      <PackageListing hideIntro />
    </PageAtmosphere>
  );
}
