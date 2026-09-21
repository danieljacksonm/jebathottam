import { pageMetadata } from "@/lib/site-url";
import { resolveRequestLocale } from "@/lib/i18n/request-locale";
import { getStudioSiteCopy } from "@/lib/i18n/studio-site-copy";

export const metadata = pageMetadata({
  title: "Our Process | Ebenezer Digital Services",
  description:
    "How we work: contact, discuss requirements, share a clear quote, execute, and deliver with support.",
  path: "/process",
});

export default function ProcessPage() {
  const copy = getStudioSiteCopy(resolveRequestLocale());
  const p = copy.process;

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">{p.kicker}</p>
      <h1 className="studio-display mt-4 text-5xl sm:text-7xl">
        {p.titleLine1}
        <br />
        {p.titleLine2}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-[var(--st-muted)]">{p.intro}</p>
      <div className="mt-16 max-w-4xl">
        {p.steps.map((item, index) => (
          <article
            key={item.title}
            className="grid gap-4 border-t border-[var(--st-line)] py-10 md:grid-cols-[120px_1fr]"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400">
              {String(index + 1).padStart(2, "0")}
            </p>
            <div>
              <h2 className="studio-display text-4xl sm:text-5xl">{item.title}</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-[var(--st-muted)]">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
