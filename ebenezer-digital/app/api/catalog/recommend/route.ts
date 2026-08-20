import { NextRequest, NextResponse } from "next/server";
import { parseNaturalQuery, recommend } from "@/lib/catalog/scoring";
import { trackEvent } from "@/lib/catalog/repository";
import { formatINR } from "@/lib/catalog/query";
import {
  buildSystemPrompt,
  OLLAMA_BASE_URL,
  OLLAMA_MODEL,
  type ChatMessage,
} from "@/lib/ai";
import type { RecommendationRequest } from "@/app/catalog/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

function buildAiContext(req: RecommendationRequest) {
  const result = recommend(req);
  const lines: string[] = [
    "CATALOG RECOMMENDATION DATA (authoritative — do not invent outside this):",
    `Query: ${req.query || "(structured)"}`,
    req.budget != null ? `Budget: ${formatINR(req.budget)}` : "Budget: Information unavailable",
    `Category: ${req.categoryId || "Information unavailable"}`,
    `Use cases: ${req.useCases?.join(", ") || "general"}`,
    "",
  ];
  for (const [bucket, item] of Object.entries(result.buckets)) {
    if (!item) continue;
    lines.push(
      `${bucket}: ${item.product.name} | price=${
        item.bestOffer ? formatINR(item.bestOffer.price) : "Information unavailable"
      } | score=${Math.round(item.score)} | reasons=${item.reasons.join("; ")} | bestFor=${item.product.bestFor.join(
        ", "
      )} | avoid=${item.product.notIdealFor.join(", ")} | slug=/catalog/p/${item.product.slug}`
    );
  }
  lines.push("", "Ranked:");
  result.ranked.slice(0, 8).forEach((s, i) => {
    lines.push(
      `${i + 1}. ${s.product.name} | ${
        s.bestOffer ? formatINR(s.bestOffer.price) : "Information unavailable"
      } | score ${Math.round(s.score)} | /catalog/p/${s.product.slug}`
    );
  });
  lines.push("", ...result.notes);
  return { result, context: lines.join("\n") };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const req: RecommendationRequest =
      body.query || typeof body.q === "string"
        ? { ...parseNaturalQuery(String(body.query || body.q)), ...(body.request || {}) }
        : (body.request as RecommendationRequest) || parseNaturalQuery("");

    const { result, context } = buildAiContext(req);
    trackEvent({
      type: "recommend",
      query: req.query,
      meta: { hits: result.ranked.length, budget: req.budget ?? 0 },
    });

    let explanation: string | null = null;
    if (body.explain) {
      try {
        const messages: ChatMessage[] = [
          { role: "system", content: buildSystemPrompt("catalog", context) },
          {
            role: "user",
            content:
              body.prompt ||
              `Explain which product fits best for: ${req.query || "my needs"}. Use only the catalog data. Link to /catalog/p/... slugs. Never invent prices.`,
          },
        ];
        const aiRes = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages,
            stream: false,
            options: { temperature: 0.4, num_predict: 500, num_ctx: 3072 },
          }),
          signal: AbortSignal.timeout(90000),
        });
        if (aiRes.ok) {
          const json = (await aiRes.json()) as { message?: { content?: string } };
          explanation = json.message?.content || null;
        }
      } catch {
        explanation = null;
      }
    }

    return NextResponse.json({ request: req, result, context, explanation });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to recommend" }, { status: 500 });
  }
}
