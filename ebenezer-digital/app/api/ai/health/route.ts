import { NextResponse } from "next/server";
import { checkOllamaHealth, OLLAMA_MODEL } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const health = await checkOllamaHealth();
  return NextResponse.json(
    {
      service: "ebenezer-ai",
      status: health.ok ? "ready" : "degraded",
      model: health.model || OLLAMA_MODEL,
      models: health.models,
      error: health.error || null,
      ramNote:
        "This VPS is CPU-only (~8GB RAM). Nzer 1.0 (qwen2.5:1.5b) is optimised for this setup.",
    },
    { status: health.ok ? 200 : 503 }
  );
}
