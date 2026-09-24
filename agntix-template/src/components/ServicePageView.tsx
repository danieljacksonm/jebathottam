import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SERVICE_IMAGES_REGISTRY } from "@/data/image-registry";

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

const relatedLinks: Record<
  ServiceNamespace,
  { href: string; labelKey: "packages" | "planTrip" | "hotels" | "flights" | "trains" | "consulting" | "corporate" }[]
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
  const nav = await getTranslations("nav");
  const asset = SERVICE_IMAGES_REGISTRY[imageByNamespace[namespace]];

  const howKeys = ["how1", "how2", "how3"] as const;
  const faqKeys = ["faq1", "faq2", "faq3"] as const;

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

      <section className="mx-auto max-w-3xl px-5 py-14 md:px-8">
        <p className="text-base leading-relaxed text-soft-gray md:text-lg">
          {t("body")}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-mist/80">{t("note")}</p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <h2 className="font-display text-3xl text-cream">{t("howTitle")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {howKeys.map((key, i) => (
            <article key={key} className="lux-card p-6">
              <p className="text-[0.62rem] uppercase tracking-[0.16em] text-gold">
                Step {i + 1}
              </p>
              <h3 className="mt-3 font-display text-xl text-white">
                {t(`${key}Title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                {t(`${key}Body`)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-16 md:px-8">
        <h2 className="font-display text-3xl text-cream">{t("faqTitle")}</h2>
        <div className="mt-8 space-y-6">
          {faqKeys.map((key) => (
            <div key={key} className="border-b border-[var(--line)] pb-6">
              <h3 className="text-base font-medium text-white">
                {t(`${key}Q`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-soft-gray">
                {t(`${key}A`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <p className="text-[0.68rem] uppercase tracking-[0.18em] text-gold">
          Related
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {relatedLinks[namespace].map((link) => (
            <Link key={link.href} href={link.href} className="btn-ghost !py-2.5">
              {nav(link.labelKey)}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[#04101f]/70 px-5 py-14 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-cream">{t("ctaTitle")}</h2>
            <p className="mt-3 max-w-xl text-sm text-soft-gray">{t("ctaBody")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/enquire?package=${enquireKey}`} className="btn-gold">
              {t("cta")}
            </Link>
            <Link href="/plan-your-trip" className="btn-ghost">
              {nav("planTrip")}
            </Link>
          </div>
        </div>
      </section>
    </PageAtmosphere>
  );
}
