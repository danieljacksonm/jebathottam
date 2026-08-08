import { setRequestLocale } from "next-intl/server";
import { FilmOpening } from "@/components/film/FilmOpening";
import { KodaiFilmJourney } from "@/components/film/KodaiFilmJourney";
import { GoldenFinale } from "@/components/film/GoldenFinale";
import { WhyKodaikanal } from "@/components/cinematic/WhyKodaikanal";
import { ImmersiveExperiences } from "@/components/cinematic/ImmersiveExperiences";
import { WhyCanaan } from "@/components/cinematic/WhyCanaan";
import { CustomerStories } from "@/components/cinematic/CustomerStories";
import { InteractiveMap } from "@/components/cinematic/InteractiveMap";
import { GalleryMasonry } from "@/components/cinematic/GalleryMasonry";
import { LuxuryPackages } from "@/components/cinematic/LuxuryPackages";
import { DigitalStrip } from "@/components/cinematic/DigitalStrip";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <FilmOpening />
      <KodaiFilmJourney />
      <WhyKodaikanal />
      <ImmersiveExperiences pinned />
      <WhyCanaan />
      <CustomerStories />
      <InteractiveMap />
      <GalleryMasonry />
      <GoldenFinale />
      <LuxuryPackages />
      <DigitalStrip />
    </>
  );
}
