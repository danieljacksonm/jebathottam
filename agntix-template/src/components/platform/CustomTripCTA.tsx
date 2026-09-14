import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function CustomTripCTA() {
  const t = await getTranslations("platform");

  return (
    <section className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <h2 className="font-display text-4xl text-cream md:text-5xl">
          {t("customTitle")}
        </h2>
        <p className="mt-5 text-soft-gray">{t("customBody")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/plan-your-trip" className="btn-gold">
            {t("ctaPlan")}
          </Link>
          <Link href="/contact" className="btn-ghost">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
