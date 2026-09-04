import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site-url";

type ServiceDef = {
  slug: string;
  title: string;
  forWho: string;
  value: string;
  capabilities: string[];
  process: string[];
  tech: string[];
  faq: { q: string; a: string }[];
};

export const SERVICE_LANDINGS: ServiceDef[] = [
  {
    slug: "web-development",
    title: "Web development",
    forWho: "Businesses that need a fast, clear website or web app — not a template clone.",
    value: "We design and build production websites with clean architecture, SEO foundations, and maintainable code.",
    capabilities: [
      "Marketing sites and product sites",
      "Custom Next.js / React applications",
      "CMS-backed content systems",
      "Performance and Core Web Vitals work",
    ],
    process: ["Discovery & scope", "Design & information architecture", "Build & QA", "Launch & handoff"],
    tech: ["Next.js", "TypeScript", "Tailwind", "Node"],
    faq: [
      {
        q: "Do you only use templates?",
        a: "No. We build from your requirements. Templates are used only when they clearly fit the job.",
      },
      {
        q: "Can you take over an existing site?",
        a: "Yes — after a short technical review of stack, hosting, and content ownership.",
      },
    ],
  },
  {
    slug: "saas-development",
    title: "SaaS development",
    forWho: "Founders and operators building billing, inventory, or multi-tenant tools.",
    value: "We ship practical SaaS foundations — auth, multi-tenant data, invoicing flows, and admin tools.",
    capabilities: [
      "Multi-tenant application structure",
      "Billing and invoice workflows",
      "Role-based admin panels",
      "API design for web and mobile clients",
    ],
    process: ["Product framing", "Architecture", "MVP build", "Iterate with real users"],
    tech: ["Next.js", "NestJS", "Prisma", "PostgreSQL / SQLite"],
    faq: [
      {
        q: "Do you build Ebenezer SaaS for clients?",
        a: "Ebenezer SaaS is our product. Custom SaaS work is scoped separately for your business.",
      },
    ],
  },
  {
    slug: "ai-solutions",
    title: "AI solutions",
    forWho: "Teams that want AI assistants or workflows grounded in their own data — not hype demos.",
    value: "We integrate practical AI features: chat, summarization, and internal tools with clear limits and human review.",
    capabilities: [
      "Product chat assistants",
      "Document and news summarization",
      "Workflow automation with human checkpoints",
      "Model routing for cost and quality",
    ],
    process: ["Use-case definition", "Data & safety constraints", "Prototype", "Production hardening"],
    tech: ["Eben AI stack", "API integrations", "Next.js"],
    faq: [
      {
        q: "Do you train custom models?",
        a: "Usually we compose existing models with your content and rules. Custom training is rare and scoped explicitly.",
      },
    ],
  },
  {
    slug: "business-automation",
    title: "Business automation",
    forWho: "Shops and offices drowning in repetitive WhatsApp, spreadsheet, or form work.",
    value: "We replace fragile manual steps with simple systems — forms, notifications, and operational dashboards.",
    capabilities: [
      "Lead capture and follow-up flows",
      "Document and PDF packs",
      "Ops dashboards",
      "Integrations between existing tools",
    ],
    process: ["Map the current process", "Remove waste", "Automate the bottleneck", "Train the team"],
    tech: ["Web apps", "APIs", "Store kits", "WhatsApp workflows"],
    faq: [
      {
        q: "Will you force a full rewrite?",
        a: "No. We prefer the smallest system that removes the pain.",
      },
    ],
  },
  {
    slug: "travel-booking",
    title: "Travel booking support",
    forWho: "Travel desks and agencies that need reliable booking operations and web presence.",
    value: "We support travel businesses with booking workflows, enquiry kits, and customer-facing sites.",
    capabilities: [
      "Enquiry and quotation flows",
      "Travel agency websites",
      "Operational templates",
      "Ongoing digital support",
    ],
    process: ["Understand routes & seasons", "Design the booking path", "Implement tools", "Support"],
    tech: ["Web", "Forms", "Store kits"],
    faq: [
      {
        q: "Do you book tickets as a travel agency?",
        a: "We build systems and support digital operations. Ticket inventory depends on your agency relationships.",
      },
    ],
  },
  {
    slug: "data-entry",
    title: "Data entry & admin",
    forWho: "Teams that need careful, confidential digitization and admin support.",
    value: "Accurate data entry, document conversion, and virtual assistance with clear turnaround expectations.",
    capabilities: [
      "Spreadsheet and form digitization",
      "Document formatting",
      "Virtual assistance",
      "Confidential handling",
    ],
    process: ["Sample batch", "Quality check", "Full run", "Delivery & archive"],
    tech: ["Office formats", "Secure transfer"],
    faq: [
      {
        q: "How do you protect data?",
        a: "We use agreed transfer channels and do not republish client data. Details are confirmed per project.",
      },
    ],
  },
];

