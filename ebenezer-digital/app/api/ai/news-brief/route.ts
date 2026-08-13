import { NextResponse } from "next/server";
import {
  buildSystemPrompt,
  OLLAMA_BASE_URL,
  OLLAMA_MODEL,
  validateInternalApiKey,
} from "@/lib/ai";
import { listPublicNews } from "@/lib/news-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * World news brief for viewers — uses live desk headlines + Ollama.
 * Keeps context small so the CPU 1.5b model can handle it.
 */
export async function GET(request: Request) {
  if (!validateInternalApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const region = (searchParams.get("region") || "").trim();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  try {
    let stories = await listPublicNews();
    if (region) {
      const r = region.toLowerCase();
      stories = stories.filter(
        (s) =>
          s.region.toLowerCase().includes(r) ||
          s.topic.toLowerCase().includes(r) ||
          s.location.toLowerCase().includes(r)
      );
    }
    if (q) {
      stories = stories.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.dek.toLowerCase().includes(q) ||
          s.topic.toLowerCase().includes(q)
      );
    }

    const top = stories.slice(0, 12);
    if (!top.length) {
      return NextResponse.json(
        { error: "No stories available for a brief right now." },
        { status: 404 }
      );
    }

    const context = top
      .map(
        (s, i) =>
          `${i + 1}. [${s.region}] ${s.title} — ${s.dek} (source: ${s.sourceLabel})`
      )
      .join("\n");

    const userAsk = region
      ? `Give a short world news brief focused on "${region}" for a busy reader.`
      : q
        ? `Give a short news brief about "${q}" using these headlines.`
        : "Give a short world news brief: 6–8 bullet points covering different regions. End with one 'Watch next' line.";

    const ollamaRes = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          { role: "system", content: buildSystemPrompt("news", context) },
          { role: "user", content: userAsk },
        ],
        options: { temperature: 0.35, num_predict: 450, num_ctx: 2048 },
      }),
      signal: AbortSignal.timeout(110000),
    });

    if (!ollamaRes.ok) {
      const detail = await ollamaRes.text().catch(() => "");
      return NextResponse.json(
        { error: "Model server error", detail: detail.slice(0, 400) },
        { status: 502 }
      );
    }

    const data = await ollamaRes.json();
    const brief = data?.message?.content || "";

    return NextResponse.json({
      brief,
      model: OLLAMA_MODEL,
      count: top.length,
      stories: top.map((s) => ({
        slug: s.slug,
        title: s.title,
        region: s.region,
        sourceLabel: s.sourceLabel,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to build news brief",
        hint: "Ensure Ollama is running and news feeds are available.",
      },
      { status: 503 }
    );
  }
}
