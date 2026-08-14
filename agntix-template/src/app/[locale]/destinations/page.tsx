import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

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
    path: "/destinations",
    title: t("destinationsTitle"),
    description: t("destinationsDescription"),
    image: HERO,
    imageAlt: "Kodaikanal, the current Canaan destination",
  });
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("seo");
  const nav = await getTranslations("nav");
  const k = await getTranslations("kodaikanalPage");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={nav("destinations")}
        title={t("destinationsTitle")}
        subtitle={t("destinationsDescription")}
        image={HERO}
        imageAlt="Kodaikanal mountains in mist"
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("destinations") },
        ]}
      />
      <section className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <article className="lux-card overflow-hidden">
          <Link href="/kodaikanal" className="grid md:grid-cols-2">
            <div className="relative aspect-[16/11] md:aspect-auto">
              <Image
                src={HERO}
                alt="Misty morning view of Kodaikanal mountains"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
                {k("eyebrow")}
              </p>
              <h2 className="mt-3 font-display text-4xl text-white">{k("title")}</h2>
              <p className="mt-4 text-soft-gray">{k("subtitle")}</p>
              <p className="mt-6 text-sm text-gold-bright">{k("cta")} →</p>
            </div>
          </Link>
        </article>
      </section>
    </PageAtmosphere>
  );
}
