import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactLinks } from "@/components/ContactLinks";
import { whatsappUrl } from "@/lib/whatsapp";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const contact = await getTranslations("contact");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)] bg-[#030f1f]">
      <div className="gold-rule" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-5 md:px-8 md:py-20">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/canaan-logo.jpeg"
              alt="Canaan Travel Hub"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover ring-1 ring-gold/40"
            />
            <div>
              <p className="font-script text-3xl text-gold-bright">{nav("brand")}</p>
              <p className="text-[0.58rem] uppercase tracking-[0.28em] text-mist">
                {nav("brandSub")}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-soft-gray">
            {t("about")}
          </p>
          <p className="mt-4 font-display text-lg text-white/90">{t("tagline")}</p>
        </div>

        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            {t("explore")}
          </p>
          <ul className="mt-5 space-y-3">
            {(
              [
                ["/", "home"],
                ["/destinations", "destinations"],
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
                ["/services/train-tickets", "trains"],
                ["/flights", "flights"],
                ["/hotels", "hotels"],
                ["/visa", "visa"],
                ["/services/travel-consulting", "consulting"],
                ["/corporate-travel", "corporate"],
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
            {t("company")}
          </p>
          <ul className="mt-5 space-y-3">
            {(
              [
                ["/about", "about"],
                ["/contact", "contact"],
                ["/plan-your-trip", "planTrip"],
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
        </div>

        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">
            {t("contact")}
          </p>
          <ContactLinks
            className="mt-5"
            compact
            phoneLabel={contact("phone")}
            whatsappLabel={contact("whatsapp")}
            emailLabel={contact("email")}
            facebookLabel={contact("facebook")}
            whatsappHref={whatsappUrl({ type: "general" })}
          />
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-[0.7rem] text-mist/45">{t("rights", { year })}</p>
          <div className="flex flex-wrap justify-center gap-5 text-[0.7rem] text-mist/55">
            <Link href="/policies" className="transition hover:text-gold">
              {t("policies")}
            </Link>
            <Link href="/cancellation" className="transition hover:text-gold">
              {t("cancellation")}
            </Link>
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
