import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { KodaiGuide } from "@/components/KodaiGuide";
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
    path: "/faq",
    title: t("faqTitle"),
    description: t("faqDescription"),
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kodaikanalGuide");
  const nav = await getTranslations("nav");
  const seo = await getTranslations("seo");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow="FAQ"
        title={seo("faqTitle")}
        subtitle={seo("faqDescription")}
        image="/images/kodai/coakers-walk.webp"
        imageAlt="Pine forest path in Kodaikanal mist"
        tone="forest"
        compact
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: t("faqTitle") },
        ]}
      />
      <KodaiGuide locale={locale} />
    </PageAtmosphere>
  );
}