export function getServiceLanding(slug: string) {
  return SERVICE_LANDINGS.find((s) => s.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getServiceLanding(params.slug);
  if (!service) return { title: "Service | Ebenezer Digital", robots: { index: false } };
  return pageMetadata({
    title: `${service.title} | Ebenezer Digital`,
    description: service.value,
    path: `/services/${service.slug}`,
  });
}

export function generateStaticParams() {
  return SERVICE_LANDINGS.map((s) => ({ slug: s.slug }));
}

export default function ServiceLandingPage({ params }: { params: { slug: string } }) {
  const service = getServiceLanding(params.slug);
  if (!service) {
    return (
      <main className="bg-[#070708] px-4 py-28">
        <p className="text-[var(--st-muted)]">Service not found.</p>
        <Link href="/services" className="mt-4 inline-block underline">
          All services
        </Link>
      </main>
    );
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="bg-[#070708] px-4 pb-24 pt-28 sm:px-8 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <p className="studio-kicker">Services</p>
      <h1 className="studio-display mt-4 max-w-4xl text-5xl sm:text-7xl">{service.title.toUpperCase()}.</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--st-muted)]">{service.value}</p>
      <p className="mt-4 max-w-2xl text-sm text-white/45">Who it is for: {service.forWho}</p>

      <section className="mt-16 border-t border-[var(--st-line)] pt-10">
        <h2 className="studio-display text-3xl">Capabilities</h2>
        <ul className="mt-6 space-y-3 text-[var(--st-muted)]">
          {service.capabilities.map((c) => (
            <li key={c}>— {c}</li>
          ))}
        </ul>
      </section>

      <section className="mt-14 border-t border-[var(--st-line)] pt-10">
        <h2 className="studio-display text-3xl">Process</h2>
        <ol className="mt-6 space-y-3 text-[var(--st-muted)]">
          {service.process.map((step, i) => (
            <li key={step}>
              <span className="text-emerald-400">{String(i + 1).padStart(2, "0")}</span> {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 border-t border-[var(--st-line)] pt-10">
        <h2 className="studio-display text-3xl">Technology</h2>
        <p className="mt-4 text-[var(--st-muted)]">{service.tech.join(" · ")}</p>
      </section>

      <section className="mt-14 border-t border-[var(--st-line)] pt-10">
        <h2 className="studio-display text-3xl">FAQ</h2>
        <div className="mt-8 max-w-2xl space-y-8">
          {service.faq.map((f) => (
            <div key={f.q}>
              <h3 className="text-lg text-white">{f.q}</h3>
              <p className="mt-2 text-[var(--st-muted)]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 flex flex-wrap gap-4 text-sm">
        <Link href="/work" className="underline hover:text-white">
          Selected work
        </Link>
        <Link href="/case-studies" className="underline hover:text-white">
          Case studies
        </Link>
        <Link href="/contact" className="underline hover:text-white">
          Contact
        </Link>
        <Link href="/services" className="underline hover:text-white">
          All services
        </Link>
      </div>
    </main>
  );
}
