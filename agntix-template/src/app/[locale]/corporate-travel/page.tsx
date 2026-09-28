import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { MagneticCta } from "@/components/cinematic/MagneticCta";
import { pageMetadata } from "@/lib/seo";

const HERO = "/images/travel/d/singapore.jpg";

const TOPIC_KEYS = ["business", "retreats", "meetings", "custom"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/corporate-travel",
    title: t("corporateTitle"),
    description: t("corporateDescription"),
    image: HERO,
    imageAlt: "Corporate and group travel planning with Canaan Travel Hub",
  });
}

export default async function CorporateTravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const t = await getTranslations("corporatePage");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={HERO}
        imageAlt={t("heroAlt")}
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("corporate") },
        ]}
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.35fr_0.9fr] md:px-8 md:py-20">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-3xl text-cream md:text-4xl">
            {t("supportTitle")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-soft-gray md:text-lg">
            {t("supportBody")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticCta href="/plan-your-trip?style=corporate" className="btn-gold">
              {t("cta")}
              <span data-mag-arrow>→</span>
            </MagneticCta>
            <Link href="/contact" className="btn-ghost">
              {nav("contact")}
            </Link>
          </div>
        </div>
        <aside className="border border-[var(--line)] bg-[#04101f]/50 p-6 md:p-8">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
            {t("noteTitle")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-soft-gray">{t("note")}</p>
        </aside>
      </section>

      <section className="border-y border-[var(--line)] bg-[#04101f]/40 px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl text-cream md:text-4xl">
            {t("topicsTitle")}
          </h2>
          <div className="mt-10 grid gap-0 md:grid-cols-2">
            {TOPIC_KEYS.map((key) => (
              <article
                key={key}
                className="border border-[var(--line)] p-7 md:odd:border-r-0"
              >
                <h3 className="font-display text-2xl text-white">
                  {t(`topics.${key}.title`)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-soft-gray">
                  {t(`topics.${key}.body`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] px-5 py-20 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-script text-3xl text-gold-bright">Canaan</p>
          <h2 className="mt-4 font-display text-4xl text-cream md:text-5xl">
            {t("finalTitle")}
          </h2>
          <p className="mt-5 text-soft-gray">{t("finalBody")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <MagneticCta href="/plan-your-trip?style=corporate" className="btn-gold">
              {t("cta")}
              <span data-mag-arrow>→</span>
            </MagneticCta>
            <Link href="/services" className="btn-ghost">
              {nav("services")}
            </Link>
          </div>
        </div>
      </section>
    </PageAtmosphere>
  );
}
