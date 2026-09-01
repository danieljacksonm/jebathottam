import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactLinks } from "@/components/ContactLinks";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const contact = await getTranslations("contact");
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
                ["/faq", "faq"],
              ] as const
            ).map(([href, key]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white/65 transition hover:text-gold">
                  {nav(key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
              {t("contact")}
            </p>
            <ContactLinks
              className="mt-4"
              compact
              phoneLabel={contact("phone")}
              whatsappLabel={contact("whatsapp")}
              emailLabel={contact("email")}
              facebookLabel={contact("facebook")}
            />
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-[0.7rem] text-mist/45">{t("rights", { year })}</p>
          <div className="flex flex-wrap justify-center gap-5 text-[0.7rem] text-mist/55">
            <Link href="/privacy" className="transition hover:text-gold">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="transition hover:text-gold">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
