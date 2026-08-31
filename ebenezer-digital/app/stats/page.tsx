import { STUDIO_STATS, STUDIO_STATS_EXTENDED } from "@/lib/studio-stats";
import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Results & Stats | Ebenezer Digital Services",
  description: "Delivery focus, client communication, and the kind of work Ebenezer Digital is built for.",
  path: "/stats",
});

export default function StatsPage() {
  return (
    <StudioPageShell
      kicker="By the numbers"
      title="Results you can verify"
      lead="Consistent delivery, clear communication, and work that ships — across web, e-commerce, and digital operations."
    >
      <div className="grid grid-cols-2 gap-8 border-y border-[var(--st-line)] py-10 lg:grid-cols-4">
        {STUDIO_STATS.map((stat) => (
          <div key={stat.label}>
            <p className="studio-display text-3xl sm:text-4xl text-emerald-400">{stat.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--st-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-8 pt-4 lg:grid-cols-4">
        {STUDIO_STATS_EXTENDED.filter((s) => !STUDIO_STATS.some((x) => x.label === s.label)).map((stat) => (
          <div key={stat.label}>
            <p className="studio-display text-3xl sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--st-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>
      <p>
        We work with startups, SMBs, agencies, and established businesses worldwide. Metrics reflect our studio
        delivery track record — not inflated marketing figures.
      </p>
    </StudioPageShell>
  );
}
