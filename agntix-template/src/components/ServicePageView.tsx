import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

type Namespace = "flightsPage" | "hotelsPage" | "visaPage" | "toursPage";

const images: Record<Namespace, { src: string; alt: string }> = {
  flightsPage: {
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=70",
    alt: "Aircraft wing above clouds for flight assistance",
  },
  hotelsPage: {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=70",
    alt: "Quiet hillside stay near Kodaikanal",
  },
  visaPage: {
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=70",
    alt: "Travel documents for visa assistance",
  },
  toursPage: {
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=70",
    alt: "Mountain road towards a Kodaikanal sightseeing day",
  },
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
  const media = images[namespace];

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={media.src}
        imageAlt={media.alt}
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
