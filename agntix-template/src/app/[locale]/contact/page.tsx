import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80"
        tone="forest"
        compact
      />
      <section className="mx-auto max-w-2xl px-5 py-20 text-center md:px-8">
        <div className="glass-panel rounded-3xl px-8 py-12">
          <p className="text-soft-gray">{t("note")}</p>
          <Link href="/enquire" className="btn-gold mt-8 inline-flex">
            {t("cta")}
          </Link>
        </div>
      </section>
    </PageAtmosphere>
  );
}
