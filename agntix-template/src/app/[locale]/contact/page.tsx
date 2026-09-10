import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ContactLinks } from "@/components/ContactLinks";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { BUSINESS } from "@/lib/contact";
import { REAL_KODAI } from "@/lib/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("contactTitle"),
    description: t("contactDescription"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const nav = await getTranslations("nav");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image={REAL_KODAI.pineCanopy}
        imageAlt="Tall pine canopy in Kodaikanal"
        tone="forest"
        compact
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("contact") },
        ]}
      />
      <section className="mx-auto max-w-2xl px-5 py-20 md:px-8">
        <div className="rounded-3xl border border-[var(--line)] bg-navy-mid/40 px-8 py-12 text-center md:text-left">
          <p className="text-soft-gray">{t("note")}</p>
          <p className="mt-4 text-sm text-mist">
            <span className="uppercase tracking-[0.16em] text-gold">
              {t("hours")}
            </span>
            <span className="mt-1 block text-white/85">{t("hoursValue")}</span>
          </p>
          <ContactLinks
            className="mt-8"
            phoneLabel={t("phone")}
            whatsappLabel={t("whatsapp")}
            emailLabel={t("email")}
            facebookLabel={t("facebook")}
            whatsappHref={whatsappUrl({ type: "contact" })}
          />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/plan-your-trip"
              className="btn-gold inline-flex justify-center"
            >
              {nav("planTrip")}
            </Link>
            <Link href="/enquire" className="btn-ghost inline-flex justify-center">
              {t("cta")}
            </Link>
          </div>
          <p className="mt-8 text-xs text-mist/60">{BUSINESS.tagline}</p>
        </div>
      </section>
    </PageAtmosphere>
  );
}
