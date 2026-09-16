import type { Product, RecommendationIntent } from "@/types";
import { matchProducts } from "./catalog";

const INTENT_MAP: Record<RecommendationIntent, string[]> = {
  racing: ["racing", "carbon", "chrome red", "motorsport", "holographic"],
  jdm: ["jdm", "holographic", "carbon", "rainbow"],
  funny: ["custom", "sticker"],
  minimal: ["white", "minimal", "solid", "nardo", "clean"],
  motivational: ["custom"],
  "car-brand": ["chrome", "metallic", "nardo", "gloss"],
  motorsport: ["carbon", "racing", "motorsport", "chrome red", "metallic"],
  custom: ["custom"],
  chrome: ["chrome", "mirror", "gold", "silver", "red"],
  matte: ["matte", "iridescent"],
  carbon: ["carbon", "holographic"],
  other: [],
};

export type RecommendationResult = {
  source: "local" | "ai";
  intent: RecommendationIntent;
  message: string;
  products: Product[];
};

export function recommendFromIntent(
  intent: RecommendationIntent,
  query: string | undefined,
  catalog: Product[],
): RecommendationResult {
  if (intent === "custom") {
    return {
      source: "local",
      intent,
      message:
        "For custom text stickers, use our custom builder. Meanwhile, here are versatile base finishes that pair well with custom accents.",
      products: matchProducts(catalog, "gloss white metallic blue").slice(0, 4),
    };
  }

  if (intent === "funny" || intent === "motivational") {
    return {
      source: "local",
      intent,
      message:
        "We specialize in premium wraps. For funny or motivational text, create a custom sticker — and pair it with a clean wrap base.",
      products: matchProducts(catalog, "gloss white").slice(0, 3),
    };
  }

  const terms = INTENT_MAP[intent] || [];
  const scored = catalog
    .map((product) => {
      const text = [
        product.name,
        product.shortDescription,
        ...product.tags,
        ...product.keywords,
        product.finishLabel,
        product.color,
      ]
        .join(" ")
        .toLowerCase();
      const score = terms.reduce((acc, term) => (text.includes(term) ? acc + 1 : acc), 0);
      return { product, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.product);

  let products = scored;
  if (query?.trim()) {
    const q = matchProducts(catalog, query);
    const ids = new Set(q.map((p) => p.id));
    products = [...q, ...scored.filter((p) => !ids.has(p.id))];
  }

  if (products.length === 0) {
    products = catalog.filter((p) => p.featured).slice(0, 4);
  }

  return {
    source: "local",
    intent,
    message: `Based on your interest in ${intent.replace("-", " ")} style, here are matching wraps from our catalogue.`,
    products: products.slice(0, 6),
  };
}

/**
 * AI-ready recommendation entrypoint.
 * Uses OpenAI-compatible API when AI_API_KEY is configured; otherwise local metadata matching.
 */
export async function getRecommendations(input: {
  intent: RecommendationIntent;
  query?: string;
}): Promise<RecommendationResult> {
  const { getAllProducts } = await import("./products");
  const live = await getAllProducts();
  const local = recommendFromIntent(input.intent, input.query, live);
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return local;
  }

  try {
    const catalog = live.map((p) => ({
      slug: p.slug,
      name: p.name,
      tags: p.tags,
      category: p.category,
      finish: p.finishLabel,
      color: p.color,
      shortDescription: p.shortDescription,
    }));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You recommend products from the provided catalogue only. Return JSON: { message: string, slugs: string[] }. Never invent products.",
          },
          {
            role: "user",
            content: JSON.stringify({
              intent: input.intent,
              query: input.query || "",
              catalogue: catalog,
            }),
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return local;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return local;

    const parsed = JSON.parse(content) as { message?: string; slugs?: string[] };
    const products = (parsed.slugs || [])
      .map((slug) => live.find((p) => p.slug === slug))
      .filter(Boolean) as Product[];

    if (products.length === 0) return local;

    return {
      source: "ai",
      intent: input.intent,
      message: parsed.message || local.message,
      products,
    };
  } catch {
    return local;
  }
}
