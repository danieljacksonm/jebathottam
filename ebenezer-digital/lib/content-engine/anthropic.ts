import type { ContentTopic, GeneratedArticle } from "./types";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

function wordTargetForSurface(surface: ContentTopic["surface"]): number {
  if (surface === "journal") return 2000;
  if (surface === "studio-insights") return 1500;
  return 1000;
}

function buildPrompt(topic: ContentTopic): string {
  const words = topic.wordTarget || wordTargetForSurface(topic.surface);
  return `Write a professional blog article for an adult, informed reader.

Topic: ${topic.title}
Category: ${topic.category}
Surface: ${topic.surface}
Keywords: ${topic.keywords.join(", ")}

Requirements:
- Tone: clear, substantive, non-generic — no hype or filler.
- Structure: intro, 3–5 sections with ## subheadings, conclusion.
- Target length: roughly ${words} words (do not pad with repetition).
- Do NOT invent statistics, studies, quotes, or sources.
- Do NOT claim GDPR/CCPA compliance mechanisms unless explicitly known.
- End with one short paragraph mentioning Ebenezer Tools, Store, or Network only if relevant.

Return ONLY valid JSON (no markdown fence) with keys:
title, excerpt (1–2 sentences, max 160 chars), body (markdown with ## headings), category`;
}

function parseModelJson(text: string): { title: string; excerpt: string; body: string; category: string } {
  const trimmed = text.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Model response did not contain JSON");
  }
  return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as {
    title: string;
    excerpt: string;
    body: string;
    category: string;
  };
}

/** Fetch a relevant Unsplash image (free for commercial use per Unsplash license). */
export async function fetchUnsplashCover(query: string): Promise<{ url: string; credit: string } | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${key}` } }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    results?: Array<{ urls?: { regular?: string }; user?: { name?: string } }>;
  };
  const hit = data.results?.[0];
  if (!hit?.urls?.regular) return null;
  return {
    url: hit.urls.regular,
    credit: hit.user?.name ? `Photo: ${hit.user.name} / Unsplash` : "Unsplash",
  };
}

/** Generate a draft article via Anthropic API. Requires ANTHROPIC_API_KEY. Never auto-publishes. */
export async function generateFromTopicWithAnthropic(topic: ContentTopic): Promise<GeneratedArticle> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set — use template generator or add the key to .env");
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: buildPrompt(topic) }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${err.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((c) => c.type === "text")?.text;
  if (!text) throw new Error("Empty Anthropic response");

  const parsed = parseModelJson(text);
  const body = parsed.body.trim();
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const imageQuery = topic.keywords[0] || topic.category;
  const cover = await fetchUnsplashCover(imageQuery);

  return {
    id: topic.id,
    surface: topic.surface,
    slug: topic.slug,
    title: parsed.title.trim() || topic.title,
    excerpt: parsed.excerpt.trim(),
    body,
    category: parsed.category.trim() || topic.category,
    tier: topic.tier,
    wordCount,
    coverImage: cover?.url,
    imageCredit: cover?.credit,
    publishedAt: new Date().toISOString(),
    indexable: false,
    qualityScore: topic.tier === "pillar" ? 80 : 75,
    status: "draft",
  };
}
