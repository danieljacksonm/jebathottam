import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FilmOpening } from "@/components/film/FilmOpening";
import { HomeChrome } from "@/components/cinematic/HomeChrome";
import { LazySection } from "@/components/cinematic/LazySection";
import { pageMetadata } from "@/lib/seo";
import { HERO_IMAGE, HERO_OG } from "@/lib/media";

const KodaiFilmJourney = dynamic(() =>
  import("@/components/film/KodaiFilmJourney").then((m) => m.KodaiFilmJourney),
);
const WhyKodaikanal = dynamic(() =>
  import("@/components/cinematic/WhyKodaikanal").then((m) => m.WhyKodaikanal),
);
const ImmersiveExperiences = dynamic(() =>
  import("@/components/cinematic/ImmersiveExperiences").then((m) => m.ImmersiveExperiences),
);
const WhyCanaan = dynamic(() =>
  import("@/components/cinematic/WhyCanaan").then((m) => m.WhyCanaan),
);
const CustomerStories = dynamic(() =>
  import("@/components/cinematic/CustomerStories").then((m) => m.CustomerStories),
);
const InteractiveMap = dynamic(() =>
  import("@/components/cinematic/InteractiveMap").then((m) => m.InteractiveMap),
);
const GalleryMasonry = dynamic(() =>
  import("@/components/cinematic/GalleryMasonry").then((m) => m.GalleryMasonry),
);
const GoldenFinale = dynamic(() =>
  import("@/components/film/GoldenFinale").then((m) => m.GoldenFinale),
);
const LuxuryPackages = dynamic(() =>
  import("@/components/cinematic/LuxuryPackages").then((m) => m.LuxuryPackages),
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
    image: HERO_OG,
    imageAlt: "Misty Kodaikanal mountains at dawn",
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
      <HomeChrome />
      <FilmOpening />
      <LazySection minHeight="120vh" rootMargin="-20% 0px">
        <KodaiFilmJourney />
      </LazySection>
      <LazySection>
        <WhyKodaikanal />
      </LazySection>
      <LazySection minHeight="80vh">
        <ImmersiveExperiences pinned />
      </LazySection>
      <LazySection>
        <WhyCanaan />
      </LazySection>
      <LazySection>
        <CustomerStories />
      </LazySection>
      <LazySection>
        <InteractiveMap />
      </LazySection>
      <LazySection>
        <GalleryMasonry />
      </LazySection>
      <LazySection>
        <GoldenFinale />
      </LazySection>
      <LazySection>
        <LuxuryPackages />
      </LazySection>
      <LazySection minHeight="40vh">
        <DigitalStrip />
      </LazySection>
    </>
  );
}
