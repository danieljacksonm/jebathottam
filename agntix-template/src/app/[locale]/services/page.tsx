import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GeoAnswer } from "@/components/seo/GeoAnswer";
import { travelServices } from "@/data/services";
import { SERVICE_IMAGES_REGISTRY } from "@/data/image-registry";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
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
    path: "/services",
    title: t("servicesTitle"),
    description: t("servicesDescription"),
    image: SERVICE_IMAGES_REGISTRY.consulting.src,
    imageAlt: SERVICE_IMAGES_REGISTRY.consulting.alt,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicesPage");
  const nav = await getTranslations("nav");

  const labels: Record<string, string> = {
    flights: nav("flights"),
    hotels: nav("hotels"),
    visa: nav("visa"),
    trains: nav("trains"),
    consulting: nav("consulting"),
    tours: nav("tours"),
    corporate: nav("corporate"),
  };

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={SERVICE_IMAGES_REGISTRY.consulting.src}
        imageAlt={SERVICE_IMAGES_REGISTRY.consulting.alt}
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("services") },
        ]}
      />

      <GeoAnswer>{t("geoSummary")}</GeoAnswer>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:grid-cols-2 lg:grid-cols-3 md:px-8 md:py-24">
        {travelServices.map((service) => (
          <Link
            key={service.slug}
            href={service.href}
            className="lux-card relative aspect-[5/4] block overflow-hidden"
          >
            <Image
              src={service.image}
              alt={labels[service.slug] || service.slug}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h2 className="font-display text-3xl text-white">
                {labels[service.slug] || service.slug}
              </h2>
              <p className="mt-2 text-sm text-mist/90">{service.blurb}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20 text-center md:px-8">
        <Link href="/enquire" className="btn-gold">
          {t("cta")}
        </Link>
      </section>
    </PageAtmosphere>
  );
}
