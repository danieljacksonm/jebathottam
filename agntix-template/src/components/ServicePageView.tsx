import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

import { SERVICE_IMAGES } from "@/lib/media";

type Namespace = "flightsPage" | "hotelsPage" | "visaPage" | "toursPage";

const imageByNamespace: Record<Namespace, keyof typeof SERVICE_IMAGES> = {
  flightsPage: "flights",
  hotelsPage: "hotels",
  visaPage: "visa",
  toursPage: "tours",
};

const altByNamespace: Record<Namespace, string> = {
  flightsPage: "Aircraft wing above clouds for flight assistance",
  hotelsPage: "Quiet hillside stay near Kodaikanal",
  visaPage: "Travel documents for visa assistance",
  toursPage: "Mountain road towards a Kodaikanal sightseeing day",
};

export async function ServicePageView({
  locale,
  namespace,
  enquireKey,
  crumb,
}: {
  locale: string;
  namespace: Namespace;
  enquireKey: string;
  crumb: string;
}) {
  setRequestLocale(locale);
  const t = await getTranslations(namespace);
  const nav = await getTranslations("nav");
  const serviceKey = imageByNamespace[namespace];
  const heroImage = SERVICE_IMAGES[serviceKey];
  const heroAlt = altByNamespace[namespace];

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={heroImage}
        imageAlt={heroAlt}
        tone={namespace === "hotelsPage" ? "gold" : "mist"}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: crumb },
        ]}
      />

      <section className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8">
        <div className="glass-panel rounded-3xl px-8 py-12">
          <p className="text-lg leading-relaxed text-soft-gray">{t("subtitle")}</p>
          <Link
            href={`/enquire?package=${enquireKey}`}
            className="btn-gold mt-8 inline-flex"
          >
            {t("cta")}
          </Link>
        </div>
      </section>
    </PageAtmosphere>
  );
}
