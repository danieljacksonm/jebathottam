import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { LegalPageContent } from "@/components/LegalPageContent";
import { pageMetadata } from "@/lib/seo";

const sectionKeys = ["collect", "use", "share", "cookies", "rights", "contact"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/privacy",
    title: t("privacyTitle"),
    description: t("privacyDescription"),
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const nav = await getTranslations("nav");

  const sections = sectionKeys.map((key) => ({
    title: t(`privacy.${key}.title`),
    body: t(`privacy.${key}.body`),
  }));

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("privacyEyebrow")}
        title={t("privacyTitle")}
        subtitle={t("privacyIntro")}
        image="/images/kodai/coakers-walk.webp"
        imageAlt="Quiet forest path in Kodaikanal"
        tone="forest"
        compact
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: t("privacyTitle") },
        ]}
      />
      <LegalPageContent
        title={t("privacyTitle")}
        updated={t("privacyUpdated")}
        intro={t("privacyIntro")}
        sections={sections}
      />
    </PageAtmosphere>
  );
}
