/** Shared AI / Ollama helpers for Ebenezer products */

export const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:11434";

export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";

/** Public-facing model brand name shown to users */
export const MODEL_BRAND = "Nzer 1.0";

export type AiMode = "general" | "news" | "product" | "billing" | "blog" | "catalog" | "tools";

export const AI_BRAND = "Eben AI";

const ANSWER_STYLE = `
Your name is Eben AI (short for Ebenezer AI). Never call yourself Nzer AI.
Write in simple, clear English so a Class 8 student can understand.
In the FIRST reply, always include a real example. Do not wait to be asked.
Give a COMPLETE answer, not a one-line reply.
Use this shape almost always:
1) Direct answer (2–4 sentences)
2) Clear steps or sections
3) A concrete example (India daily life is welcome) — required in the first reply
4) A short "In short" summary
Aim for 180–320 words unless the user asks for shorter or longer.
Use bullets when listing. Do not invent facts, prices, or news not in context.

Example of your style:
User: What is Wi-Fi?
Eben AI: Wi-Fi is a wireless way for your phone or laptop to use the internet.
Think of it like an invisible pipe from the router to your device.
Example: In a tea shop, the owner’s phone uses the same Wi-Fi as the billing tablet.
In short: Wi-Fi = internet without a cable.`;

export const AI_SYSTEM_PROMPT =
  process.env.AI_SYSTEM_PROMPT ||
  `You are ${AI_BRAND}, the assistant for Ebenezer Digital Services.
Help with writing, ideas, web/digital work, learning, and general questions.
${ANSWER_STYLE}`;

const MODE_PROMPTS: Record<AiMode, string> = {
  general: AI_SYSTEM_PROMPT,
  news: `You are ${AI_BRAND} on Ebenezer World News.
Use ONLY the headlines/context given. Help the reader understand what happened, why it matters, and what to watch next.
${ANSWER_STYLE}
If context is missing, say so and suggest opening /blog/news.`,
  blog: `You are ${AI_BRAND} on Ebenezer Journal.
Explain the lesson or article in even simpler words. Add extra examples and define hard words.
${ANSWER_STYLE}`,
  product: `You are ${AI_BRAND} on Ebenezer Store.
Help the buyer choose using ONLY the product catalog context.
Explain who it is for, what they get, and how it compares.
Currency is USD. The store ships digital products worldwide. Do not invent prices.
${ANSWER_STYLE}`,
  billing: `You are ${AI_BRAND} billing helper.
Explain checkout, licenses, downloads, and receipts in simple English.
If live payment is not connected yet, say so clearly.
Never invent payment confirmations, order IDs, or refunds.
${ANSWER_STYLE}`,
  catalog: `You are ${AI_BRAND} on Ebenezer Products (physical hardware comparison).
Help the user choose using ONLY the structured catalog / recommendation context provided.
Never invent prices, specifications, availability, ratings, warranties, seller names, discounts, or product URLs.
If a field is missing, say exactly: "Information unavailable."
Explain pros, cons, who should buy, and who should avoid — grounded in the given data.
Do not claim live marketplace prices unless the context includes a last-checked timestamp.
${ANSWER_STYLE}`,
  tools: `You are ${AI_BRAND} on Ebenezer Tools (AI / SaaS / software discovery).
Help the user choose using ONLY the tools catalog context provided.
Never invent tools, prices, features, limits, or affiliate claims.
If a price says "Check official site", tell the user to verify on the vendor site.
Always link recommendations to /tools/{id} pages from the context.
Ask clarifying questions when budget, use case, or category is unclear.
${ANSWER_STYLE}`,
};

export function resolveAiMode(value: unknown): AiMode {
  if (
    value === "news" ||
    value === "product" ||
    value === "billing" ||
    value === "general" ||
    value === "blog" ||
    value === "catalog" ||
    value === "tools"
  ) {
    return value;
  }
  return "general";
}

function nowInIndia(): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date());
  } catch {
    return new Date().toISOString();
  }
}

