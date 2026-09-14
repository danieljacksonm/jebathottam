import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function CorporateStrip() {
  const t = await getTranslations("platform");

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl">
        <div className="lux-card relative overflow-hidden px-8 py-14 md:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(201,162,39,0.12),transparent_50%)]" />
          <div className="relative max-w-2xl">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-gold">
              {t("corporateTitle")}
            </p>
            <h2 className="mt-4 font-display text-4xl text-cream md:text-5xl">
              {t("corporateTitle")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-soft-gray">
              {t("corporateBody")}
            </p>
            <Link href="/corporate-travel" className="btn-gold mt-8 inline-flex">
              {t("corporateCta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
