import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ContactLinks } from "@/components/ContactLinks";
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
        image="/images/kodai/pine-forest.webp"
        imageAlt="Pine forest light in Kodaikanal"
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
        <div className="glass-panel rounded-3xl px-8 py-12 text-center md:text-left">
          <p className="text-soft-gray">{t("note")}</p>
          <ContactLinks
            className="mt-8"
            phoneLabel={t("phone")}
            whatsappLabel={t("whatsapp")}
            emailLabel={t("email")}
            facebookLabel={t("facebook")}
          />
          <Link href="/enquire" className="btn-gold mt-10 inline-flex">
            {t("cta")}
          </Link>
        </div>
      </section>
    </PageAtmosphere>
  );
}