export function buildSystemPrompt(mode: AiMode, context?: string): string {
  const base = MODE_PROMPTS[mode] || MODE_PROMPTS.general;
  const today = nowInIndia();
  const withDate = `${base}

Today's real date and time is ${today} (India Standard Time).
When asked the date, day, or time, use this value. Never write placeholders like [insert current date].`;
  const trimmed = (context || "").trim().slice(0, 6000);
  if (!trimmed) return withDate;
  return `${withDate}

--- CONTEXT (use this; do not invent beyond it) ---
${trimmed}
--- END CONTEXT ---`;
}

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function checkOllamaHealth(): Promise<{
  ok: boolean;
  model: string;
  models: string[];
  error?: string;
}> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return {
        ok: false,
        model: OLLAMA_MODEL,
        models: [],
        error: `Ollama returned ${res.status}`,
      };
    }
    const data = (await res.json()) as {
      models?: { name: string }[];
    };
    const models = (data.models || []).map((m) => m.name);
    const hasModel = models.some(
      (name) =>
        name === OLLAMA_MODEL ||
        name.startsWith(`${OLLAMA_MODEL}:`) ||
        name.startsWith(OLLAMA_MODEL.split(":")[0])
    );
    return {
      ok: hasModel || models.length > 0,
      model: OLLAMA_MODEL,
      models,
      error: hasModel
        ? undefined
        : models.length === 0
          ? "No models installed. Run: ollama pull qwen2.5:1.5b"
          : `Nzer 1.0 (${OLLAMA_MODEL}) not found. Installed: ${models.join(", ")}`,
    };
  } catch (err) {
    return {
      ok: false,
      model: OLLAMA_MODEL,
      models: [],
      error:
        err instanceof Error
          ? err.message
          : "Cannot reach Ollama. Is it running on the server?",
    };
  }
}

function trustedEcosystemHosts(): string[] {
  return [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_AI_URL,
    process.env.NEXT_PUBLIC_SAAS_URL,
    process.env.NEXT_PUBLIC_STORE_URL,
    process.env.NEXT_PUBLIC_TOOLS_URL,
    process.env.NEXT_PUBLIC_NEWS_URL,
    process.env.NEXT_PUBLIC_JOURNAL_URL,
    process.env.NEXT_PUBLIC_INFO_URL,
    process.env.NEXT_PUBLIC_PRODUCTS_URL,
    process.env.NEXT_PUBLIC_DISCOVER_URL,
    process.env.NEXT_PUBLIC_NETWORK_URL,
    "https://ebenezerdigital.com",
    "https://ai.ebenezerdigital.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]
    .filter(Boolean)
    .map((u) => {
      try {
        return new URL(u as string).origin;
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

function isFirstPartyBrowserCall(request: Request): boolean {
  const hosts = trustedEcosystemHosts();
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (hosts.includes(new URL(origin).origin)) return true;
    } catch {
      /* ignore */
    }
  }
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      if (hosts.includes(new URL(referer).origin)) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}

/**
 * Protect AI routes from anonymous cross-origin abuse.
 * - Shared `AI_API_KEY` always accepted (server-to-server).
 * - First-party browser UI (same ecosystem Origin/Referer) allowed without exposing the key.
 * - Everything else denied (fail closed), including production when the key is unset.
 */
export function validateInternalApiKey(request: Request): boolean {
  const required = process.env.AI_API_KEY?.trim();
  const header = request.headers.get("x-ai-api-key");
  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (required && (header === required || bearer === required)) return true;
  if (isFirstPartyBrowserCall(request)) return true;
  if (!required && process.env.NODE_ENV !== "production") return true;
  return false;
}

/** Compact catalog text for product AI (keep small for CPU model). */
export function formatProductsForAi(
  products: {
    name: string;
    slug: string;
    category: string;
    price: number;
    tagline: string;
    isFree?: boolean;
  }[]
): string {
  return products
    .slice(0, 20)
    .map(
      (p) =>
        `- ${p.name} (/${p.slug}) | ${p.category} | ${p.isFree ? "FREE" : `$${p.price}`} | ${p.tagline}`
    )
    .join("\n");
}
