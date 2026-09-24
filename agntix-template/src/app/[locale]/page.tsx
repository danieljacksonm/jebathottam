import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GlobalHero, HOME_HERO_IMAGE } from "@/components/platform/GlobalHero";
import { FeaturedDestinations } from "@/components/platform/FeaturedDestinations";
import { FeaturedPackages } from "@/components/platform/FeaturedPackages";
import { CorporateStrip } from "@/components/platform/CorporateStrip";
import { CustomTripCTA } from "@/components/platform/CustomTripCTA";
import { ExperienceStyles } from "@/components/platform/ExperienceStyles";
import { TravelServicesStrip } from "@/components/platform/TravelServicesStrip";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { LazySection } from "@/components/cinematic/LazySection";
import { HomeGeoSummary } from "@/components/seo/HomeGeoSummary";
import { pageMetadata } from "@/lib/seo";

const WhyCanaan = dynamic(() =>
  import("@/components/cinematic/WhyCanaan").then((m) => m.WhyCanaan),
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

async function TrustStrip() {
  const t = await getTranslations("platform");
  return (
    <section className="border-b border-[var(--line)] bg-[#04101f]/80 px-5 py-8 md:px-8">
      <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-soft-gray md:text-base">
        {t("trustLine")}
      </p>
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
      <GlobalHero />
      <TrustStrip />
      <HomeGeoSummary />
      <FeaturedDestinations />
      <FeaturedPackages />
      <LazySection>
        <WhyCanaan />
      </LazySection>
      <ExperienceStyles />
      <TravelServicesStrip />
      <CorporateStrip />
      <LazySection>
        <HowItWorksSection />
      </LazySection>
      <CustomTripCTA />
    </>
  );
}
