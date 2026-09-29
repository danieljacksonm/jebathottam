import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GeoAnswer } from "@/components/seo/GeoAnswer";
import { travelServices } from "@/data/services";
import { SERVICE_IMAGES_REGISTRY } from "@/data/image-registry";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { MagneticCta } from "@/components/cinematic/MagneticCta";
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
  const svc = await getTranslations("serviceBlurbs");

  const labels: Record<string, string> = {
    flights: nav("flights"),
    hotels: nav("hotels"),
    visa: nav("visa"),
    trains: nav("trains"),
    consulting: nav("consulting"),
    tours: nav("tours"),
    corporate: nav("corporate"),
  };

  const [lead, ...rest] = travelServices;

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

      <section className="mx-auto max-w-3xl px-5 py-10 text-center md:px-8">
        <p className="text-base leading-relaxed text-soft-gray md:text-lg">
          {t("intro")}
        </p>
      </section>

      {lead ? (
        <section className="mx-auto max-w-7xl px-5 pb-8 md:px-8">
          <Link
            href={lead.href}
            className="group relative grid min-h-[22rem] overflow-hidden border border-[var(--line)] lg:min-h-[28rem] lg:grid-cols-2"
            data-cursor="view"
          >
            <div className="relative min-h-[16rem] lg:min-h-full">
              <Image
                src={lead.image}
                alt={labels[lead.slug] || lead.slug}
                fill
                className="object-cover transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-end bg-[#04101f]/80 p-8 md:p-10">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
                {t("eyebrow")}
              </p>
              <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
                {labels[lead.slug] || lead.slug}
              </h2>
              <p className="mt-4 max-w-md text-soft-gray">
                {svc(
                  lead.slug as
                    | "flights"
                    | "trains"
                    | "hotels"
                    | "visa"
                    | "consulting"
                    | "corporate"
                    | "tours",
                )}
              </p>
              <p className="mt-6 text-[0.68rem] uppercase tracking-[0.16em] text-gold-bright">
                {nav("services")} →
              </p>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 sm:grid-cols-2 lg:grid-cols-3 md:px-8 md:pb-24">
        {rest.map((service) => (
          <Link
            key={service.slug}
            href={service.href}
            className="group relative aspect-[5/4] overflow-hidden border border-[var(--line)]"
            data-cursor="view"
          >
            <Image
              src={service.image}
              alt={labels[service.slug] || service.slug}
              fill
              className="object-cover transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h2 className="font-display text-3xl text-white">
                {labels[service.slug] || service.slug}
              </h2>
              <p className="mt-2 text-sm text-mist/90">
                {svc(
                  service.slug as
                    | "flights"
                    | "trains"
                    | "hotels"
                    | "visa"
                    | "consulting"
                    | "corporate"
                    | "tours",
                )}
              </p>
            </div>
          </Link>
        ))}
      </section>

      <section className="border-t border-[var(--line)] px-5 py-16 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-script text-3xl text-gold-bright">Canaan</p>
          <div className="mt-8">
            <MagneticCta href="/enquire?source=service" className="btn-gold">
              {t("cta")}
              <span data-mag-arrow>→</span>
            </MagneticCta>
          </div>
        </div>
      </section>
    </PageAtmosphere>
  );
}
