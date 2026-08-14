import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnquireForm } from "@/components/EnquireForm";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/enquire",
    title: t("enquireTitle"),
    description: t("enquireDescription"),
  });
}

export default async function EnquirePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("enquirePage");

  const nav = await getTranslations("nav");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="/images/kodai/poombarai.webp"
        imageAlt="Village terraces in the Kodaikanal hills"
        tone="gold"
        compact
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("enquire") },
        ]}
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
