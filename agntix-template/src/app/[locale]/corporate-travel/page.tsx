import { getTranslations, setRequestLocale } from "next-intl/server";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CorporateEnquiryForm } from "@/components/CorporateEnquiryForm";
import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { Link } from "@/i18n/navigation";

const SERVICES = [
  "Business trips",
  "Corporate retreats",
  "Team outings",
  "Conferences & events",
  "MICE coordination",
  "Airport transfers",
  "Accommodation planning",
  "Group transportation",
  "Travel coordination",
  "Custom corporate programmes",
] as const;

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
    image: "/images/darjeeling/banners/banner-2.jpg",
    imageAlt: "Corporate travel with Canaan Travel Hub",
  });
}

export default async function CorporateTravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("corporate");
  const nav = await getTranslations("nav");
  const wa = whatsappUrl({
    type: "custom",
    message:
      "Hello Canaan Travel Hub, I would like to plan corporate travel. Please share how we can proceed.",
  });

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        image="/images/darjeeling/banners/banner-2.jpg"
        imageAlt="Corporate and group travel"
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("corporate") },
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl text-cream">{t("servicesTitle")}</h2>
            <ul className="mt-8 space-y-3">
              {SERVICES.map((item) => (
                <li
                  key={item}
                  className="border-b border-[var(--line)] pb-3 text-sm text-white/80"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-soft-gray">
              This is an enquiry service — not live ticket inventory. We coordinate
              travel with human planning and confirm availability with suppliers.
            </p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-6 inline-flex"
            >
              WhatsApp corporate desk
            </a>
            <Link href="/plan-your-trip" className="ml-3 mt-6 inline-flex text-sm text-gold">
              Or plan a custom trip →
            </Link>
          </div>

          <div className="lux-card p-6 md:p-8">
            <h2 className="font-display text-3xl text-cream">{t("formTitle")}</h2>
            <p className="mt-3 text-sm text-soft-gray">{t("formSubtitle")}</p>
            <div className="mt-8">
              <CorporateEnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </PageAtmosphere>
  );
}
