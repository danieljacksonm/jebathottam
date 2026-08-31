import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
};

/** Consistent editorial wrapper for studio legal and company pages. */
export function StudioPageShell({
  kicker,
  title,
  lead,
  children,
  backHref = "/",
  backLabel = "Back to home",
}: Props) {
  return (
    <main className="min-h-screen bg-[#070708] pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <Link
          href={backHref}
          className="text-[11px] uppercase tracking-[0.18em] text-[var(--st-muted,#8d887e)] hover:text-white"
        >
          ← {backLabel}
        </Link>
        {kicker ? <p className="studio-kicker mt-8">{kicker}</p> : null}
        <h1 className="studio-display mt-4 text-4xl sm:text-5xl">{title}</h1>
        {lead ? (
          <p className="mt-6 text-lg leading-relaxed text-[var(--st-muted,#8d887e)]">{lead}</p>
        ) : null}
        <div className="studio-prose mt-10 space-y-5 text-base leading-8 text-white/75">{children}</div>
      </div>
    </main>
  );
}
