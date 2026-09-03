import Link from "next/link";
import { pageMetadata } from "@/lib/site-url";
import { SITE_EMAIL } from "@/lib/site-contact";

export const metadata = pageMetadata({
  title: "FAQ | Ebenezer Digital",
  description:
    "Common questions about Ebenezer Digital services, products, billing, and support.",
  path: "/faq",
});

const FAQS = [
  {
    q: "What is Ebenezer Digital?",
    a: "A digital technology company building software, digital products, web experiences, AI solutions, and media platforms.",
  },
  {
    q: "Where can I buy digital products?",
    a: "On Ebenezer Store (ebenezerdigital.store).",
  },
  {
    q: "What is Ebenezer Tools?",
    a: "A software discovery and comparison platform at tools.ebenezerdigital.com. Reviews are editorial assessments, not fake star aggregates.",
  },
  {
    q: "How do I contact you?",
    a: `Use the contact form on this site or email ${SITE_EMAIL}.`,
  },
  {
    q: "Do you invent client stats or testimonials?",
    a: "No. We only publish claims we can verify. Empty testimonial areas mean we have not published verified quotes yet.",
  },
];

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <p className="studio-kicker">FAQ</p>
      <h1 className="studio-display mt-4 text-5xl sm:text-7xl">QUESTIONS.</h1>
      <div className="mt-16 max-w-3xl space-y-10">
        {FAQS.map((f) => (
          <article key={f.q} className="border-t border-[var(--st-line)] pt-8">
            <h2 className="text-xl font-semibold text-white">{f.q}</h2>
            <p className="mt-3 text-[var(--st-muted)] leading-relaxed">{f.a}</p>
          </article>
        ))}
      </div>
      <p className="mt-12 text-sm text-[var(--st-muted)]">
        Still stuck?{" "}
        <Link href="/contact" className="underline hover:text-white">
          Contact us
        </Link>
        .
      </p>
    </main>
  );
}
