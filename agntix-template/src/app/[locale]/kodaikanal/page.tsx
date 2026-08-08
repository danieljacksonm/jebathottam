import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { PackageGrid } from "@/components/PackageGrid";
import { ImmersiveExperiences } from "@/components/cinematic/ImmersiveExperiences";
import { InteractiveMap } from "@/components/cinematic/InteractiveMap";
import { GalleryMasonry } from "@/components/cinematic/GalleryMasonry";

export default async function KodaikanalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kodaikanalPage");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80"
        tone="gold"
      />

      <section className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8">
        <p className="font-display text-2xl leading-relaxed text-white/90 md:text-4xl">
          {t("intro")}
        </p>
        <Link href="/packages" className="btn-gold mt-10 inline-flex">
          {t("cta")}
        </Link>
      </section>

      <ImmersiveExperiences pinned={false} />
      <InteractiveMap />
      <PackageGrid showHeader />
      <GalleryMasonry />
    </PageAtmosphere>
  );
}
