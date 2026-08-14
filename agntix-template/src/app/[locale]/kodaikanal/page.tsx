import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { PackageGrid } from "@/components/PackageGrid";
import { ImmersiveExperiences } from "@/components/cinematic/ImmersiveExperiences";
import { InteractiveMap } from "@/components/cinematic/InteractiveMap";
import { GalleryMasonry } from "@/components/cinematic/GalleryMasonry";
import { KodaiGuide } from "@/components/KodaiGuide";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, touristAttractionJsonLd } from "@/lib/seo";

const HERO = "/images/kodai/hero.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/kodaikanal",
    title: t("kodaiTitle"),
    description: t("kodaiDescription"),
    image: HERO,
    imageAlt: "Kodaikanal mist and pine-covered hills",
  });
}

export default async function KodaikanalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("kodaikanalPage");
  const nav = await getTranslations("nav");

  return (
    <PageAtmosphere>
      <JsonLd data={touristAttractionJsonLd()} />
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={HERO}
        imageAlt="Misty morning view of Kodaikanal mountains"
        tone="gold"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("kodaikanal") },
        ]}
      />

      <section className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8">
        <p className="font-display text-2xl leading-relaxed text-white/90 md:text-4xl">
          {t("intro")}
        </p>
        <Link href="/packages" className="btn-gold mt-10 inline-flex">
          {t("cta")}
        </Link>
      </section>

      <KodaiGuide locale={locale} />
      <ImmersiveExperiences pinned={false} />
      <InteractiveMap />
      <PackageGrid showHeader />
      <GalleryMasonry />
    </PageAtmosphere>
  );
}
