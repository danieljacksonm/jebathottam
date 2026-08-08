import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { LuxuryPackages } from "@/components/cinematic/LuxuryPackages";
import { CustomerStories } from "@/components/cinematic/CustomerStories";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("packages");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=80"
        tone="mist"
      />
      <LuxuryPackages hideIntro />
      <CustomerStories />
    </PageAtmosphere>
  );
}
