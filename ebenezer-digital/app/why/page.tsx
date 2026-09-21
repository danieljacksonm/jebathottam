import { pageMetadata } from "@/lib/site-url";
import { resolveRequestLocale } from "@/lib/i18n/request-locale";
import { getStudioSiteCopy } from "@/lib/i18n/studio-site-copy";

export const metadata = pageMetadata({
  title: "Why Ebenezer Digital | About our studio",
  description:
    "We focus on clear communication, on-time delivery, and practical digital work for businesses in India and worldwide.",
  path: "/why",
});

export default function WhyPage() {
  const copy = getStudioSiteCopy(resolveRequestLocale());
  const w = copy.why;

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">{w.kicker}</p>
      <h1 className="studio-display mt-4 max-w-5xl text-5xl sm:text-7xl">
        {w.titleLine1}
        <br />
        {w.titleLine2}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">{w.intro}</p>
      <div className="mt-16 grid gap-10 sm:grid-cols-2">
        {w.pillars.map((item) => (
          <article key={item.title} className="border-t border-[var(--st-line)] pt-8">
            <h2 className="studio-display text-3xl">{item.title}</h2>
            <p className="mt-4 leading-relaxed text-[var(--st-muted)]">{item.body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
