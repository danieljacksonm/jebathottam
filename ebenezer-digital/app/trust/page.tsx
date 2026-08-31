import { StudioPageShell } from "@/components/studio/StudioPageShell";
import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Trust & Reliability | Ebenezer Digital Services",
  description: "How Ebenezer Digital keeps projects on time, clear, and easy to work with.",
  path: "/trust",
});

const pillars = [
  {
    title: "Reliability",
    body: "Deadlines are agreed in advance and we stick to them. Your project gets the same care whether you are local or overseas.",
  },
  {
    title: "Clear communication",
    body: "Plain English, prompt replies, and straightforward status updates — no jargon, no surprises.",
  },
  {
    title: "Professional ethics",
    body: "Your data and requirements are handled with confidentiality. We work in a manner suitable for startups and established businesses.",
  },
  {
    title: "Quality delivery",
    body: "We ship work that is tested, documented where needed, and ready for real use — not demo-quality handoffs.",
  },
];

export default function TrustPage() {
  return (
    <StudioPageShell
      kicker="Trust"
      title="Why clients work with us"
      lead="Clarity, consistency, and respect for your time and budget."
    >
      <div className="space-y-8 not-prose">
        {pillars.map((p) => (
          <div key={p.title} className="border-t border-[var(--st-line)] pt-6">
            <h2 className="text-lg font-semibold text-white">{p.title}</h2>
            <p className="mt-2 text-white/70">{p.body}</p>
          </div>
        ))}
      </div>
    </StudioPageShell>
  );
}
