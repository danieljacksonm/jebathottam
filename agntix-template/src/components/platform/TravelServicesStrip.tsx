import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { travelServices } from "@/data/services";

/** Homepage strip — clear travel-business services (not “digital agency”). */
export async function TravelServicesStrip() {
  const t = await getTranslations("platform");
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
    <section className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl">
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
          {t("servicesTitle")}
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl text-cream md:text-5xl">
          {t("servicesTitle")}
        </h2>
        <p className="mt-4 max-w-2xl text-soft-gray">{t("servicesBody")}</p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {travelServices.map((service) => (
            <Link
              key={service.slug}
              href={service.href}
              className="lux-card group relative aspect-[5/3] overflow-hidden"
            >
              <Image
                src={service.image}
                alt={labels[service.slug] ?? service.slug}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl text-white">
                  {labels[service.slug] ?? service.slug}
                </h3>
                <p className="mt-2 text-sm text-mist/90">{service.blurb}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services" className="btn-ghost">
            {t("viewAllServices")}
          </Link>
        </div>
      </div>
    </section>
  );
}
