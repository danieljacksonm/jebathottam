import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

const HERO = "/images/travel/d/singapore.jpg";

const TOPICS = [
  {
    title: "Business trips",
    body: "Flights, hotels, and transfers coordinated for working travellers — dates and destinations confirmed after enquiry.",
  },
  {
    title: "Team retreats & outings",
    body: "Group stays and day programmes shaped around your team size, budget, and preferred region.",
  },
  {
    title: "Meetings & conferences",
    body: "Travel support around events — lodging clusters, airport transfers, and itinerary buffers.",
  },
  {
    title: "Custom corporate itineraries",
    body: "Multi-city or multi-destination programmes planned with Canaan — no invented inventory or fake availability.",
  },
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
  const platform = await getTranslations("platform");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={platform("corporateTitle")}
        title={platform("corporateTitle")}
        subtitle={platform("corporateBody")}
        image={HERO}
        imageAlt="City skyline for corporate travel planning"
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("corporate") },
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="font-display text-3xl text-cream md:text-4xl">
          How we support companies
        </h2>
        <p className="mt-4 max-w-2xl text-soft-gray">
          Canaan coordinates travel on enquiry — tell us destinations, dates, and
          headcount. We do not invent seat inventory or hotel availability.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {TOPICS.map((topic) => (
            <article key={topic.title} className="lux-card p-8">
              <h3 className="font-display text-2xl text-white">{topic.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-soft-gray">
                {topic.body}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-4">
          <Link href="/plan-your-trip?style=corporate" className="btn-gold">
            {platform("corporateCta")}
          </Link>
          <Link href="/contact" className="btn-ghost">
            {nav("contact")}
          </Link>
        </div>
      </section>
    </PageAtmosphere>
  );
}
