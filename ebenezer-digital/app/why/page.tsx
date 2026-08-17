import { pageMetadata } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Why Ebenezer Digital | About our studio",
  description:
    "We focus on clear communication, on-time delivery, and practical digital work for businesses in India and worldwide.",
  path: "/why",
});

export default function WhyPage() {
  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <p className="studio-kicker">About</p>
      <h1 className="studio-display mt-4 max-w-5xl text-5xl sm:text-7xl">
        WE FOCUS ON
        <br />
        WHAT MATTERS.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">
        Getting the job done well, on time, and at a fair price.
      </p>
      <div className="mt-16 grid gap-10 sm:grid-cols-2">
        {[
          { title: "Communication you can count on", body: "We reply quickly and in plain English. You will always know where your project stands." },
          { title: "Quality without the jargon", body: "We deliver work that meets your standards. No technical overload—just results that fit your business." },
          { title: "Affordable pricing", body: "Transparent quotes so you can plan. We aim to offer value that works for startups and established clients alike." },
          { title: "Long-term support", body: "Need follow-up work or small changes? We are here for ongoing support so you can rely on us again and again." },
        ].map((item) => (
          <article key={item.title} className="border-t border-[var(--st-line)] pt-8">
            <h2 className="studio-display text-3xl">{item.title}</h2>
            <p className="mt-4 text-[var(--st-muted)] leading-relaxed">{item.body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
