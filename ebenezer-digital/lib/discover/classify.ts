/**
 * Deterministic intent classification for Ebenezer ecosystem discovery.
 * AI may explain results — this layer must stay reproducible.
 */

import {
  JOURNAL_URL,
  PRODUCTS_URL,
  SITE_URL,
  STORE_URL,
  TOOLS_URL,
} from "@/lib/site-url";

export type DiscoverIntent =
  | "SERVICE"
  | "DIGITAL_PRODUCT"
  | "DIGITAL_TOOL"
  | "PHYSICAL_PRODUCT"
  | "EDUCATION"
  | "AI_ASSISTANCE"
  | "COMPARISON"
  | "BUYING_GUIDE"
  | "SUPPORT";

export type DestinationId =
  | "services"
  | "store"
  | "tools"
  | "products"
  | "info"
  | "ai";

export type DiscoverOption = {
  id: DestinationId;
  title: string;
  subtitle: string;
  platform: string;
  cta: string;
  href: string;
  accent: string;
  why: string;
};

export type DiscoverResult = {
  query: string;
  primaryIntent: DiscoverIntent;
  intents: DiscoverIntent[];
  budget?: number;
  useCases: string[];
  summary: string;
  followUps: string[];
  options: DiscoverOption[];
};

type Rule = {
  intent: DiscoverIntent;
  weight: number;
  patterns: RegExp[];
};

const RULES: Rule[] = [
  {
    intent: "SERVICE",
    weight: 3,
    patterns: [
      /\b(hire|build (me |us |my |our )?(a |an )?(website|app|software|system)|custom (website|software|app)|develop(ment)? for|someone to build|get a quote|agency)\b/i,
      /\b(web(site)? development|software development|business system)\b/i,
      /\b(i (need|want) (a |an )?(website|web site|online store|ecommerce|e-commerce) (for|to))\b/i,
      /\b(make|create) (me |us )?(a |an )?(website|app|online store)\b/i,
    ],
  },
  {
    intent: "PHYSICAL_PRODUCT",
    weight: 3.2,
    patterns: [
      /\b(laptop|notebook|desktop|pc|ram|ssd|gpu|graphics card|monitor|keyboard|mouse|headphone|smartphone|phone|tablet|router|webcam|microphone|electronics)\b/i,
      /\b(under\s*₹|under\s*rs|budget.*(laptop|pc|phone)|buy a laptop|need a laptop)\b/i,
    ],
  },
  {
    intent: "DIGITAL_PRODUCT",
    weight: 2.8,
    patterns: [
      /\b(templates?|ui kits?|figma|canva|bundles?|ready[- ]made|buy (a |an )?(website|template|kit)|digital products?|invoice kit|caption pack)\b/i,
      /\b(react templates?|next\.?js templates?|landing (page )?kits?)\b/i,
      /\b(show me|browse).*(template|kit|store product)/i,
    ],
  },
  {
    intent: "DIGITAL_TOOL",
    weight: 2.6,
    patterns: [
      /\b(saas|ai tool|chatgpt|writing tool|design tool|hosting|notion|canva pro|mailchimp|razorpay|stripe|billing software|invoice software)\b/i,
      /\b(which (ai|tool|software)|best (ai|saas|tool) for)\b/i,
    ],
  },
  {
    intent: "COMPARISON",
    weight: 2.4,
    patterns: [/\b(compare|vs\.?|versus|which is better|difference between|best .* for)\b/i],
  },
  {
    intent: "BUYING_GUIDE",
    weight: 2.2,
    patterns: [/\b(buying guide|what should i buy|recommend( a| me)?|help me choose|which .* should i)\b/i],
  },
  {
    intent: "EDUCATION",
    weight: 2.5,
    patterns: [
      /\b(learn|tutorial|how (do|to)|guide|course|teach me|study|next\.?js|laravel|react)\b/i,
    ],
  },
  {
    intent: "AI_ASSISTANCE",
    weight: 2,
    patterns: [/\b(ask ai|eben ai|help me|assist|chat with|ai assistant)\b/i],
  },
  {
    intent: "SUPPORT",
    weight: 1.8,
    patterns: [/\b(support|help desk|contact|problem with|not working|refund)\b/i],
  },
];

