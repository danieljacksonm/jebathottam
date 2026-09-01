import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { LegalPageContent } from "@/components/LegalPageContent";
import { pageMetadata } from "@/lib/seo";

const sectionKeys = ["services", "bookings", "pricing", "liability", "changes", "law"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/terms",
    title: t("termsTitle"),
    description: t("termsDescription"),
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const nav = await getTranslations("nav");

  const sections = sectionKeys.map((key) => ({
    title: t(`terms.${key}.title`),
    body: t(`terms.${key}.body`),
  }));

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("termsEyebrow")}
        title={t("termsTitle")}
        subtitle={t("termsIntro")}
        image="/images/kodai/berijam.webp"
        imageAlt="Kodaikanal lake at dusk"
        tone="gold"
        compact
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: t("termsTitle") },
        ]}
      />
      <LegalPageContent
        title={t("termsTitle")}
        updated={t("termsUpdated")}
        intro={t("termsIntro")}
        sections={sections}
      />
    </PageAtmosphere>
  );
}
