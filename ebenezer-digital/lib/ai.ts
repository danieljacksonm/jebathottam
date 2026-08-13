/** Shared AI / Ollama helpers for Ebenezer products */

export const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:11434";

export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:1.5b";

export type AiMode = "general" | "news" | "product" | "billing";

export const AI_SYSTEM_PROMPT =
  process.env.AI_SYSTEM_PROMPT ||
  `You are Ebenezer AI, the assistant for Ebenezer Digital Services.
Be clear, friendly, and practical. Prefer short answers unless the user asks for depth.
Help with writing, ideas, web/digital work, and general questions.
If you are unsure, say so. Do not invent company policies or prices.`;

const MODE_PROMPTS: Record<AiMode, string> = {
  general: AI_SYSTEM_PROMPT,
  news: `You are Ebenezer News AI for viewers of Ebenezer World News.
Use ONLY the news headlines/context given to you. Summarize clearly in simple English.
Help people understand world news from many regions (India, Asia, Europe, Americas, Africa, tech, climate).
Keep answers short (5–10 lines unless asked for more). Do not invent facts not in the context.
If context is missing, say you need more headlines and suggest opening /blog/news.`,
  product: `You are Ebenezer Store AI.
Help buyers choose digital products using ONLY the product catalog context given.
Explain features simply, compare options briefly, and suggest the best fit.
Do not invent prices or licenses not in the context. Currency is INR when shown.
Keep answers short and practical.`,
  billing: `You are Ebenezer Billing Helper.
Explain checkout, downloads, licenses, receipts, and payment status in simple English.
If live payment is not connected yet, say so clearly and tell the user what will happen after billing is enabled.
Never invent payment confirmations, order IDs, or refunds.`,
};

export function resolveAiMode(value: unknown): AiMode {
  if (value === "news" || value === "product" || value === "billing" || value === "general") {
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
          : `Model ${OLLAMA_MODEL} not found. Installed: ${models.join(", ")}`,
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

export function validateInternalApiKey(request: Request): boolean {
  const required = process.env.AI_API_KEY;
  if (!required) return true;
  const header = request.headers.get("x-ai-api-key");
  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  return header === required || bearer === required;
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
        `- ${p.name} (/${p.slug}) | ${p.category} | ${p.isFree ? "FREE" : `₹${p.price}`} | ${p.tagline}`
    )
    .join("\n");
}
