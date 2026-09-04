/**
 * Editorial tool comparisons — written for usefulness, not thin auto-pages.
 * Ratings and recommendations must match catalog facts; do not invent pricing.
 */

export type EditorialComparison = {
  slug: string;
  title: string;
  excerpt: string;
  toolIds: string[];
  bestOverall: string;
  bestForBeginners: string;
  bestForBusinesses: string;
  bestValue: string;
  recommendation: string;
  featureNotes: { feature: string; notes: string }[];
  alternatives: string[];
  lastReviewed: string;
};

export const EDITORIAL_COMPARISONS: EditorialComparison[] = [
  {
    slug: "chatgpt-vs-claude",
    title: "ChatGPT vs Claude",
    excerpt:
      "Two leading AI assistants compared for writing, coding help, research, and day-to-day work — grounded in our Tools catalog.",
    toolIds: ["chatgpt", "claude"],
    bestOverall: "ChatGPT — broader product surface and ecosystem for most general users.",
    bestForBeginners: "ChatGPT — simpler onboarding and wider everyday awareness.",
    bestForBusinesses: "Claude — strong for careful long-form analysis and document work when quality of reasoning matters.",
    bestValue: "Depends on plan usage; compare current free tiers and team seats before committing.",
    recommendation:
      "Start with the free tiers of both if you can. Prefer ChatGPT when you want plugins, browsing habits, and a wide skill set; prefer Claude when long documents and careful prose matter more than breadth.",
    featureNotes: [
      {
        feature: "Writing & editing",
        notes: "Both excel; Claude often preferred for long, structured drafts; ChatGPT for versatile short-form and brainstorming.",
      },
      {
        feature: "Coding assistance",
        notes: "Both help with snippets and explanations; pair either with a dedicated coding tool (Cursor / Copilot) for IDE work.",
      },
      {
        feature: "Ecosystem",
        notes: "ChatGPT generally offers more product integrations and consumer visibility.",
      },
    ],
    alternatives: ["gemini"],
    lastReviewed: "2026-09-01",
  },
  {
    slug: "cursor-vs-github-copilot",
    title: "Cursor vs GitHub Copilot",
    excerpt: "AI coding assistants compared for IDE workflow, autocomplete, and repo-aware edits.",
    toolIds: ["cursor", "github-copilot"],
    bestOverall: "Cursor — when you want an AI-native editor experience end to end.",
    bestForBeginners: "GitHub Copilot — drops into familiar VS Code / JetBrains workflows.",
    bestForBusinesses: "GitHub Copilot — fits existing GitHub Enterprise and org policy patterns for many teams.",
    bestValue: "Copilot often cheaper as an add-on; Cursor may justify cost if the full editor replaces your current setup.",
    recommendation:
      "Choose Copilot if your team already lives in VS Code/JetBrains and GitHub. Choose Cursor if you want chat, multi-file edits, and an AI-first editor as the primary workspace.",
    featureNotes: [
      {
        feature: "Editor experience",
        notes: "Cursor is a full IDE fork oriented around AI; Copilot augments your existing IDE.",
      },
      {
        feature: "Repo context",
        notes: "Both use project context; Cursor emphasizes agent-style multi-file changes in-editor.",
      },
      {
        feature: "Team rollout",
        notes: "Copilot aligns with GitHub org billing; Cursor needs a separate seat decision.",
      },
    ],
    alternatives: ["chatgpt"],
    lastReviewed: "2026-09-01",
  },
  {
    slug: "canva-vs-adobe-express",
    title: "Canva vs Adobe Express",
    excerpt: "Design tools for social creatives, marketers, and small teams who need fast visual output.",
    toolIds: ["canva", "adobe-express"],
    bestOverall: "Canva — template depth and ease for most non-designers.",
    bestForBeginners: "Canva — fastest path from blank canvas to publishable graphic.",
    bestForBusinesses: "Adobe Express — when the team already sits in Adobe Creative Cloud.",
    bestValue: "Canva Free / Pro usually wins for SMBs without Adobe seats.",
    recommendation:
      "Use Canva unless your brand already standardizes on Adobe. Express is the better bridge if Photoshop/Illustrator assets are the source of truth.",
    featureNotes: [
      {
        feature: "Templates",
        notes: "Canva’s library is the usual reason teams stay; Express focuses on speed inside Adobe’s world.",
      },
      {
        feature: "Brand kits",
        notes: "Both support brand consistency; pick based on where assets already live.",
      },
      {
        feature: "Print & social",
        notes: "Both cover common formats; verify export quality for your print vendors.",
      },
    ],
    alternatives: ["looka"],
    lastReviewed: "2026-09-01",
  },
  {
    slug: "zoho-invoice-vs-quickbooks",
    title: "Zoho Invoice vs QuickBooks",
    excerpt: "Invoicing and accounting paths for freelancers and growing businesses — facts only, no invented fees.",
    toolIds: ["zoho-invoice", "quickbooks"],
    bestOverall: "QuickBooks — when you need fuller accounting, not just invoices.",
    bestForBeginners: "Zoho Invoice — lighter start for freelancers who mainly need to bill clients.",
    bestForBusinesses: "QuickBooks — bookkeeping depth and accountant familiarity in many markets.",
    bestValue: "Zoho Invoice for invoice-first freelancers; QuickBooks when books + tax workflows dominate.",
    recommendation:
      "If you only need professional invoices and light tracking, start with Zoho Invoice (or Wave where available). Move to QuickBooks when your accountant, inventory, or multi-entity needs outgrow invoicing tools.",
    featureNotes: [
      {
        feature: "Scope",
        notes: "Zoho Invoice focuses on billing; QuickBooks is accounting-first with invoicing included.",
      },
      {
        feature: "Accountant handoff",
        notes: "QuickBooks is widely understood by bookkeepers; confirm local support for Zoho.",
      },
      {
        feature: "Ecosystem",
        notes: "Zoho links to other Zoho apps; QuickBooks links to a large third-party app market.",
      },
    ],
    alternatives: ["wave", "ebenezer-saas"],
    lastReviewed: "2026-09-01",
  },
  {
    slug: "notion-vs-asana",
    title: "Notion vs Asana",
    excerpt: "Docs-first workspace versus task-first project management for teams.",
    toolIds: ["notion", "asana"],
    bestOverall: "Depends on whether your bottleneck is documentation (Notion) or execution (Asana).",
    bestForBeginners: "Asana — clearer task lists and project templates for first-time PM users.",
    bestForBusinesses: "Asana — stronger native task ownership, timelines, and workload views for delivery teams.",
    bestValue: "Notion when one wiki replaces many docs; Asana when missed deadlines are the pain.",
    recommendation:
      "Pick Notion if the team needs a living knowledge base with light tasks. Pick Asana if shipping work on deadlines is the primary job. Many teams use both — Notion for docs, Asana for delivery.",
    featureNotes: [
      {
        feature: "Primary metaphor",
        notes: "Notion = flexible pages/databases; Asana = tasks, projects, portfolios.",
      },
      {
        feature: "Reporting",
        notes: "Asana typically clearer for status and workload; Notion needs more DIY views.",
      },
      {
        feature: "Flexibility",
        notes: "Notion wins for custom systems; Asana wins for out-of-the-box project ops.",
      },
    ],
    alternatives: ["hubspot"],
    lastReviewed: "2026-09-01",
  },
];

export function getEditorialComparison(slug: string): EditorialComparison | undefined {
  return EDITORIAL_COMPARISONS.find((c) => c.slug === slug);
}
