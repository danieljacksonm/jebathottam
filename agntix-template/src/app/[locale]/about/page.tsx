import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { WhyCanaan } from "@/components/cinematic/WhyCanaan";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const values = ["care", "place", "trust"] as const;

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93bd?auto=format&fit=crop&w=2400&q=80"
        tone="gold"
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1.2fr_0.8fr] md:px-8">
        <div>
          <p className="text-lg leading-relaxed text-soft-gray md:text-xl">{t("body")}</p>
        </div>
        <div className="relative min-h-[280px] overflow-hidden rounded-3xl border border-[var(--line)]">
          <Image
            src="/brand/canaan-logo.jpeg"
            alt="Canaan Travel Hub"
            fill
            className="object-cover"
            sizes="40vw"
          />
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-navy-mid/50 px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-4xl text-white">{t("valuesTitle")}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((key) => (
              <div key={key} className="glass-panel rounded-3xl p-6">
                <div className="gold-rule mb-5 w-12" />
                <h3 className="font-display text-2xl text-gold-bright">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm text-soft-gray">{t(`values.${key}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyCanaan />
    </PageAtmosphere>
  );
}
