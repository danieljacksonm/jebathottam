import Link from "next/link";
import { pageMetadata } from "@/lib/site-url";
import { db } from "@/lib/db";
import { portfolioSlug } from "@/lib/portfolio-slug";

export const metadata = pageMetadata({
  title: "Case studies | Ebenezer Digital",
  description:
    "Selected project write-ups from real Ebenezer Digital work — qualitative outcomes only, no invented metrics.",
  path: "/case-studies",
});

export default async function CaseStudiesPage() {
  const portfolio = await db.getPortfolio(true);
  const studies = portfolio.slice(0, 12);

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">Case studies</p>
      <h1 className="studio-display mt-4 max-w-4xl text-5xl sm:text-7xl">SELECTED WORK.</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">
        Outcomes below are qualitative. We do not publish fabricated conversion percentages or
        invented client quotes.
      </p>

      {studies.length === 0 ? (
        <p className="mt-16 text-[var(--st-muted)]">
          Case studies are being prepared. See{" "}
          <Link href="/work" className="underline hover:text-white">
            our work
          </Link>{" "}
          for live projects.
        </p>
      ) : (
        <div className="mt-16 space-y-12">
          {studies.map((p) => (
            <article key={p.id} className="border-t border-[var(--st-line)] pt-10">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">
                {p.clientName || "Client project"}
                {p.projectPhase ? ` · ${p.projectPhase}` : ""}
              </p>
              <h2 className="studio-display mt-3 text-3xl sm:text-4xl">
                <Link href={`/work/${portfolioSlug(p)}`} className="hover:text-emerald-300">
                  {p.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-3xl text-[var(--st-muted)] leading-relaxed">{p.description}</p>
              {p.techStack?.length ? (
                <p className="mt-4 text-sm text-white/40">Stack: {p.techStack.join(" · ")}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <Link href={`/work/${portfolioSlug(p)}`} className="underline hover:text-white">
                  Full case study
                </Link>
                {p.liveUrl ? (
                  <a
                    href={p.liveUrl}
                    className="underline hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View live
                  </a>
                ) : null}
                <Link href="/work" className="underline hover:text-white">
                  Full work index
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
