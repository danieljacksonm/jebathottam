import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";

type Namespace = "flightsPage" | "hotelsPage" | "visaPage" | "toursPage";

const images: Record<Namespace, string> = {
  flightsPage:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2400&q=80",
  hotelsPage:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=80",
  visaPage:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2400&q=80",
  toursPage:
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2400&q=80",
};

export async function ServicePageView({
  locale,
  namespace,
  enquireKey,
}: {
  locale: string;
  namespace: Namespace;
  enquireKey: string;
}) {
  setRequestLocale(locale);
  const t = await getTranslations(namespace);

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={images[namespace]}
        tone={namespace === "hotelsPage" ? "gold" : "mist"}
      />

      <section className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8">
        <div className="glass-panel rounded-3xl px-8 py-12">
          <p className="text-lg leading-relaxed text-soft-gray">
            Digital support around your Kodaikanal journey — calm guidance, clear next steps,
            the same Canaan standard.
          </p>
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
