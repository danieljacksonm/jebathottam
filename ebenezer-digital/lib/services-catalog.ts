export type ServiceLanding = {
  slug: string;
  title: string;
  forWho: string;
  value: string;
  capabilities: string[];
  process: string[];
  tech: string[];
  faq: { q: string; a: string }[];
  relatedInsights?: string[];
  relatedJournal?: string[];
};

export const SERVICE_LANDINGS: ServiceLanding[] = [
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
    relatedInsights: ["business-automation-without-breaking-workflows-23"],
  },
  {
    slug: "website-design",
    title: "Website design",
    forWho: "Brands that need a premium visual identity and conversion-focused layouts.",
    value: "Editorial-quality design systems, responsive layouts, and accessible UI that matches your market.",
    capabilities: ["Brand-aligned UI", "Mobile-first layouts", "Design systems", "Landing page optimization"],
    process: ["Brand audit", "Wireframes", "Visual design", "Dev handoff"],
    tech: ["Figma", "Next.js", "Tailwind"],
    faq: [{ q: "Do you redesign existing sites?", a: "Yes — we audit what works and rebuild what blocks growth." }],
  },
  {
    slug: "ecommerce-development",
    title: "Ecommerce development",
    forWho: "Shops moving from WhatsApp orders to structured online sales.",
    value: "Catalog, checkout, inventory hooks, and SEO-ready product pages.",
    capabilities: ["Product catalogs", "Checkout flows", "Payment integration", "Order notifications"],
    process: ["Catalog planning", "Store build", "Payment & testing", "Launch support"],
    tech: ["Next.js", "Stripe/Razorpay", "Headless CMS"],
    faq: [{ q: "Can you connect to existing inventory?", a: "Yes — scope depends on your current tools and APIs." }],
  },
  {
    slug: "saas-development",
    title: "SaaS development",
    forWho: "Founders building billing, inventory, or multi-tenant tools.",
    value: "Practical SaaS foundations — auth, multi-tenant data, invoicing flows, and admin tools.",
    capabilities: [
      "Multi-tenant application structure",
      "Billing and invoice workflows",
      "Role-based admin panels",
      "API design for web and mobile clients",
    ],
    process: ["Product framing", "Architecture", "MVP build", "Iterate with real users"],
    tech: ["Next.js", "NestJS", "Prisma", "MySQL / SQLite"],
    faq: [
      {
        q: "Do you build Ebenezer SaaS for clients?",
        a: "Ebenezer SaaS is our product. Custom SaaS work is scoped separately for your business.",
      },
    ],
    relatedJournal: ["what-is-saas"],
  },
  {
    slug: "laravel-development",
    title: "Laravel development",
    forWho: "Teams needing robust PHP backends, admin panels, or API services.",
    value: "Secure Laravel applications with clear models, queues, and deployment paths.",
    capabilities: ["REST APIs", "Admin dashboards", "MySQL integrations", "Background jobs"],
    process: ["Requirements", "Schema design", "Build & test", "Deploy"],
    tech: ["Laravel", "PHP", "MySQL", "Redis"],
    faq: [{ q: "Do you migrate legacy PHP?", a: "Yes — after reviewing security and data integrity." }],
  },
  {
    slug: "nextjs-development",
    title: "Next.js development",
    forWho: "Products that need SEO, speed, and a modern React stack.",
    value: "App Router sites with server components, structured data, and multilingual-ready routing.",
    capabilities: ["SSR/SSG pages", "API routes", "Multilingual URLs", "Performance tuning"],
    process: ["Architecture", "Implementation", "SEO pass", "Launch"],
    tech: ["Next.js 14", "React", "TypeScript"],
    faq: [{ q: "Can you host on our VPS?", a: "Yes — we support PM2, nginx, and standard Node deployments." }],
  },
  {
    slug: "ai-solutions",
    title: "AI solutions",
    forWho: "Teams that want AI assistants grounded in their own data — not hype demos.",
    value: "Practical AI: chat, summarization, and workflows with clear limits and human review.",
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
        a: "Usually we compose existing models with your content and rules. Custom training is scoped explicitly.",
      },
    ],
  },
  {
    slug: "seo-services",
    title: "SEO services",
    forWho: "Sites that need technical SEO, sitemaps, and crawl health — not keyword stuffing.",
    value: "Canonical URLs, structured data, sitemap architecture, Core Web Vitals, and Search Console setup.",
    capabilities: ["Technical SEO audits", "Sitemap & hreflang", "Structured data", "Performance fixes"],
    process: ["Crawl audit", "Fix blockers", "Content clusters", "Monitor GSC"],
    tech: ["Next.js metadata", "Schema.org", "GSC"],
    faq: [{ q: "Do you guarantee rankings?", a: "No. We fix technical barriers and improve discoverability honestly." }],
  },
  {
    slug: "business-automation",
    title: "Business automation",
    forWho: "Shops and offices drowning in repetitive WhatsApp, spreadsheet, or form work.",
    value: "Replace fragile manual steps with simple systems — forms, notifications, and dashboards.",
    capabilities: [
      "Lead capture and follow-up flows",
      "Document and PDF packs",
      "Ops dashboards",
      "Integrations between existing tools",
    ],
    process: ["Map the current process", "Remove waste", "Automate the bottleneck", "Train the team"],
    tech: ["Web apps", "APIs", "Store kits", "WhatsApp workflows"],
    faq: [{ q: "Will you force a full rewrite?", a: "No. We prefer the smallest system that removes the pain." }],
  },
  {
    slug: "travel-booking",
    title: "Travel booking support",
    forWho: "Travel desks needing reliable booking operations and web presence.",
    value: "Booking workflows, enquiry kits, and customer-facing travel sites.",
    capabilities: ["Enquiry and quotation flows", "Travel agency websites", "Operational templates", "Digital support"],
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
    forWho: "Teams needing careful, confidential digitization and admin support.",
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
  {
    slug: "website-maintenance",
    title: "Website maintenance",
    forWho: "Businesses with live sites that need updates, security patches, and uptime monitoring.",
    value: "Ongoing care: dependency updates, backups, content changes, and performance checks.",
    capabilities: ["Security updates", "Content updates", "Uptime monitoring", "Backup verification"],
    process: ["Baseline audit", "Maintenance plan", "Monthly checks", "Incident response"],
    tech: ["Next.js", "WordPress", "Laravel", "VPS/PM2"],
    faq: [{ q: "Do you support sites you did not build?", a: "Yes — after a technical onboarding review." }],
  },
];

export function getServiceLanding(slug: string): ServiceLanding | undefined {
  return SERVICE_LANDINGS.find((s) => s.slug === slug);
}