function extractBudget(q: string): number | undefined {
  const m =
    q.match(/(?:₹|rs\.?\s*|inr\s*)\s*([\d,]+)/i) ||
    q.match(/under\s+([\d,]+)/i) ||
    q.match(/below\s+([\d,]+)/i) ||
    q.match(/budget\s+(?:of\s+)?([\d,]+)/i);
  if (!m) return undefined;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function extractUseCases(q: string): string[] {
  const out: string[] = [];
  if (/cod|program|develop|web\s*dev/i.test(q)) out.push("programming");
  if (/game|gaming/i.test(q)) out.push("gaming");
  if (/design|photoshop|figma/i.test(q)) out.push("design");
  if (/restaurant|shop|store|ecommerce|e-commerce|business/i.test(q)) out.push("business");
  if (/social media|instagram|caption/i.test(q)) out.push("social");
  if (/invoice|billing|gst/i.test(q)) out.push("billing");
  return out;
}

const DEST: Record<DestinationId, Omit<DiscoverOption, "why">> = {
  services: {
    id: "services",
    title: "Build it for me",
    subtitle: "Professional custom development",
    platform: "Ebenezer Digital",
    cta: "Get a Quote",
    href: `${SITE_URL}/contact`,
    accent: "#10b981",
  },
  store: {
    id: "store",
    title: "Buy ready-made",
    subtitle: "Templates, kits, software & bundles",
    platform: "Ebenezer Store",
    cta: "Browse Products",
    href: STORE_URL,
    accent: "#059669",
  },
  tools: {
    id: "tools",
    title: "Compare tools",
    subtitle: "AI, SaaS & software comparisons",
    platform: "Ebenezer Tools",
    cta: "Compare",
    href: TOOLS_URL,
    accent: "#0d9488",
  },
  products: {
    id: "products",
    title: "Find a physical product",
    subtitle: "Laptops, PCs, RAM, SSD & electronics",
    platform: "Ebenezer Products",
    cta: "Compare Products",
    href: PRODUCTS_URL,
    accent: "#0f766e",
  },
  info: {
    id: "info",
    title: "Learn",
    subtitle: "Guides, tutorials & research",
    platform: "Ebenezer Info",
    cta: "Explore Guides",
    href: JOURNAL_URL,
    accent: "#64748b",
  },
  ai: {
    id: "ai",
    title: "Ask AI",
    subtitle: "Personalized assistance",
    platform: "Ebenezer AI",
    cta: "Ask Ebenezer",
    href: `${SITE_URL}/ai`,
    accent: "#34d399",
  },
};

function option(id: DestinationId, why: string, hrefOverride?: string): DiscoverOption {
  return { ...DEST[id], why, href: hrefOverride || DEST[id].href };
}

function rankIntents(q: string): DiscoverIntent[] {
  const scores = new Map<DiscoverIntent, number>();
  for (const rule of RULES) {
    for (const p of rule.patterns) {
      if (p.test(q)) {
        scores.set(rule.intent, (scores.get(rule.intent) || 0) + rule.weight);
      }
    }
  }
  if (scores.size === 0) {
    return ["AI_ASSISTANCE", "SERVICE", "EDUCATION"];
  }
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([i]) => i);
}

function buildOptions(
  intents: DiscoverIntent[],
  query: string,
  budget?: number,
  useCases: string[] = []
): DiscoverOption[] {
  const primary = intents[0];
  const opts: DiscoverOption[] = [];
  const push = (o: DiscoverOption) => {
    if (!opts.find((x) => x.id === o.id)) opts.push(o);
  };

  const physicalHref =
    budget != null
      ? `${PRODUCTS_URL}/catalog/recommend?q=${encodeURIComponent(query)}`
      : `${PRODUCTS_URL}/catalog`;

  const toolHref = `${TOOLS_URL}`;
  const storeHref = STORE_URL;
  const learnHref = JOURNAL_URL;
  const aiHref = `${SITE_URL}/ai?prompt=${encodeURIComponent(query)}`;

  // Always keep AI as a soft option later
  switch (primary) {
    case "PHYSICAL_PRODUCT":
    case "BUYING_GUIDE":
      push(
        option(
          "products",
          budget
            ? `Matched physical shopping intent with budget around ₹${budget.toLocaleString("en-IN")}.`
            : "You asked about hardware or electronics — Products is the right place.",
          physicalHref
        )
      );
      push(option("info", "Read buying guides and research before you spend.", `${JOURNAL_URL}/blog`));
      push(option("ai", "Ask follow-up questions about budget, brand, and use case.", aiHref));
      break;
    case "DIGITAL_TOOL":
    case "COMPARISON":
      push(option("tools", "Compare AI/SaaS tools with pros, cons, and pricing notes.", toolHref));
      push(option("store", "Buy Ebenezer’s own digital kits or software products.", storeHref));
      push(option("info", "Read deeper comparisons and educational write-ups.", learnHref));
      push(option("ai", "Get a plain-language recommendation.", aiHref));
      break;
    case "DIGITAL_PRODUCT":
      push(option("store", "Ready-made templates, kits, and digital products.", storeHref));
      push(option("services", "Need something custom? We can build it for you.", `${SITE_URL}/contact`));
      push(option("tools", "Compare related software tools if you are still deciding.", toolHref));
      push(option("ai", "Describe your exact need and get a guided pick.", aiHref));
      break;
    case "SERVICE":
      push(option("services", "Custom websites, software, and AI systems built for you.", `${SITE_URL}/contact`));
      push(option("store", "Faster/cheaper path: buy a ready-made template or kit.", storeHref));
      push(option("tools", "Compare platforms if you want to build with tools yourself.", toolHref));
      push(option("info", "Learn the process before you hire.", learnHref));
      push(option("ai", "Clarify scope, budget, and next steps with AI.", aiHref));
      break;
    case "EDUCATION":
      push(option("info", "Tutorials, guides, and educational content.", learnHref));
      push(option("ai", "Ask Eben AI to explain topics simply.", aiHref));
      push(option("store", "Practice with templates and kits while you learn.", storeHref));
      push(option("services", "Or hire us if you need a finished project.", `${SITE_URL}/contact`));
      break;
    case "SUPPORT":
      push(option("services", "Contact the team for project or business support.", `${SITE_URL}/contact`));
      push(option("ai", "Quick answers through Ebenezer AI.", aiHref));
      push(option("info", "Check guides that may already answer your question.", learnHref));
      break;
    default:
      push(option("ai", "Start with AI when the need is unclear.", aiHref));
      push(option("services", "Custom work if you want us to build it.", `${SITE_URL}/contact`));
      push(option("store", "Browse ready-made digital products.", storeHref));
      push(option("products", "Browse physical product comparisons.", physicalHref));
      push(option("tools", "Compare digital tools.", toolHref));
      push(option("info", "Explore guides and learning content.", learnHref));
  }

  // Enrich website-specific multi-path (spec examples)
  if (/\bwebsite|ecommerce|e-commerce|online store|landing page\b/i.test(query) && primary !== "PHYSICAL_PRODUCT") {
    push(option("services", "We can build a custom website for your business.", `${SITE_URL}/contact`));
    push(option("store", "Buy a ready-made website / landing kit.", storeHref));
    push(option("tools", "Compare website builders and related tools.", toolHref));
    push(option("info", "Learn how websites and ecommerce work.", learnHref));
  }

  if (useCases.includes("billing") || /invoice|billing/i.test(query)) {
    push(option("tools", "Compare billing / invoicing software.", `${TOOLS_URL}`));
    push(option("store", "Check invoice templates and business kits.", storeHref));
    push(option("services", "Need a full billing system built?", `${SITE_URL}/saas`));
  }

  // Cap to 5 cards for clarity
  return opts.slice(0, 5);
}

