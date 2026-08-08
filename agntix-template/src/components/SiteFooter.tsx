import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)] bg-[#030f1f]">
      <div className="gold-rule" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-4">
            <Image
              src="/brand/canaan-logo.jpeg"
              alt="Canaan Travel Hub"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover ring-1 ring-gold/40"
            />
            <div>
              <p className="font-script text-4xl text-gold-bright">Canaan</p>
              <p className="text-[0.62rem] uppercase tracking-[0.3em] text-mist">
                Travel Hub
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-soft-gray">
            {t("about")}
          </p>
          <p className="mt-5 font-display text-xl text-white/90">{t("tagline")}</p>
        </div>

        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            {t("explore")}
          </p>
          <ul className="mt-5 space-y-3">
            {(
              [
                ["/", "home"],
                ["/kodaikanal", "kodaikanal"],
                ["/packages", "packages"],
                ["/blog", "blog"],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white/65 transition hover:text-gold">
                  {nav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            {t("services")}
          </p>
          <ul className="mt-5 space-y-3">
            {(
              [
                ["/services", "services"],
                ["/flights", "flights"],
                ["/hotels", "hotels"],
                ["/visa", "visa"],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white/65 transition hover:text-gold">
                  {nav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            {t("support")}
          </p>
          <ul className="mt-5 space-y-3">
            {(
              [
                ["/about", "about"],
                ["/contact", "contact"],
                ["/enquire", "enquire"],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white/65 transition hover:text-gold">
                  {nav(key)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-mist/50">{t("contactSoon")}</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-6 text-center text-[0.7rem] text-mist/45 md:px-8">
        {t("rights", { year })}
      </div>
    </footer>
  );
}
