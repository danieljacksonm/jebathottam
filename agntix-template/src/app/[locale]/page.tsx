import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GlobalHero } from "@/components/platform/GlobalHero";
import { FeaturedDestinations } from "@/components/platform/FeaturedDestinations";
import { FeaturedPackages } from "@/components/platform/FeaturedPackages";
import { CorporateStrip } from "@/components/platform/CorporateStrip";
import { CustomTripCTA } from "@/components/platform/CustomTripCTA";
import { ExperienceStyles } from "@/components/platform/ExperienceStyles";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { LazySection } from "@/components/cinematic/LazySection";
import { pageMetadata } from "@/lib/seo";

const WhyCanaan = dynamic(() =>
  import("@/components/cinematic/WhyCanaan").then((m) => m.WhyCanaan),
);
const DigitalStrip = dynamic(() =>
  import("@/components/cinematic/DigitalStrip").then((m) => m.DigitalStrip),
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
    image: "/images/darjeeling/hero/darjeeling-hero.jpg",
    imageAlt: "Canaan Travel Hub — destinations and journeys",
    absoluteTitle: true,
  });
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
      <FeaturedDestinations />
      <FeaturedPackages />
      <LazySection>
        <WhyCanaan />
      </LazySection>
      <ExperienceStyles />
      <CorporateStrip />
      <LazySection>
        <HowItWorksSection />
      </LazySection>
      <CustomTripCTA />
      <LazySection minHeight="40vh">
        <DigitalStrip />
      </LazySection>
    </>
  );
}
