import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo";

export async function KodaiGuide({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "kodaikanalGuide" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const faq = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
    { q: t("faq5q"), a: t("faq5a") },
  ];

  const sections = [
    { id: "why", title: t("whyTitle"), body: t("whyBody") },
    { id: "when", title: t("whenTitle"), body: t("whenBody") },
    { id: "do", title: t("doTitle"), body: t("doBody") },
    { id: "reach", title: t("reachTitle"), body: t("reachBody") },
    { id: "stay", title: t("stayTitle"), body: t("stayBody") },
    { id: "days", title: t("daysTitle"), body: t("daysBody") },
    { id: "tips", title: t("tipsTitle"), body: t("tipsBody") },
  ];

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
      <JsonLd data={faqJsonLd(faq)} />
      {sections.map((section) => (
        <article key={section.id} className="mb-12">
          <h2 className="font-display text-3xl text-white md:text-4xl">{section.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-soft-gray md:text-lg">
            {section.body}
          </p>
        </article>
      ))}

      <nav aria-label={t("linksLabel")} className="mt-10 flex flex-wrap gap-3">
        <Link href="/packages" className="btn-gold">
          {nav("packages")}
        </Link>
        <Link href="/blog" className="btn-ghost">
          {nav("blog")}
        </Link>
        <Link href="/hotels" className="btn-ghost">
          {nav("hotels")}
        </Link>
        <Link href="/enquire" className="btn-ghost">
          {nav("enquire")}
        </Link>
      </nav>

      <div className="mt-16">
        <h2 className="font-display text-3xl text-white">{t("faqTitle")}</h2>
        <dl className="mt-8 space-y-6">
          {faq.map((item) => (
            <div key={item.q} className="border-t border-[var(--line)] pt-5">
              <dt>
                <h3 className="font-display text-xl text-gold-bright">{item.q}</h3>
              </dt>
              <dd className="mt-2 text-soft-gray">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
