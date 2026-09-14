import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const styles = [
  { id: "family", label: "Family", href: "/plan-your-trip?style=family" },
  { id: "honeymoon", label: "Honeymoon", href: "/plan-your-trip?style=honeymoon" },
  { id: "adventure", label: "Adventure", href: "/plan-your-trip?style=adventure" },
  { id: "group", label: "Group", href: "/packages" },
  { id: "pilgrimage", label: "Pilgrimage", href: "/plan-your-trip?style=pilgrimage" },
  { id: "corporate", label: "Corporate", href: "/corporate-travel" },
] as const;

export async function ExperienceStyles() {
  const t = await getTranslations("platform");

  return (
    <section className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl">
        <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
          {t("requestEnquiry")}
        </p>
        <h2 className="mt-3 font-display text-4xl text-cream">Travel styles</h2>
        <p className="mt-4 max-w-2xl text-soft-gray">
          Tell us the kind of trip you want. We plan around real destinations and packages —
          no fake availability.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {styles.map((style) => (
            <Link
              key={style.id}
              href={style.href}
              className="rounded-full border border-[var(--line)] px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.16em] text-white/80 transition hover:border-gold/50 hover:text-gold"
            >
              {style.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