function summaryFor(primary: DiscoverIntent, query: string, budget?: number): string {
  switch (primary) {
    case "PHYSICAL_PRODUCT":
      return budget
        ? `This looks like a physical product search around ₹${budget.toLocaleString("en-IN")}.`
        : "This looks like a physical product / electronics need.";
    case "DIGITAL_TOOL":
    case "COMPARISON":
      return "This looks like a digital tool comparison or software choice.";
    case "DIGITAL_PRODUCT":
      return "This looks like you want a ready-made digital product.";
    case "SERVICE":
      return "This looks like a custom service — someone to build it for you.";
    case "EDUCATION":
      return "This looks like a learning / guide request.";
    case "BUYING_GUIDE":
      return "This looks like you want help choosing before you buy.";
    case "SUPPORT":
      return "This looks like support or contact help.";
    default:
      return `We matched a few Ebenezer platforms for: “${query.slice(0, 80)}”.`;
  }
}

function followUpsFor(primary: DiscoverIntent, useCases: string[]): string[] {
  if (primary === "PHYSICAL_PRODUCT" || primary === "BUYING_GUIDE") {
    return [
      "What is your max budget?",
      "Main use: coding, gaming, design, or office?",
      "Any brand preference?",
      "Do you need strong battery / portability?",
    ];
  }
  if (primary === "SERVICE") {
    return ["What kind of business is this for?", "Do you need it in weeks or months?", "Approximate budget?"];
  }
  if (primary === "DIGITAL_TOOL" || primary === "COMPARISON") {
    return ["Free plan required?", "Solo use or team?", "Any must-have feature?"];
  }
  if (useCases.includes("business")) {
    return ["Do you want us to build it, or buy a template?"];
  }
  return ["Want a custom build, a ready-made product, or a comparison?"];
}

export function classifyDiscoverQuery(raw: string): DiscoverResult {
  const query = raw.trim().replace(/\s+/g, " ");
  const intents = rankIntents(query);
  const primaryIntent = intents[0] || "AI_ASSISTANCE";
  const budget = extractBudget(query);
  const useCases = extractUseCases(query);
  const options = buildOptions(intents, query, budget, useCases);

  return {
    query,
    primaryIntent,
    intents,
    budget,
    useCases,
    summary: summaryFor(primaryIntent, query, budget),
    followUps: followUpsFor(primaryIntent, useCases),
    options,
  };
}

export const DISCOVER_SUGGESTIONS = [
  "I need a website for my business",
  "Find me a laptop under ₹60,000",
  "Compare AI writing tools",
  "I need an invoice system",
  "Show me website templates",
  "Help me build an online store",
  "I need social media templates",
  "I want to learn Next.js",
];
