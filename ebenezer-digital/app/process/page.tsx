import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Our Process | Ebenezer Digital Services",
  description:
    "How we work: contact, discuss requirements, share a clear quote, execute, and deliver with support.",
  path: "/process",
});

const steps = [
  { step: 1, title: "You contact us", body: "Reach out by email or WhatsApp with a short description of what you need. No commitment yet—just tell us about your project." },
  { step: 2, title: "Requirement discussion", body: "We ask a few questions to understand your goals, format, and preferences. This helps us give you an accurate quote and timeline." },
  { step: 3, title: "Clear quote & timeline", body: "You receive a clear quote and delivery timeline. We only start work once you are satisfied with the terms." },
  { step: 4, title: "Work execution", body: "We do the work and keep you updated. If anything changes, we communicate immediately so there are no surprises." },
  { step: 5, title: "Delivery & support", body: "We deliver as agreed. If you need small revisions or have questions, we are here to support you." },
];

export default function ProcessPage() {
  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">Process</p>
      <h1 className="studio-display mt-4 text-5xl sm:text-7xl">
        HOW WE
        <br />
        WORK WITH YOU.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-[var(--st-muted)]">
        A simple, transparent process from first message to final delivery.
      </p>
      <div className="mt-16 max-w-4xl">
        {steps.map((item) => (
          <article key={item.step} className="grid gap-4 border-t border-[var(--st-line)] py-10 md:grid-cols-[120px_1fr]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-400">
              {String(item.step).padStart(2, "0")}
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
