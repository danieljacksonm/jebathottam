import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnquireForm } from "@/components/EnquireForm";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";

export default async function EnquirePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("enquirePage");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80"
        tone="gold"
        compact
      />
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
        <div className="glass-panel rounded-3xl p-6 md:p-10">
          <Suspense
            fallback={<div className="h-64 animate-pulse rounded-2xl bg-navy-mid/40" />}
          >
            <EnquireForm />
          </Suspense>
        </div>
      </section>
    </PageAtmosphere>
  );
}
