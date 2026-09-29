import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { MagneticCta } from "@/components/cinematic/MagneticCta";
import { SERVICE_IMAGES_REGISTRY } from "@/data/image-registry";
import { travelServices } from "@/data/services";

export type ServiceNamespace =
  | "flightsPage"
  | "hotelsPage"
  | "visaPage"
  | "toursPage"
  | "trainsPage"
  | "consultingPage";

const imageByNamespace: Record<
  ServiceNamespace,
  keyof typeof SERVICE_IMAGES_REGISTRY
> = {
  flightsPage: "flights",
  hotelsPage: "hotels",
  visaPage: "visa",
  toursPage: "tours",
  trainsPage: "trains",
  consultingPage: "consulting",
};

const serviceSlugByNamespace: Record<ServiceNamespace, string> = {
  flightsPage: "flights",
  hotelsPage: "hotels",
  visaPage: "visa",
  toursPage: "tours",
  trainsPage: "trains",
  consultingPage: "consulting",
};

const relatedLinks: Record<
  ServiceNamespace,
  {
    href: string;
    labelKey:
      | "packages"
      | "planTrip"
      | "hotels"
      | "flights"
      | "trains"
      | "consulting"
      | "corporate"
      | "visa"
      | "services";
  }[]
> = {
  flightsPage: [
    { href: "/hotels", labelKey: "hotels" },
    { href: "/services/travel-consulting", labelKey: "consulting" },
    { href: "/plan-your-trip", labelKey: "planTrip" },
  ],
  hotelsPage: [
    { href: "/flights", labelKey: "flights" },
    { href: "/packages", labelKey: "packages" },
    { href: "/plan-your-trip", labelKey: "planTrip" },
  ],
  visaPage: [
    { href: "/flights", labelKey: "flights" },
    { href: "/services/travel-consulting", labelKey: "consulting" },
    { href: "/plan-your-trip", labelKey: "planTrip" },
  ],
  toursPage: [
    { href: "/packages", labelKey: "packages" },
    { href: "/services/train-tickets", labelKey: "trains" },
    { href: "/plan-your-trip", labelKey: "planTrip" },
  ],
  trainsPage: [
    { href: "/packages", labelKey: "packages" },
    { href: "/hotels", labelKey: "hotels" },
    { href: "/plan-your-trip", labelKey: "planTrip" },
  ],
  consultingPage: [
    { href: "/packages", labelKey: "packages" },
    { href: "/corporate-travel", labelKey: "corporate" },
    { href: "/plan-your-trip", labelKey: "planTrip" },
  ],
};

export async function ServicePageView({
  locale,
  namespace,
  enquireKey,
  crumb,
}: {
  locale: string;
  namespace: ServiceNamespace;
  enquireKey: string;
  crumb: string;
}) {
  setRequestLocale(locale);
  const t = await getTranslations(namespace);
  const shared = await getTranslations("serviceShared");
  const nav = await getTranslations("nav");
  const common = await getTranslations("common");
  const svc = await getTranslations("serviceBlurbs");
  const asset = SERVICE_IMAGES_REGISTRY[imageByNamespace[namespace]];
  const currentSlug = serviceSlugByNamespace[namespace];

  const howKeys = ["how1", "how2", "how3"] as const;
  const faqKeys = ["faq1", "faq2", "faq3"] as const;
  const otherServices = travelServices
    .filter((s) => s.slug !== currentSlug)
    .slice(0, 3);

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
        image={asset.src}
        imageAlt={asset.alt}
        tone={namespace === "hotelsPage" ? "gold" : "mist"}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("services"), href: "/services" },
          { name: crumb },
        ]}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_0.85fr] md:px-8 md:py-20">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">
            {shared("introTitle")}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-soft-gray md:text-lg">
            {t("body")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticCta href={`/enquire?package=${enquireKey}&service=${enquireKey}&source=service`} className="btn-gold">
              {t("cta")}
              <span data-mag-arrow>→</span>
            </MagneticCta>
            <Link href="/plan-your-trip" className="btn-ghost">
              {nav("planTrip")}
            </Link>
          </div>
        </div>
        <aside className="border border-[var(--line)] bg-[#04101f]/50 p-6 md:p-8">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
            {shared("noteTitle")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-soft-gray">{t("note")}</p>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-gold" />
              {shared("point1")}
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-gold" />
              {shared("point2")}
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-gold" />
              {shared("point3")}
            </li>
          </ul>
        </aside>
      </section>

      <section className="border-y border-[var(--line)] bg-[#04101f]/40 px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl text-cream md:text-4xl">
            {t("howTitle")}
          </h2>
          <div className="mt-10 grid gap-0 md:grid-cols-3">
            {howKeys.map((key, i) => (
              <article
                key={key}
                className="border border-[var(--line)] p-6 md:border-l-0 md:first:border-l"
              >
                <p className="font-display text-4xl text-gold/40">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-2xl text-white">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                  {t(`${key}Body`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <h2 className="font-display text-3xl text-cream">{t("faqTitle")}</h2>
        <div className="mt-8 space-y-6">
          {faqKeys.map((key) => (
            <div key={key} className="border-b border-[var(--line)] pb-6">
              <h3 className="text-base font-medium text-white">{t(`${key}Q`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-soft-gray">
                {t(`${key}A`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {otherServices.length > 0 ? (
        <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold">
            {common("related")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-cream">
            {shared("relatedTitle")}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {otherServices.map((service) => (
              <Link
                key={service.slug}
                href={service.href}
                className="group relative aspect-[5/3] overflow-hidden border border-[var(--line)]"
                data-cursor="view"
              >
                <Image
                  src={service.image}
                  alt={labels[service.slug] || service.slug}
                  fill
                  className="object-cover transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl text-white">
                    {labels[service.slug] || service.slug}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-mist/90">
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
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedLinks[namespace].map((link) => (
              <Link key={link.href} href={link.href} className="btn-ghost !py-2.5">
                {nav(link.labelKey)}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-[var(--line)] px-5 py-20 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-script text-3xl text-gold-bright">Canaan</p>
          <h2 className="mt-4 font-display text-4xl text-cream md:text-5xl">
            {t("ctaTitle")}
          </h2>
          <p className="mt-5 text-soft-gray">{t("ctaBody")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <MagneticCta href={`/enquire?package=${enquireKey}&service=${enquireKey}&source=service`} className="btn-gold">
              {t("cta")}
              <span data-mag-arrow>→</span>
            </MagneticCta>
            <Link href="/plan-your-trip" className="btn-ghost">
              {nav("planTrip")}
            </Link>
          </div>
        </div>
      </section>
    </PageAtmosphere>
  );
}
