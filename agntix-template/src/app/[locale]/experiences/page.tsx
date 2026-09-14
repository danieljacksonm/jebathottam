import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CinematicPageHero } from "@/components/film/CinematicPageHero";
import { PageAtmosphere } from "@/components/film/PageAtmosphere";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

const EXPERIENCES = [
  {
    id: "family",
    title: "Family holidays",
    body: "Relaxed pacing, suitable stays, and packages that work for mixed ages.",
    href: "/plan-your-trip?style=family",
  },
  {
    id: "honeymoon",
    title: "Honeymoon travel",
    body: "Quiet stays and scenic circuits — request a custom honeymoon plan.",
    href: "/plan-your-trip?style=honeymoon",
  },
  {
    id: "adventure",
    title: "Adventure travel",
    body: "Hill circuits, viewpoints, and active days — built around real destinations.",
    href: "/plan-your-trip?style=adventure",
  },
  {
    id: "group",
    title: "Group tours",
    body: "Published group packages such as Darjeeling 3N/4D, plus custom group quotes.",
    href: "/packages",
  },
  {
    id: "pilgrimage",
    title: "Pilgrimage / spiritual",
    body: "Faith-aware itineraries on request — enquire with dates and temple routes.",
    href: "/plan-your-trip?style=pilgrimage",
  },
  {
    id: "corporate",
    title: "Corporate",
    body: "Business trips, retreats, team outings, and coordinated group travel.",
    href: "/corporate-travel",
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
    path: "/experiences",
    title: t("experiencesTitle"),
    description: t("experiencesDescription"),
    image: "/images/kodai/hero.webp",
    imageAlt: "Travel experiences with Canaan",
  });
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("seo");
  const nav = await getTranslations("nav");

  return (
    <PageAtmosphere>
      <CinematicPageHero
        eyebrow={nav("experiences")}
        title={t("experiencesTitle")}
        subtitle={t("experiencesDescription")}
        image="/images/kodai/hero.webp"
        imageAlt="Travel experiences"
        tone="mist"
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: nav("home"), href: "/" },
          { name: nav("experiences") },
        ]}
      />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {EXPERIENCES.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="lux-card block p-7 transition hover:border-gold/40"
            >
              <h2 className="font-display text-2xl text-cream">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-soft-gray">
                {item.body}
              </p>
              <p className="mt-6 text-sm text-gold">Request / enquire →</p>
            </Link>
          ))}
        </div>
      </section>
    </PageAtmosphere>
  );
}
