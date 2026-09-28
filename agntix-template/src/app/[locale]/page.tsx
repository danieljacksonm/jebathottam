import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HOME_HERO_IMAGE } from "@/components/platform/GlobalHero";
import { FeaturedDestinations } from "@/components/platform/FeaturedDestinations";
import { FeaturedPackages } from "@/components/platform/FeaturedPackages";
import { CorporateStrip } from "@/components/platform/CorporateStrip";
import { CustomTripCTA } from "@/components/platform/CustomTripCTA";
import { ExperienceStyles } from "@/components/platform/ExperienceStyles";
import { TravelServicesStrip } from "@/components/platform/TravelServicesStrip";
import { TravelGuidesStrip } from "@/components/platform/TravelGuidesStrip";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { LazySection } from "@/components/cinematic/LazySection";
import { HomeGeoSummary } from "@/components/seo/HomeGeoSummary";
import { CinematicHero } from "@/components/cinematic/CinematicHero";
import { HomeChrome } from "@/components/cinematic/HomeChrome";
import { pageMetadata } from "@/lib/seo";

const WhyCanaan = dynamic(() =>
  import("@/components/cinematic/WhyCanaan").then((m) => m.WhyCanaan),
);
const ImmersiveExperiences = dynamic(() =>
  import("@/components/cinematic/ImmersiveExperiences").then(
    (m) => m.ImmersiveExperiences,
  ),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/",
    title: t("homeTitle"),
    description: t("homeDescription"),
    image: HOME_HERO_IMAGE,
    imageAlt: "Canaan Travel Hub — journeys across India and beyond",
    absoluteTitle: true,
  });
}

async function EditorialIntro() {
  const t = await getTranslations("platform");
  return (
    <section className="relative border-b border-[var(--line)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-script text-3xl text-gold-bright md:text-4xl">Canaan</p>
        <h2 className="mt-4 font-display text-3xl leading-snug text-cream md:text-5xl">
          {t("editorialTitle")}
        </h2>
        <p className="mt-6 text-base leading-relaxed text-soft-gray md:text-lg">
          {t("editorialBody")}
        </p>
        <p className="mt-8 text-sm leading-relaxed text-mist/80">{t("trustLine")}</p>
      </div>
    </section>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <CinematicHero />
      <HomeChrome />
      <EditorialIntro />
      <HomeGeoSummary />
      <FeaturedDestinations />
      <FeaturedPackages />
      <LazySection>
        <ImmersiveExperiences pinned />
      </LazySection>
      <TravelServicesStrip />
      <LazySection>
        <WhyCanaan />
      </LazySection>
      <TravelGuidesStrip />
      <ExperienceStyles />
      <CorporateStrip />
      <LazySection>
        <HowItWorksSection />
      </LazySection>
      <CustomTripCTA />
    </>
  );
}
